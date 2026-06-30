# Building Sonar: A Voice Cloning App on a Modern TypeScript Stack

*June 28, 2026*

Sonar is a text-to-speech and voice-cloning app - a leaner alternative to ElevenLabs.
This post is a field log of what we've built so far: a working TTS pipeline, a working voice-cloning pipeline, and the architecture that ties a Python ML model to a TypeScript web app without either side leaking into the other.

## The stack

- **Next.js 16** (App Router, RSC) for the frontend and server entry points.
- **tRPC v11** with `@trpc/tanstack-react-query` for the typed client/server contract.
- **Prisma 7** over Postgres for persistence (`Voice`, `Generation` models).
- **Clerk** for auth - org-scoped, so everything is multi-tenant by `orgId`.
- **Modal** for serverless GPU - this is where the actual ML model lives.
- **Chatterbox TTS** as the speech model.

The interesting part is not any single piece. It's the seam between the TypeScript world and the Python world, and the decision to keep that seam as thin as possible.

## The core architectural bet: model-as-a-web-service

There is exactly **one** Python file in this entire repo: `modal/sonar_tts.py`. Everything else is TypeScript.

The model doesn't get embedded, wrapped in a sidecar process, or shelled out to. It's deployed to Modal as a plain HTTPS endpoint. The rest of the app talks to it the same way it would talk to any third-party API: a `fetch()` with a JSON body.

```
Browser  ->  tRPC mutation  ->  fetch(MODAL_URL)  ->  Chatterbox on a GPU  ->  WAV bytes back
```

This is the "deep module" idea - a simple interface (one POST, JSON in, audio out) hiding a lot of complexity (model weights, CUDA, cold starts). HTTP is the seam. Either side can be rewritten without the other noticing.

## The Modal service

Modal lets you write a GPU service as a decorated Python class. The shape that matters:

```python
@app.cls(gpu="a10g", scaledown_window=60 * 5, timeout=60 * 10)
@modal.concurrent(max_inputs=10)
class Chatterbox:
    @modal.enter()
    def load(self):
        # Runs ONCE per container, on cold start. The slow part: weights -> GPU.
        self.model = ChatterboxTTS.from_pretrained(device="cuda")

    @modal.method()
    def generate(self, text, exaggeration=0.5, cfg_weight=0.5,
                 temperature=0.8, voice_b64=None):
        ...

    @modal.fastapi_endpoint(method="POST", docs=True)
    def api(self, item: dict):
        audio_bytes = self.generate.local(...)
        return StreamingResponse(io.BytesIO(audio_bytes), media_type="audio/wav")
```

A few things worth calling out:

- **`@modal.enter` is the cold-start hook.** The model loads once per container and is reused across requests. Cold start is ~30-45s (loading weights onto the GPU); a warm container answers in ~2.5s.
- **`scaledown_window`** keeps the container warm for 5 minutes after the last request, then scales to zero so you stop paying.
- **`@modal.concurrent(max_inputs=10)`** lets one warm container serve up to 10 requests at once.
- **Imports live inside `with image.imports()`** so the heavy ML libraries are only imported inside the container, never when the CLI parses the file on your laptop.

### A debugging war story: never name a file after a package it imports

The original file was called `chatterbox.py`. Inside the container, `from chatterbox.tts import ChatterboxTTS` resolved the *script itself* instead of the installed `chatterbox` package - because a script shadows a same-named package on `sys.path`. The result was a crash-loop that surfaced as an HTTP 303 and a 150-second timeout, with nothing obviously wrong in the code.

The fix was a rename to `sonar_tts.py`. The lesson is general: **don't name a module after a library it imports.** It was diagnosed by reading `modal app logs` - the container told the truth even when the HTTP layer didn't.

## The tRPC bridge

On the TypeScript side, the model is just a mutation. Here's the voice-cloning router in full:

```ts
export const cloningRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(z.object({
      text: z.string().min(1).max(5000),
      audioBase64: z.string().min(1), // the reference voice clip, base64-encoded
    }))
    .mutation(async ({ input }) => {
      const res = await fetch(env.MODAL_TTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.text, voice_b64: input.audioBase64 }),
      });

      if (!res.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `TTS service responded ${res.status}`,
        });
      }

      const bytes = await res.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      return { audio: `data:audio/wav;base64,${base64}` };
    }),
});
```

Design decisions baked into those 38 lines:

- **`protectedProcedure`** means the middleware has already verified a Clerk session and stuffed `userId` + `orgId` into context. The procedure body never has to think about auth.
- **Binary over JSON via base64 data URLs.** The mutation returns `data:audio/wav;base64,...`, which a browser `<audio>` element or the player component can consume directly. No blob storage needed for v1. (This will be swapped for a short R2 URL later.)
- **Boundary name mapping.** TypeScript's camelCase `cfgWeight` becomes Python's snake_case `cfg_weight` right here, at the boundary, so neither side has to know the other's conventions.

## Voice cloning, v1: no storage on purpose

Chatterbox does zero-shot voice cloning. You hand `model.generate()` an `audio_prompt_path` pointing at a ~10-second clean reference clip, and it speaks your text in that voice. No training, no fine-tuning.

The v1 design choice was deliberate: **no storage at all.** The reference clip rides inside the request as base64, gets decoded to a temp file on the GPU, conditions the generation, and is then discarded.

```python
audio_prompt_path = None
if voice_b64:
    data = base64.b64decode(voice_b64)
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    tmp.write(data); tmp.flush()
    audio_prompt_path = tmp.name
```

`None` falls back to Chatterbox's built-in default voice, so plain TTS and cloning share the exact same code path. That's the entire difference between the two products: one passes `voice_b64`, the other doesn't.

On the browser side, turning a `File` into base64 uses `FileReader`, not Node's `Buffer` (which doesn't exist in the browser):

```ts
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string; // "data:audio/wav;base64,AAAA…"
      resolve(dataUrl.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

The full loop - upload a clip, type text, submit, get cloned audio back - is verified end to end. A test clone returned `HTTP 200 · audio/wav · 457 KB · RIFF WAVE mono 24 kHz`.

## The UI

The voice-cloning route reuses the TTS form's structure but splits the input into two panes: one for uploading the reference voice, one for the text. Both products share the same `GenerateButton` (with its spinner/disabled wiring) and the same ElevenLabs UI `AudioPlayer` for playback. The form state lives in a small React context so the upload panel, text panel, and preview can all read and write the same `audioFile` / `text` / `audioUrl`.

A note on the player: the ElevenLabs registry was bot-blocking the shadcn CLI (HTTP 429), so the component was installed from the `elevenlabs/ui` GitHub source directly, with its internal import paths rewritten to match this project's structure.

## Where it stands

Working today:

- TTS pipeline: text in, default-voice speech out.
- Voice cloning pipeline: reference clip + text in, cloned speech out.
- Both deployed on Modal and verified end to end. Type-checks clean.

Deliberately deferred:

- **Storage.** v1 keeps nothing - refresh the page and the voice is gone. The next phase adds R2 object storage plus the `Voice` table, so a voice is uploaded once and reused by `voiceId` instead of re-sending bytes every request.
- **Securing the endpoint.** The Modal URL is currently open - anyone with it can spend GPU time. A bearer token (Modal Secret + an `Authorization` check) is the fix.

The shape of the whole thing is the point: a Python model that knows nothing about the web app, a TypeScript app that treats the model as just another API, and a single HTTP seam between them that either side can evolve independently.
