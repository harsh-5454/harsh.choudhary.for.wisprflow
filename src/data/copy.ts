/**
 * Approved Website Copy — Verbatim Source of Truth (`design.md`)
 * Do not rewrite, shorten, paraphrase, omit, or invent copy.
 */

export interface StrengthItem {
  id: 'extreme-ownership' | 'high-agency' | 'curiosity' | 'adaptability';
  title: string;
  description: string;
  accentVar: string;
  emoteCue: string;
  assetReactionId: string;
  loreAssetId: string;
}

export interface CareerEntryItem {
  name: string;
  detail?: string;
  fullText: string;
  logoSrc?: string;
  logoWebpSrc?: string;
}

export interface SkillItem {
  icon: string;
  title: string;
  subtitle?: string;
}

export interface WritingItem {
  title: string;
  subtitle: string;
  url?: string;
}

export interface CareerChapterCopy {
  id: 'grant-thornton' | 'ian' | 'kalaari' | 'independent-building';
  number: string;
  company: string;
  displayName: string;
  role: string;
  eyebrow: string;
  heading: string;
  sceneAssetId: string;
  accentColor: string;
  paragraphs: string[];
  milestone?: string;
  skillsHeading?: string;
  skills?: SkillItem[];
  investmentsHeading?: string;
  investments?: CareerEntryItem[];
  writingHeading?: string;
  writing?: string[];
  writingList?: WritingItem[];
  closing?: string;
}

export const SITE_COPY = {
  nav: {
    name: 'Harsh Choudhary',
    about: 'About',
  },

  home: {
    hero: {
      headlineLines: [
        'Investor by experience. Builder by inclination.',
        'Curious about most things.',
      ],
      headlineFull:
        'Investor by experience. Builder by inclination. Curious about most things.',
      subheadingLeft:
        'Most recently, I tried building something of my own. Built a thing, learnt a thing, wrapped it up.',
      subheadingRight: 'Before that, I was a VC at Kalaari Capital.',
      supporting: [
        'Most recently, I tried building something of my own. Built a thing, learnt a thing, wrapped it up.',
        'Before that, I was a VC at Kalaari Capital.',
      ],
    },

    wispr: {
      heading: 'Why Wispr Flow?',
      paragraphs: [
        "I first discovered Wispr Flow while covering AI at Kalaari and experimenting with new AI tools. I've followed the company ever since.",
        "I love the simplicity of the product, taking something as natural as voice and making it an intuitive interface for AI. I've also enjoyed following Tanay's thinking and the vision he's building towards.",
        "And Nimisha's journey, from cold-DMing Tanay to building and leading Wispr Flow India, is a great example of the kind of ownership and freedom to take initiative that I value in a team.",
        "As AI commoditises most functions, growth remains wonderfully human: part storytelling, part psychology, part creativity, part data. I'm excited by the prospect of doing this alongside a stellar growth team.",
      ],
      closingBold: "Which is why Wispr Flow is exactly the kind of place I want to go next.",
    },

    whyMe: {
      heading: 'What I bring to the table?',
      loreAffordance: 'Explore character lore',
      closingLine: "Don't just take my word for it. Explore the examples.",
      strengths: [
        {
          id: 'extreme-ownership',
          title: 'Extreme ownership',
          description:
            "If something needs doing, I'm usually happy to figure out how to get it done.",
          accentVar: 'var(--clay-green)',
          emoteCue: 'Focused nod · stepping forward to take charge',
          assetReactionId: 'A07',
          loreAssetId: 'A11a',
        },
        {
          id: 'high-agency',
          title: 'High agency',
          description:
            "I'm comfortable figuring things out, taking initiative and making progress without a playbook.",
          accentVar: 'var(--clay-blue)',
          emoteCue: 'Purposeful gesture · charting an unscripted path',
          assetReactionId: 'A08',
          loreAssetId: 'A11b',
        },
        {
          id: 'curiosity',
          title: 'Curiosity',
          description:
            'I enjoy understanding how things work and exploring ideas beyond my immediate areas of expertise.',
          accentVar: 'var(--clay-yellow)',
          emoteCue: 'Thoughtful lean-in · inspecting from a new angle',
          assetReactionId: 'A09',
          loreAssetId: 'A11c',
        },
        {
          id: 'adaptability',
          title: 'Adaptability',
          description:
            "My experience has taken me from finance and investing to research, product thinking and building with AI tools. I'm comfortable being a beginner when the situation calls for it.",
          accentVar: 'var(--clay-red)',
          emoteCue: 'Relaxed shrug & recalibration · switching tools cleanly',
          assetReactionId: 'A10',
          loreAssetId: 'A11d',
        },
      ] satisfies StrengthItem[],
    },

    whyHireMe: {
      heading: 'I can connect the dots between an idea and getting it done.',
      headingLines: [
        'I can connect the dots',
        'between an idea and getting it done.',
      ],
      paragraphs: [
        'Venture capital taught me to understand businesses, markets and what makes them tick. Working with founders gave me a closer look at the realities of building one.',
        "I've also been experimenting with product thinking and building with AI tools.",
        "I'm not an engineer or an expert in everything. But I can understand a problem, structure it, work across functions and take ownership of getting things done.",
      ],
      closingBold: 'I like being close to the action.',
    },

    beyond: {
      heading: 'A few things outside work.',
      readingLines: [
        'I like to read almost everything.',
        'Currently obsessed with the Dune Universe',
      ],
      building:
        'I enjoy building small projects, usually because something annoys me enough to try fixing it.',
      football:
        "I'm an avid FC Barcelona supporter and football fan. The less said about the emotional rollercoaster, the better.",
      trainingQuestion:
        'Also, does deadlifting 100 kg and running a sub-30-minute 5K get me any brownie points?',
    },

    aboutBridge: {
      heading: "There's a little more to the story.",
      body: "From consulting and early-stage investing to trying my hand at building something of my own. Here's a closer, more resume-esque look at my journey.",
      linkText: 'Explore my journey →',
    },
  },

  about: {
    intro: {
      heading:
        'A somewhat unconventional career path (at least as per my parents).',
      body: "Studied science in school, but chose finance over engineering in college. From there, I found my way through consulting, venture capital, and eventually independent building. I've always been drawn to things that interest me, challenge me, or take me somewhere unfamiliar. Here's a little of that journey and what I've done along the way.",
    },

    chapters: [
      {
        id: 'grant-thornton',
        number: '01 / 04',
        company: 'GRANT THORNTON',
        displayName: 'Grant Thornton',
        role: '',
        eyebrow: '01 / 04 · GRANT THORNTON',
        heading: 'Where I learnt the fundamentals.',
        sceneAssetId: 'A21',
        accentColor: 'var(--clay-green)',
        paragraphs: [
          'My first professional chapter. Built my foundation in finance, business analysis and structured problem-solving before moving into the startup ecosystem.',
        ],
        milestone:
          'A small milestone- started leading projects individually 6 months into the job.',
      },
      {
        id: 'ian',
        number: '02 / 04',
        company: 'INDIAN ANGEL NETWORK',
        displayName: 'Indian Angel Network',
        role: '',
        eyebrow: '02 / 04 · INDIAN ANGEL NETWORK',
        heading: 'My first step into venture capital.',
        sceneAssetId: 'A22',
        accentColor: 'var(--clay-blue)',
        paragraphs: [
          'Worked across multiple sectors and got my first exposure to early-stage investing. Learnt to evaluate businesses, understand founders and look at opportunities from an investor’s perspective.',
        ],
        investmentsHeading: 'Investments worked on:',
        investments: [
          {
            name: 'OnFinance',
            detail: 'AI agents for BFSI regulatory workflows.',
            fullText: 'OnFinance — AI agents for BFSI regulatory workflows.',
            logoSrc: '/assets/career/investments/logo_onfinance.png',
            logoWebpSrc: '/assets/career/investments/logo_onfinance.webp',
          },
          {
            name: 'Serigen',
            detail:
              'Life-sciences startup developing tissue-regeneration products.',
            fullText:
              'Serigen — Life-sciences startup developing tissue-regeneration products.',
            logoSrc: '/assets/career/investments/logo_serigen.png',
            logoWebpSrc: '/assets/career/investments/logo_serigen.webp',
          },
        ],
      },
      {
        id: 'kalaari',
        number: '03 / 04',
        company: 'KALAARI CAPITAL',
        displayName: 'Kalaari Capital',
        role: 'VC Fellow',
        eyebrow: '03 / 04 · KALAARI CAPITAL',
        heading: 'From understanding businesses to backing builders.',
        sceneAssetId: 'A23',
        accentColor: 'var(--clay-green)',
        paragraphs: [
          'Spent two years covering AI and gaming, sourcing and evaluating startups, executing investments and working closely with founders. From diligence to portfolio support, a closer look at what it takes to build a company.',
        ],
        investmentsHeading: 'Investments worked on:',
        investments: [
          {
            name: 'Pascal Labs',
            detail: 'AI knowledge worker for public equity investors.',
            fullText:
              'Pascal Labs — AI knowledge worker for public equity investors.',
            logoSrc: '/assets/career/investments/logo_pascal.png',
            logoWebpSrc: '/assets/career/investments/logo_pascal.webp',
          },
          {
            name: 'Superbryn',
            detail: 'Evaluation and observability for voice AI.',
            fullText:
              'Superbryn — Evaluation and observability for voice AI.',
            logoSrc: '/assets/career/investments/logo_superbryn.png',
            logoWebpSrc: '/assets/career/investments/logo_superbryn.webp',
          },
          {
            name: 'Triple Tap',
            detail: 'Hybrid-casual mobile games studio.',
            fullText: 'Triple Tap — Hybrid-casual mobile games studio.',
            logoSrc: '/assets/career/investments/logo_tripletap.png',
            logoWebpSrc: '/assets/career/investments/logo_tripletap.webp',
          },
        ],
        writingHeading: 'PUBLISHED WRITING',
        writingList: [
          {
            title: 'India Alpha: The Techade of Opportunity',
            subtitle: 'Venture capital thesis on Indian tech evolution',
            url: '#',
          },
          {
            title: 'The New Wave of AI Agents',
            subtitle: 'Analysis of autonomous software architectures',
            url: '#',
          },
        ],
        closing:
          "Early-stage investing meant doing a bit of everything. That's probably what I enjoyed most.",
      },
      {
        id: 'independent-building',
        number: '04 / 04',
        company: 'THE GARAGE',
        displayName: 'The Garage',
        role: 'Exploring · Experimenting · Building',
        eyebrow: '04 / 04 · THE GARAGE — INDEPENDENT',
        heading: 'Currently, making things.',
        sceneAssetId: 'A24',
        accentColor: 'var(--clay-red)',
        paragraphs: [
          'After years of evaluating businesses and working with founders, I explored the other side of the table: experimenting with product thinking, building with AI tools and learning by doing. Less investing in ideas, more trying to build them.',
        ],
        closing:
          "It didn't become a company, but it gave me something else: a much closer understanding of what it takes to go from identifying a problem to trying to build a solution.",
      },
    ] satisfies CareerChapterCopy[],

    resumeContact: {
      heading: "That's my story in a nutshell.",
      body: "These are just a few highlights; there's plenty more to the story, and even more I'd like to learn and build. If something resonates, let's talk.",
      linkText: 'Download resume →',
    },
  },

  footer: {
    heading: "Let's talk.",
    body: "If you think there's a fit at Wispr Flow, I'm super excited to join the team.",
    email: 'harshc.2802@gmail.com',
    linkedinDisplay: 'linkedin.com/in/harshchoudhary54/',
    linkedinUrl: 'https://www.linkedin.com/in/harshchoudhary54/',
    resumeLabel: 'Download PDF',
  },
} as const;

