# Python import shadowing: never name a script after a package it imports

Deploying the Modal app failed because the file was named `chatterbox.py`. Inside the container
(mounted at `/root/chatterbox.py`, with `/root` first on `sys.path`), `from chatterbox.tts import
ChatterboxTTS` resolved to OUR OWN script instead of the installed `chatterbox-tts` package →
`ModuleNotFoundError: ... 'chatterbox' is not a package`, and the container crash-looped.
Renaming to `sonar_tts.py` fixed it instantly (redeploy 1.7s, cached image). Same class of bug as
the `modal.py` trap we deliberately avoided earlier.

**Why it matters for future sessions:** the user now owns a durable, generalizable rule — a local
module on `sys.path[0]` beats a same-named installed package (a *regular* local module wins; the
earlier `modal/` dir was saved only because a no-`__init__` namespace dir is lowest priority).
Also reinforced two debugging skills: (1) read the REMOTE logs (`modal app logs <app>`) as the
real diagnosis source, and (2) a crash-looping Modal container surfaces at the HTTP layer as a
303/150s timeout + "bad redirect method", NOT a clean 500 — don't be misled by the surface symptom.

**Status:** TTS endpoint deployed & verified working (cold ~45s, warm ~2.5s). URL recorded in NOTES.
