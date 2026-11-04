/**
 * Centralized Visual Asset & Document Manifest (`assets.md` + `design.md`)
 *
 * Phase 2 & 3 Status: All visual assets generated via Nano Banana & mastered for
 * exact `--paper: #F8F7F3` white-point and 32-bit RGBA alpha continuity, with
 * seamless motion loops (`hero_scene_loop.webp`, `why_me_character_emote_loop.webp`,
 * RGBA `AVATAR_WALK_SEQUENCE`, and optional Veo `.mp4` drop-in via `npm run generate:veo`).
 */

export interface AssetDefinition {
  id: string;
  filename: string;
  src: string;
  posterSrc?: string;
  fallbackStillSrc?: string;
  type: 'still' | 'video-loop' | 'transparent-still' | 'transparent-video';
  aspectRatio: string;
  alt: string;
  placementNote: string;
  supplied: boolean;
}

export const RESUME_ASSET = {
  id: 'DOC-RESUME',
  filename: 'harsh_choudhary_resume.pdf',
  href: '/assets/shared/harsh_choudhary_resume.pdf',
  supplied: true,
} as const;

export const AVATAR_WALK_SEQUENCE = {
  standSrc: '/assets/career/avatar_stand.webp',
  gaitFrames: [
    '/assets/career/avatar_stride_a.webp',
    '/assets/career/avatar_pass.webp',
    '/assets/career/avatar_stride_b.webp',
    '/assets/career/avatar_stand.webp',
  ],
} as const;

export const WHY_ME_REACTION_SOURCES: Record<string, string> = {
  'extreme-ownership': '/assets/why-me/reaction_ownership.webp',
  'high-agency': '/assets/why-me/reaction_agency.webp',
  curiosity: '/assets/why-me/reaction_curiosity.webp',
  adaptability: '/assets/why-me/reaction_adaptability.webp',
};

export const ASSET_MANIFEST: Record<string, AssetDefinition> = {
  A01: {
    id: 'A01',
    filename: 'avatar_master_reference.png',
    src: '/assets/shared/avatar_master_reference.png',
    type: 'still',
    aspectRatio: '3 / 4',
    alt: 'Full-body studio portrait reference of Harsh Choudhary in a cream crewneck T-shirt and blue jeans.',
    placementNote: 'Master identity reference for photorealistic avatar continuity',
    supplied: true,
  },
  A02: {
    id: 'A02',
    filename: 'hero_scene_master.webp',
    src: '/assets/hero/hero_scene_master.webp',
    type: 'still',
    aspectRatio: '16 / 9',
    alt: 'Photorealistic Harsh Choudhary in a cream T-shirt and blue jeans placing a hand-sculpted plasticine block into a miniature clay world.',
    placementNote: 'Homepage Hero · Central / lower-middle studio miniature stage',
    supplied: true,
  },
  A03: {
    id: 'A03',
    filename: 'hero_scene_loop.webp',
    src: '/assets/hero/hero_scene_loop.webp',
    posterSrc: '/assets/hero/hero_scene_poster.webp',
    fallbackStillSrc: '/assets/hero/hero_scene_master.webp',
    type: 'video-loop',
    aspectRatio: '16 / 9',
    alt: 'Harsh carefully placing and adjusting a small tactile clay piece inside a miniature studio landscape.',
    placementNote: 'Homepage Hero · 5.4s locked-camera tactile loop',
    supplied: true,
  },
  A04: {
    id: 'A04',
    filename: 'wispr_voice_sculpture.webp',
    src: '/assets/wispr/wispr_voice_sculpture.webp',
    type: 'transparent-still',
    aspectRatio: '1 / 1',
    alt: 'Minimal abstract hand-sculpted plasticine sound ripple form.',
    placementNote: 'Why Wispr Flow · Quiet sculptural voice motif',
    supplied: true,
  },
  A05: {
    id: 'A05',
    filename: 'why_me_character_stage_master.webp',
    src: '/assets/why-me/why_me_character_stage_master.webp',
    type: 'transparent-still',
    aspectRatio: '4 / 5',
    alt: 'Full-body tactile plasticine avatar of Harsh Choudhary standing on a circular clay plinth.',
    placementNote: 'Why Me · Full-body clay character master (left stage)',
    supplied: true,
  },
  A06: {
    id: 'A06',
    filename: 'why_me_character_emote_loop.webp',
    src: '/assets/why-me/why_me_character_emote_loop.webp',
    posterSrc: '/assets/why-me/why_me_character_poster.webp',
    fallbackStillSrc: '/assets/why-me/why_me_character_stage_master.webp',
    type: 'transparent-video',
    aspectRatio: '4 / 5',
    alt: 'Hand-sculpted clay avatar of Harsh performing subtle looping idle, observant, shrugging, thoughtful, and nodding emotes.',
    placementNote: 'Why Me · Independent stop-motion RGBA clay emote loop + poster',
    supplied: true,
  },
  A11a: {
    id: 'A11a',
    filename: 'lore_extreme_ownership_scene.webp',
    src: '/assets/why-me/lore_extreme_ownership_scene.webp',
    type: 'still',
    aspectRatio: '4 / 3',
    alt: 'Miniature clay cutaway office desk with warm lamp and neat analytical project ledgers.',
    placementNote: 'Character Lore Panel · Extreme ownership studio vignette',
    supplied: true,
  },
  A11b: {
    id: 'A11b',
    filename: 'lore_high_agency_scene.webp',
    src: '/assets/why-me/lore_high_agency_scene.webp',
    type: 'still',
    aspectRatio: '4 / 3',
    alt: 'Miniature clay builder workshop with glowing abstract monitor, hand tools, and modular prototypes.',
    placementNote: 'Character Lore Panel · High agency studio vignette',
    supplied: true,
  },
  A11c: {
    id: 'A11c',
    filename: 'lore_curiosity_scene.webp',
    src: '/assets/why-me/lore_curiosity_scene.webp',
    type: 'still',
    aspectRatio: '4 / 3',
    alt: 'Two-story miniature clay library bookshelves and glowing research lamp.',
    placementNote: 'Character Lore Panel · Curiosity studio vignette',
    supplied: true,
  },
  A11d: {
    id: 'A11d',
    filename: 'lore_adaptability_scene.webp',
    src: '/assets/why-me/lore_adaptability_scene.webp',
    type: 'still',
    aspectRatio: '4 / 3',
    alt: 'Completed multi-material clay prototype on a wooden plinth beside sculpting tools.',
    placementNote: 'Character Lore Panel · Adaptability studio vignette',
    supplied: true,
  },
  A12: {
    id: 'A12',
    filename: 'why_hire_me_scene.webp',
    src: '/assets/why-me/why_hire_me_scene.webp',
    type: 'still',
    aspectRatio: '16 / 9',
    alt: 'Open miniature studio workbench featuring a completed sculptural prototype and purposeful sculpting tools.',
    placementNote: 'Why Hire Me · Calm workspace & completed prototype scene',
    supplied: true,
  },
  A13: {
    id: 'A13',
    filename: 'object_reading.webp',
    src: '/assets/beyond/object_reading.webp',
    type: 'transparent-still',
    aspectRatio: '1 / 1',
    alt: 'Hand-sculpted clay open book rising into an abstract desert dune ridge.',
    placementNote: 'Beyond the Screen · Reading / science-fiction sculptural object',
    supplied: true,
  },
  A14: {
    id: 'A14',
    filename: 'object_building.webp',
    src: '/assets/beyond/object_building.webp',
    type: 'transparent-still',
    aspectRatio: '1 / 1',
    alt: 'Miniature clay modular prototype paired with a wooden and clay caliper tool.',
    placementNote: 'Beyond the Screen · Tinkering / building sculptural object',
    supplied: true,
  },
  A15: {
    id: 'A15',
    filename: 'object_football.webp',
    src: '/assets/beyond/object_football.webp',
    type: 'transparent-still',
    aspectRatio: '1 / 1',
    alt: 'Matte hand-sculpted plasticine football with terracotta seam detail and no crest.',
    placementNote: 'Beyond the Screen · Generic clay football object',
    supplied: true,
  },
  A16: {
    id: 'A16',
    filename: 'object_training.webp',
    src: '/assets/beyond/object_training.webp',
    type: 'transparent-still',
    aspectRatio: '1 / 1',
    alt: 'Miniature matte clay barbell weight plate with forest-green inner rings.',
    placementNote: 'Beyond the Screen · Strength & running sculptural object',
    supplied: true,
  },
  A20: {
    id: 'A20',
    filename: 'career_world_panorama_master.webp',
    src: '/assets/career/career_world_panorama_master.webp',
    type: 'still',
    aspectRatio: '16 / 9',
    alt: 'Continuous miniature clay landscape connecting four career buildings along one stone walkway.',
    placementNote: 'About Journey · Master connected panorama reference',
    supplied: true,
  },
  A21: {
    id: 'A21',
    filename: 'career_grant_thornton_scene.webp',
    src: '/assets/career/grant-thornton/career_grant_thornton_scene.webp',
    type: 'still',
    aspectRatio: '16 / 9',
    alt: 'Symmetrical miniature institutional consulting building in cream, charcoal, and muted forest green with cutaway project desk.',
    placementNote: 'About Chapter 01 · Grant Thornton miniature building plate',
    supplied: true,
  },
  A22: {
    id: 'A22',
    filename: 'career_ian_scene.webp',
    src: '/assets/career/ian/career_ian_scene.webp',
    type: 'still',
    aspectRatio: '16 / 9',
    alt: 'Miniature collaborative early-stage startup pavilion with circular founder-investor table and geometric prototypes.',
    placementNote: 'About Chapter 02 · Indian Angel Network miniature building plate',
    supplied: true,
  },
  A23: {
    id: 'A23',
    filename: 'career_kalaari_scene.webp',
    src: '/assets/career/kalaari/career_kalaari_scene.webp',
    type: 'still',
    aspectRatio: '16 / 9',
    alt: 'Substantial two-story miniature venture capital research studio with cutaway library walls and investment desk.',
    placementNote: 'About Chapter 03 · Kalaari Capital miniature building plate',
    supplied: true,
  },
  A24: {
    id: 'A24',
    filename: 'career_independent_building_scene.webp',
    src: '/assets/career/independent-building/career_independent_building_scene.webp',
    type: 'still',
    aspectRatio: '16 / 9',
    alt: 'Open miniature founder workshop with maker workbench, tool pegboard, abstract glowing monitor, and gears in progress.',
    placementNote: 'About Chapter 04 · Independent Building workshop plate',
    supplied: true,
  },
  A25: {
    id: 'A25',
    filename: 'avatar_stand.webp',
    src: '/assets/career/avatar_stand.webp',
    type: 'transparent-still',
    aspectRatio: '3 / 5',
    alt: 'Photorealistic Harsh Choudhary in cream T-shirt and blue jeans walking along the miniature career world walkway.',
    placementNote: 'About Journey · Layered RGBA walking & paused avatar pass',
    supplied: true,
  },
};
