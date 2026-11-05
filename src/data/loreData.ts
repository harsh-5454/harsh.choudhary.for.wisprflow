/**
 * Character Lore & Wiki Data Repository
 *
 * Powers the Clay Computer Monitor Wiki popup for "Explore character lore".
 */

export interface LoreTraitItem {
  id: string;
  number: string;
  title: string;
  specialAbility: string;
  paragraphs: string[];
}

export interface LoreInfoboxTrait {
  number: string;
  name: string;
  specialAbility: string;
}

export interface WikiData {
  meta: {
    title: string;
    subtitle: string;
    canonicalBadge: string;
    lastRevision: string;
  };
  avatar: {
    src: string;
    alt: string;
    caption: string;
  };
  traits: LoreTraitItem[];
  infobox: {
    name: string;
    subtitle: string;
    role: string;
    alignment: string;
    targetTeam: string;
    status: string;
    traitsAndAbilities: LoreInfoboxTrait[];
  };
}

export const LORE_WIKI_DATA: WikiData = {
  meta: {
    title: 'Harsh Choudhary',
    subtitle: 'Character Lore · Traits & Abilities',
    canonicalBadge: 'Canonical Entry · Wispr Flow',
    lastRevision: 'November 2026',
  },

  avatar: {
    src: '/assets/why-me/why_me_character_stage_master.webp',
    alt: 'Claymation avatar of Harsh Choudhary',
    caption: 'Harsh Choudhary (Claymation Character Avatar)',
  },

  traits: [
    {
      id: 'extreme-ownership',
      number: '01',
      title: 'Extreme Ownership',
      specialAbility: 'Sees things through to the last detail.',
      paragraphs: [
        "At Kalaari, Harsh led the writing and production of the firm's annual industry report. What followed was an unusually demanding, time-sensitive project that involved working 16-hour days over a stretch of nearly two months.",
        "As the report approached completion, Harsh spent two consecutive days at the designer's office, working closely with them on the final details — reviewing layouts, refining pages, checking content and making sure everything was in place before publication.",
        "For Harsh, getting a project across the finish line also means paying attention to the details that often go unnoticed.",
      ],
    },
    {
      id: 'initiative-agency',
      number: '02',
      title: 'Initiative & Agency',
      specialAbility: 'Spots a bottleneck and starts fixing it.',
      paragraphs: [
        "During his time at Indian Angel Network, Harsh noticed a growing backlog of inbound investment opportunities awaiting evaluation. Rather than letting it remain an operational bottleneck, he took the initiative to rethink the process.",
        "He designed a new deal evaluation workflow, introduced a structured training programme for interns, and managed a rotating team of 5–6 interns each month.",
        "The changes helped increase deal evaluation throughput by 50%, while creating a more structured and scalable process for handling inbound opportunities.",
      ],
    },
    {
      id: 'curiosity',
      number: '03',
      title: 'Curiosity',
      specialAbility: 'Can go from zero to reasonably dangerous at almost anything.',
      paragraphs: [
        "Harsh has a habit of going down rabbit holes and emerging with an entirely new skill. Over the years, he's taught himself to code and build small tools, picked up the guitar without formal lessons, and ventured into data analytics, building dashboards and working with SQL despite having no technical background.",
        "He's also experimented with building voice agents, connecting APIs and putting together little software projects just to see if he could make them work.",
        "The common thread? Harsh doesn't particularly enjoy being limited by what he already knows. If something catches his interest, he'll usually find a way to learn enough to give it a shot.",
      ],
    },
  ],

  infobox: {
    name: 'Harsh Choudhary',
    subtitle: 'Character Lore · Traits & Abilities',
    role: 'Generalist / Operator / Product Builder',
    alignment: 'Extreme Ownership · High Agency',
    targetTeam: 'Wispr Flow (Growth & Product)',
    status: 'Active · Ready to ship',
    traitsAndAbilities: [
      {
        number: '01',
        name: 'Extreme Ownership',
        specialAbility: 'Sees things through to the last detail.',
      },
      {
        number: '02',
        name: 'Initiative & Agency',
        specialAbility: 'Spots a bottleneck and starts fixing it.',
      },
      {
        number: '03',
        name: 'Curiosity',
        specialAbility: 'Can go from zero to reasonably dangerous at almost anything.',
      },
    ],
  },
};
