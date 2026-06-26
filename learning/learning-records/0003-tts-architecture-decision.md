# Architecture decision: Chatterbox model as a Modal HTTP service, called from tRPC

For Sonar's TTS, we will NOT bridge Python and TypeScript in-process. Instead: the Chatterbox
model runs as a **Python-native Modal app** exposed as an **HTTPS web endpoint**
(`@modal.fastapi_endpoint`, GPU class with `@modal.enter` model loading), and Sonar's
**TypeScript tRPC `protectedProcedure` calls it over `fetch()`**. The browser never calls Modal
directly — the tRPC procedure owns the Modal URL + token, Clerk auth, org-scoping, Zod
validation, and (later) R2 storage + `Generation` persistence.

**Why it matters for future sessions:** This is the load-bearing seam of the whole backend.
Every TTS build lesson hangs off it. The boundary being plain HTTP means the model provider is
swappable (Modal → RunPod, Chatterbox → other) by changing only the inside of one tRPC function.
Grounded in the official Modal Chatterbox example (modal.com/docs/examples/chatterbox_tts) and
Modal web-endpoints guide.

**Known open item:** the form's params (`temperature/topP/topK/repetitionPenalty`) do NOT match
Chatterbox's real `generate()` knobs (`exaggeration`, `cfg_weight`, `temperature`, …). The Zod
input schema + form sliders must be reconciled against the actual `chatterbox-tts` package
signature during the build — do not assume the current four params map 1:1.

**Mission status:** still the same mission (master the tRPC/Next backend by building Sonar) — this
extends it into external-service integration; not a mission change.
