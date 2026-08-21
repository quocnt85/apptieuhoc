# NovaStars audio safety

All Tone.js sound must be created in `toneAudioEngine.ts` and routed through the shared
`AudioSafetyGraph`:

- Use `routeBgm(source, "dry" | "reverb" | "chorus")` for music.
- Use `routeSfx(source, "dry" | "reverb")` for UI, gameplay, spaceship and
  hyperspace effects.
- Never use `toDestination()`, `Tone.Destination`, or create a separate master
  output outside `audioSafety.ts`.

The BGM bus removes continuous sub pressure and attenuates low bass before the
master compressor. The SFX bus removes sub energy and softens the presence band
and high frequencies. Reverb and chorus returns also terminate inside their
category's protected bus.

When adding a continuous sound, give it an explicit gain envelope and dispose
every source, filter and gain node on stop. Temporary sounds must capture their
own node references in cleanup callbacks so an old timer cannot dispose a newer
sound.

Run `npm run check:audio-safety`; it is also part of the production build.
