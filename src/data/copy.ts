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
}

export interface CareerChapterCopy {
  id: 'grant-thornton' | 'ian' | 'kalaari' | 'independent-building';
  number: string;
  company: string;
  eyebrow: string;
  heading: string;
  sceneAssetId: string;
  accentColor: string;
  paragraphs: string[];
  milestone?: string;
  investmentsHeading?: string;
  investments?: CareerEntryItem[];
  writingHeading?: string;
  writing?: string[];
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
      ],
      closingBold: "It's the kind of place I'd be excited to build in.",
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
        'Also, Does deadlifting 100 kg and running a sub-30-minute 5K get me any brownie points?',
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
      body: "Studied Science in School then decided to study finance in college, then consulting to venture capital and independent building. I like doing things that interest and challenge me. Here's where I've been and a little of what I've done along the way.",
    },

    chapters: [
      {
        id: 'grant-thornton',
        number: '01 / 04',
        company: 'GRANT THORNTON',
        eyebrow: '01 / 04 · GRANT THORNTON',
        heading: 'Where it started.',
        sceneAssetId: 'A21',
        accentColor: 'var(--clay-green)',
        paragraphs: [
          'My first professional stint, working across consulting assignments for clients across diverse industries. It gave me a foundation in understanding businesses and approaching problems analytically.',
        ],
        milestone:
          'A little milestone: Started leading projects within my first six months.',
      },
      {
        id: 'ian',
        number: '02 / 04',
        company: 'INDIAN ANGEL NETWORK',
        eyebrow: '02 / 04 · INDIAN ANGEL NETWORK',
        heading: 'A first look at startups / VC.',
        sceneAssetId: 'A22',
        accentColor: 'var(--clay-blue)',
        paragraphs: [
          'I moved closer to the startup ecosystem, evaluating early-stage companies across sectors and getting a first-hand look at what it takes to build a business.',
        ],
        investmentsHeading: 'Selected investments:',
        investments: [
          {
            name: 'OnFinance',
            detail: 'AI agents for BFSI regulatory workflows.',
            fullText: 'OnFinance — AI agents for BFSI regulatory workflows.',
          },
          {
            name: 'Serigen',
            detail:
              'A life-sciences company developing tissue-regeneration products.',
            fullText:
              'Serigen — A life-sciences company developing tissue-regeneration products.',
          },
        ],
      },
      {
        id: 'kalaari',
        number: '03 / 04',
        company: 'KALAARI CAPITAL',
        eyebrow: '03 / 04 · KALAARI CAPITAL',
        heading: 'Two years in venture capital.',
        sceneAssetId: 'A23',
        accentColor: 'var(--clay-green)',
        paragraphs: [
          'I covered AI and gaming, working across sourcing, due diligence, executing investments, and portfolio support.',
          'I assessed hundreds of opportunities and executed 3 investments',
          'Beyond investing, I worked on partnerships, portfolio initiatives, publishing thought leadership, and organizing amazing events.',
        ],
        investmentsHeading: 'Selected investments:',
        investments: [
          {
            name: 'Pascal Labs',
            detail: 'AI knowledge worker for public equity investors.',
            fullText:
              'Pascal Labs — AI knowledge worker for public equity investors.',
          },
          {
            name: 'Superbryn',
            detail: 'Evaluation and observability for voice AI.',
            fullText:
              'Superbryn — Evaluation and observability for voice AI.',
          },
          {
            name: 'Triple Tap',
            detail: 'Hybrid-casual mobile games studio.',
            fullText: 'Triple Tap — Hybrid-casual mobile games studio.',
          },
        ],
        writingHeading: 'Selected writing:',
        writing: [
          'India Alpha: The Techade of Opportunity.',
          'The New Wave of AI Agents.',
        ],
        closing:
          "Early-stage investing meant doing a bit of everything. That's probably what I enjoyed most.",
      },
      {
        id: 'independent-building',
        number: '04 / 04',
        company: 'INDEPENDENT BUILDING',
        eyebrow: '04 / 04 · INDEPENDENT BUILDING',
        heading: 'From evaluating ideas to trying to build one.',
        sceneAssetId: 'A24',
        accentColor: 'var(--clay-red)',
        paragraphs: [
          'After Kalaari, I decided to take a shot at the founder journey.',
          'I set out to build an AI-native workspace for VCs. I spoke to users, explored their workflows and built prototypes to bring the idea to life.',
          'Along the way, I wore just about every hat – founder, product manager, designer, coder, and everything in between.',
          'Eventually, I decided to sunset the project for a few different reasons.',
        ],
        closing:
          "It didn't become a company, but it gave me something else: a much closer understanding of what it takes to go from identifying a problem to trying to build a solution.",
      },
    ] satisfies CareerChapterCopy[],

    resumeContact: {
      heading: "That's my story in a nutshell / gist.",
      body: "There's plenty more I'd like to learn and build. If something here resonates, let's talk.",
      linkText: 'Download resume →',
    },
  },

  footer: {
    heading: "Let's talk.",
    body: "If you think there's a fit at Wispr Flow or just want to talk about AI, products, investing or football I'd love to hear from you.",
    email: 'harshc.2802@gmail.com',
    linkedinDisplay: 'linkedin.com/in/harshchoudhary54/',
    linkedinUrl: 'https://www.linkedin.com/in/harshchoudhary54/',
    resumeLabel: 'Download PDF',
  },
} as const;

