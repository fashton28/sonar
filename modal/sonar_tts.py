# Sonar TTS — Chatterbox served on Modal as an HTTPS endpoint.
#
# NOTE: this file must NOT be named chatterbox.py (or modal.py) — a script named the
# same as a package it imports shadows that package on sys.path and breaks the import.
#
# This is the ONLY Python in Sonar. It is a self-contained web service: the rest of
# the app (TypeScript) talks to it over HTTP. See learning/lessons/0004 for the why.
#
# Develop with live reload:  modal serve modal/sonar_tts.py
# Deploy a stable URL:        modal deploy modal/sonar_tts.py
# Smoke test (replace <URL> with the api endpoint Modal prints):
#   curl -X POST <URL> -H 'Content-Type: application/json' \
#     --data '{"text":"Sonar online. The future sounds like this."}' \
#     --output /tmp/sonar.wav

import modal

# 1) The Image = a reproducible container recipe. Mirrors Modal's official Chatterbox
#    example pins (known-good) so the first deploy works.
image = modal.Image.debian_slim(python_version="3.10").uv_pip_install(
    "chatterbox-tts==0.1.6",
    "fastapi[standard]==0.124.4",
    "peft==0.18.0",
)

# Heavy imports run INSIDE the container only (not on your laptop when the CLI parses
# this file). That's what `with image.imports()` is for.
with image.imports():
    import io

    import torchaudio as ta
    from chatterbox.tts import ChatterboxTTS
    from fastapi.responses import StreamingResponse

app = modal.App("sonar-chatterbox-tts", image=image)


# 2) A GPU class. One container = one loaded model, reused across requests.
@app.cls(
    gpu="a10g",
    scaledown_window=60 * 5,  # stay warm 5 min after the last request, then scale to 0
    timeout=60 * 10,
)
@modal.concurrent(max_inputs=10)  # up to 10 requests share one warm container
class Chatterbox:
    @modal.enter()
    def load(self):
        # Runs ONCE per container, on cold start. This is the slow part (weights → GPU).
        self.model = ChatterboxTTS.from_pretrained(device="cuda")

    @modal.method()
    def generate(
        self,
        text: str,
        exaggeration: float = 0.5,
        cfg_weight: float = 0.5,
        temperature: float = 0.8,
    ) -> bytes:
        wav = self.model.generate(
            text,
            exaggeration=exaggeration,
            cfg_weight=cfg_weight,
            temperature=temperature,
        )
        # Encode the waveform tensor to WAV bytes in memory.
        buffer = io.BytesIO()
        ta.save(buffer, wav, self.model.sr, format="wav")
        buffer.seek(0)
        return buffer.read()

    # 3) The HTTP seam. POST JSON -> audio/wav bytes. This URL is what tRPC will fetch().
    @modal.fastapi_endpoint(method="POST", docs=True)
    def api(self, item: dict):
        audio_bytes = self.generate.local(
            item["text"],
            item.get("exaggeration", 0.5),
            item.get("cfg_weight", 0.5),
            item.get("temperature", 0.8),
        )
        return StreamingResponse(io.BytesIO(audio_bytes), media_type="audio/wav")


# Optional: `modal run modal/sonar_tts.py` to test generation without the HTTP layer.
@app.local_entrypoint()
def main(text: str = "Sonar online. The future sounds like this."):
    audio = Chatterbox().generate.remote(text)
    with open("/tmp/sonar-tts.wav", "wb") as f:
        f.write(audio)
    print("wrote /tmp/sonar-tts.wav")
