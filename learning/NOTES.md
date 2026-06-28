# Teaching Notes — Sonar / tRPC

## Learner profile
- Strong React + JS/TS. Solid Next.js App Router foundations: routing, RSC vs `"use client"`,
  component modularization (subcomponents → shell → simple `page.tsx`). **Do not re-teach these.**
- Building Sonar (TTS app) for real. Highly motivated, sat down for a focused session.
- Currently parked in `src/trpc/routers/_app.ts` thinking "this is where the API gets built."

## Editor / environment
- Uses **Neovim + LazyVim** (NOT VS Code/Cursor). Stop using "VS Code red squiggles" framing —
  say "LSP diagnostics" and reference `:LspInfo`, Trouble (`<leader>xx`), `]d`/`[d`.
- Session 4: was getting NO inline diagnostics because the TS language server wasn't running.
  Fix given: enable `lang.typescript` (vtsls) + `linting.eslint` via `:LazyExtras`. Confirm once
  they report it works — until then, assume they may not see type/syntax errors as they type, so
  keep being explicit about exact line-level mistakes when reviewing their code.

## Workflow (set session 7)
- There is a **course index** at `learning/index.html` linking every lesson + the reference.
- From now on: whenever I create a new lesson, ADD a card for it to `index.html` (right unit,
  with a concept/build/walkthrough tag), then **launch the index** (`open learning/index.html`)
  to showcase it — instead of opening the lesson file directly. Update the progress-line count.

## Preferences
- Teach against the **real Sonar files**, not toy examples. Always cite the actual path.
- **Learn by progressively building the app.** (Stated explicitly in session 2.) Every concept
  should arrive *as a thing we build and run*, not as theory first. Lessons should be
  build-alongs with a "run it and see it work" feedback loop wherever possible.
- Wants mastery but in short lessons. Keep each lesson to one tangible win.
- Likes the "why," not just the "how." Justify every piece.

## Pedagogy plan (REORDERED in session 2 per "build it as we learn" preference)
1. ✅ 0001 — Anatomy of a tRPC request (the 7 files + the lifecycle). Mental model.
2. ✅ 0002 — First real round-trip: `healthcheck` query consumed client-side in `(dashboard)/test`.
   Working `ok` on screen. (Detoured to fix LazyVim LSP diagnostics — now resolved & confirmed.)
3. 🟡 0003 — Real context: Clerk `auth()` + Prisma in `ctx`; `baseProcedure` vs
   `protectedProcedure` + `isAuthed` middleware + a `me` query (server-derived identity, no
   client input). Kills `userId: 'user_123'`. Requires both userId AND orgId (Sonar is org-scoped).
4. ⬜ 0004 — First real router: `voices.list` query (Zod input, Prisma, org-scoped via `ctx.orgId`).
5. ✅ 0004 — Architecture: model-as-a-web-service. Chatterbox on Modal (Python, HTTP endpoint)
   called from a tRPC mutation. The seam = HTTP. See LR-0003. (Pivoted here at user's request to
   focus the rest of the arc on shipping TTS.)
6. 🟡 0005 — Build & deploy the Modal Chatterbox Python app (`modal/chatterbox.py` WRITTEN, uses
   standard ChatterboxTTS default voice = NO voices volume needed; no HF secret unless gated).
   User to run: signup, `pip install modal`, `modal setup`, `modal deploy`, curl test.
7. ✅ 0006 — Full walkthrough: bridging Modal→tRPC→client. Lesson covers all 6 files (env, tts
   router, mount, sliders, form mutation+context, audio playback). NOT yet implemented in repo —
   user wanted the walkthrough first; offered to implement on "implement it".
8. ⬜ 0007 — (stretch) R2 storage + `Generation` persistence + History tab.
9. ⬜ later — Server Components prefetch/HydrateClient; superjson transformer; `TRPCError` handling.

## Session 13 — voice cloning BACKEND implemented + tested working (user asked me to do it)
- `_app.ts` RESTORED: hello + healthcheck (lowercase) + me (protected) + tts + cloning. Build green
  (0 tsc errors). [Superseded the "build broken" state from session 12.]
- `src/trpc/routers/cloning.ts` (NEW): `generate` mutation, input { text, audioBase64 } → POST Modal
  { text, voice_b64 } → base64 data URL back.
- `modal/sonar_tts.py`: generate() now takes `voice_b64` → base64 decode → tempfile → audio_prompt_path
  (None = default voice). api() forwards item.get("voice_b64"). REDEPLOYED (1.4s, cached image).
- `voice-cloning-form.tsx`: generate() WIRED — fileToBase64 (FileReader) + clone.mutateAsync +
  setAudioUrl + toast on error.
- TESTED end-to-end via Modal: cold/warm clone returned HTTP 200 audio/wav 457KB RIFF WAVE. WORKS.
- Endpoint URL unchanged: https://fashton28--sonar-chatterbox-tts-chatterbox-api.modal.run
- Still v1: NO storage/persistence; reference rides in request as base64. Next: R2 + Voice (lesson 0007).

## Session 12 — voice cloning v1 (no storage): lesson 0008 + UI scaffold
- ⚠️ BUILD BROKEN (pre-existing): user's working-tree `_app.ts` regressed to hello + healthCheck
  only — lost `tts`/`me` mounts, `healthCheck` casing back. 9 tsc errors in test/health-check.tsx
  + text-to-speech-form.tsx. `init.ts` (protectedProcedure) + `tts.ts` intact. User did NOT
  authorize me to fix _app.ts (declined the question) — they'll restore it as part of their
  backend step. DO NOT touch _app.ts unless asked.
- Lesson 0008 = voice cloning v1, NO storage: reference clip rides in the request as base64
  (Option A). Modal extra lines: base64 decode → tempfile → audio_prompt_path. tRPC cloning.generate
  forwards voice_b64. Browser File→base64 via FileReader.readAsDataURL (NOT Node Buffer).
- Built UI scaffold under src/features/voice-cloning/ (self-contained, 0 tsc errors):
  voice-cloning-form.tsx (provider: audioFile/text/audioUrl/generate — generate() is a STUB with
  a TODO for the user), voice-upload-panel.tsx (file picker pane), cloning-text-input-panel.tsx
  (textarea + reused GenerateButton), cloning-preview.tsx (ElevenLabs AudioPlayer on result).
  Route: (dashboard)/voice-cloning/{page,layout}.tsx + views/. Reuses AudioPlayer + GenerateButton.
- USER'S backend task: restore _app.ts (tts+me+healthcheck) + add cloning router + mount it +
  Modal redeploy with voice_b64 + fill the generate() TODO. Split agreed: I do lesson+UI, they backend.

## Session 10 — lesson 0006 synced to real code; lesson 0007 (voice cloning) written
- 0006 updated to match actual impl: `toast` import + try/catch in onSubmit; preview markup
  (label + user removed `h-full`). Everything else was already identical.
- 0007 = voice cloning BLUEPRINT (user implements solo, asked for a lesson). Key decisions:
  - Chatterbox cloning = `model.generate(text, audio_prompt_path=ref.wav)`. Ref: ~10s clean WAV.
  - Architecture shift: voices = persistent state → forces R2 + `voices` router + the (already
    existing!) `Voice` model. No migration needed; `ctx.prisma`/`ctx.orgId` get cashed in.
  - Reference-to-GPU decision = Option C: store in R2, pass a short-lived presigned GET url,
    Modal downloads + caches BY OBJECT KEY (presigned urls vary each request).
  - Files: modal/sonar_tts.py (+voice_url), src/lib/r2.ts (new, @aws-sdk/client-s3 +
    s3-request-presigner), src/trpc/routers/voices.ts (create/list, org-scoped), tts.ts
    (+optional voiceId → presigned url), env.ts (+4 R2 vars), client selector + clone dialog.
  - Security drum: every voice `where` includes `orgId: ctx.orgId`.
- Next natural lesson 0008: persist `Generation` rows + History tab.

## DEPLOYED (session 8) — TTS endpoint is LIVE
- File: `modal/sonar_tts.py` (RENAMED from chatterbox.py — that name shadowed the chatterbox
  package in-container and crash-looped; see LR-0004).
- App: `sonar-chatterbox-tts`. **Endpoint URL (→ this becomes `MODAL_TTS_URL` in env.ts):**
  `https://fashton28--sonar-chatterbox-tts-chatterbox-api.modal.run`
- Verified: cold start ~45s (model load), warm ~2.5s. Returns RIFF WAVE mono 24kHz. Accepts
  `{text, exaggeration, cfg_weight, temperature}`.
- Standard ChatterboxTTS default voice works; NO HF token needed; NO voices volume.
- TODO before real use: endpoint is OPEN (anyone with URL spends GPU). Add bearer token (Modal
  Secret + Authorization header check) — flagged for a later lesson.
- Next session: the tRPC bridge (lesson 0006 already written) — plug the URL into env, build
  `tts.generate`, wire the form.

## IMPLEMENTED (session 9) — full v1 TTS bridge in repo, typechecks clean
- env.ts: + MODAL_TTS_URL (server). .env: appended the live Modal URL.
- src/trpc/routers/tts.ts (NEW): `generate` mutation (protected) → fetch Modal → base64 data URL.
- _app.ts: mounted `tts: ttsRouter`.
- sliders.ts: now exaggeration / temperature / cfgWeight (Chatterbox's real knobs).
- text-to-speech-form.tsx: new schema (voiceId DROPPED), `useMutation`, onSubmit→mutateAsync,
  TTSResultContext, toast.error on failure.
- voice-preview-placeholder.tsx: "use client", renders <audio autoPlay> when audioUrl present.
- Pending: user to restart dev + test in browser. Cold-start first gen ~30-45s. If a gen ever
  takes >150s it returns Modal's 303 → toast error → just retry (warm).

## v1 TTS bridge — decisions locked (session 7)
- Audio over JSON: tRPC `generate` returns `{ audio: "data:audio/wav;base64,..." }` (base64 a
  data URL). R2 phase later replaces with a short URL. Audio deliberately NOT in DB.
- Boundary name mapping: TS camelCase `cfgWeight` ↔ Python snake_case `cfg_weight` in the procedure.
- Param reconciliation: form sliders become exaggeration / temperature / cfgWeight (Chatterbox's
  real knobs). DROP `voiceId` from the form schema for v1 (default voice, no selector) — else the
  form can never be valid. Prisma `Generation` keeps topP/topK/repetitionPenalty until storage phase.
- Spinner: TanStack Form keeps `isSubmitting` true through the async `onSubmit`, so the existing
  GenerateButton spinner/disabled wiring works for free once onSubmit calls `mutateAsync`.
- Result sharing: tiny `TTSResultContext` in text-to-speech-form.tsx → consumed by VoicePreview.

## TTS build — key facts (from official Modal docs, session 6)
- Official example: `modal.Image.debian_slim(py3.10).uv_pip_install("chatterbox-tts==0.1.6",
  "fastapi[standard]", "peft")`. Class `@app.cls(gpu="a10g", scaledown_window=300,
  secrets=[Secret.from_name("hf-token")], volumes={...})`, `@modal.concurrent(max_inputs=10)`.
  `@modal.enter def load(): self.model = ChatterboxTurboTTS.from_pretrained(device="cuda")`.
  `@modal.fastapi_endpoint(method="POST")` returns `StreamingResponse(..., media_type="audio/wav")`.
- Needs: HF token (modal Secret), a voices Volume with prompt wavs (example uses Lucy.wav).
- Cold start = model load on first request (tens of seconds). Form spinner already exists; need
  generous timeout on the tRPC fetch.
- PARAM MISMATCH (open): form has temperature/topP/topK/repetitionPenalty; Chatterbox uses
  exaggeration/cfg_weight/temperature. Must reconcile — verify against resemble-ai/chatterbox.
- User MUST run interactively: `modal setup` (auth), `modal deploy`, `modal volume create/put`.
  I can write the files; they run the CLI.

## Misconceptions to watch for
- Thinking the router file is "where the whole backend lives" — it's the *registry*; logic,
  context, and transport are spread across init/context/route/server/client by design.
- Expecting an Express-style request/response object inside procedures (it's `ctx` + `input`).
