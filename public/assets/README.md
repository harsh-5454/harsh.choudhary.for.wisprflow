# Harsh Choudhary Portfolio — Production Visual Assets

All visual assets (`A01`–`A25`) and the resume document (`DOC-RESUME`) are generated, studio-mastered against `--paper: #F8F7F3` and 32-bit `RGBA` alpha, and wired in `src/config/assets.ts` (`supplied: true`). All website copy remains live HTML — zero baked text, captions, or logos.

## Production Asset Inventory

- `shared/avatar_master_reference.png` — **A01**: Full-body photorealistic Harsh identity & outfit master reference
- `shared/harsh_choudhary_resume.pdf` — **DOC-RESUME**: Harsh Choudhary resume PDF
- `hero/hero_scene_master.webp` — **A02**: Hero miniature scene master still (`16:9`, white-point calibrated to `#F8F7F3`)
- `hero/hero_scene_poster.webp` — **A03 (Poster)**: Static poster frame for reduced-motion & initial paint
- `hero/hero_scene_loop.webp` — **A03**: Seamless `5.4s` locked-camera sRGB loop (`0.000` background delta on `#F8F7F3`)
- `wispr/wispr_voice_sculpture.webp` — **A04**: Transparent `RGBA` `1:1` sculptural clay voice ripple
- `why-me/why_me_character_stage_master.webp` — **A05**: Full-body `RGBA` plasticine Harsh character stage master (`4:5`)
- `why-me/why_me_character_poster.webp` — **A06 (Poster)**: Static `RGBA` poster frame for pause / reduced-motion
- `why-me/why_me_character_emote_loop.webp` — **A06**: Seamless `6.38s` 44-pose `RGBA` stop-motion claymation emote loop
- `why-me/reaction_{ownership,agency,curiosity,adaptability}.webp` — **A07–A10**: `RGBA` strength-selection reaction poses
- `why-me/lore_{extreme_ownership,high_agency,curiosity,adaptability}_scene.webp` — **A11a–A11d**: `4:3` clay cutaway vignettes for Character Lore dossiers
- `why-me/why_hire_me_scene.webp` — **A12**: Calm open studio workbench with completed sculptural prototype (`16:9`)
- `beyond/object_{reading,building,football,training}.webp` — **A13–A16**: Transparent `RGBA` `1:1` sculptural objects with studio contact shadows
- `career/career_world_panorama_master.webp` — **A20**: Continuous 4-building miniature panorama master (`16:9`)
- `career/grant-thornton/career_grant_thornton_scene.webp` — **A21**: Chapter 01 Grant Thornton scene plate (`16:9`)
- `career/ian/career_ian_scene.webp` — **A22**: Chapter 02 Indian Angel Network scene plate (`16:9`)
- `career/kalaari/career_kalaari_scene.webp` — **A23**: Chapter 03 Kalaari Capital scene plate (`16:9`)
- `career/independent-building/career_independent_building_scene.webp` — **A24**: Chapter 04 Independent Building workshop plate (`16:9`)
- `career/avatar_{stand,stride_a,pass,stride_b}.webp` — **A25**: Layered `RGBA` standing & scroll-scrubbed walking gait frames

## Optional Google Veo 3.1 Video Loop Pipeline

`AssetStage.tsx` supports both animated `sRGB`/`RGBA` `.webp` loops and native `.mp4`/`.webm` `<video>`. To generate optional Google Veo 3.1 (`veo-3.1-generate-preview`) `.mp4` takes from the Nano Banana keyframes when `GEMINI_API_KEY` is configured in `.env`:

```bash
npm run generate:veo
```
