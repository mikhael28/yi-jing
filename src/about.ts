export const about: YijingInfo = {
  title: 'Yi Jing (I Ching, Book of Changes)',
  overview:
    'The Yi Jing is a classic Chinese divinatory text consisting of 64 hexagrams, each made of six yin (broken) or yang (solid) lines. The text has been used for millennia as a guide for divination, philosophy, governance, and personal growth.',
  history: [
    {
      period: 'Pre‑Zhou / Shang (c. 1200–1045 BCE)',
      events: 'Earliest yarrow‑stalk divination; shamanic ritual background.',
      sources: 'Oracle bone inscriptions, bronze inscriptions',
    },
    {
      period: 'Zhou (c. 1045–256 BCE)',
      events: 'Compilation of the core divinatory manual.',
      sources: 'Zhou Jing (surviving version)',
    },
    {
      period: 'Warring States (c. 475–221 BCE)',
      events:
        'Confucian commentaries added; the text becomes one of the Five Classics.',
      sources: 'Early commentaries (Ten Wings)',
    },
    {
      period: 'Han (206 BCE–220 CE)',
      events: 'Canonical status; first printed editions.',
      sources: 'Wang Xi edition (3rd century CE)',
    },
    {
      period: 'Early Medieval (5th–10th CE)',
      events: 'Daoist, Buddhist, and Confucian philosophical interpretations.',
      sources: 'Kang commentary (10th century)',
    },
    {
      period: 'Modern (19th–20th century)',
      events: 'Western translations; psychological and literary uses.',
      sources: 'Legge, Wilhelm, Mitchell, etc.',
    },
  ],
  structure: {
    core: {
      hexagrams: 64,
      lines_per_hexagram: 6,
    },
    ten_wings: ['Commentary', 'Rationale', 'Principles'],
    later_commentaries: [
      'Kang Yi (10th century)',
      'Huainanzi',
      'Zhuangzi',
      'Confucius (as cited)',
    ],
  },
  core_concepts: [
    {
      concept: 'Yin & Yang',
      description:
        'Complementary, dynamic principles: Yin (passive, dark, receptive); Yang (active, bright, assertive).',
    },
    {
      concept: 'Hexagrams as States',
      description:
        'Each hexagram symbolises a particular phase of change; there are 64 possible states.',
    },
    {
      concept: 'Changing Lines',
      description:
        'Lines in motion that indicate an impending shift, leading to a new hexagram.',
    },
    {
      concept: 'Dao (Way)',
      description:
        'The natural flow of the cosmos; aligning with the Dao yields harmony.',
    },
    {
      concept: 'Qi (Vital Energy)',
      description: 'Dynamic force that flows through the lines.',
    },
    {
      concept: 'Cosmology',
      description: 'Universe as a living, changing organism.',
    },
  ],
  functions: [
    {
      purpose: 'Divination',
      howUsed: 'Yarrow stalks to produce a hexagram and its changing lines.',
    },
    {
      purpose: 'Philosophy & Ethics',
      howUsed: 'Study hexagrams as models of human behavior.',
    },
    {
      purpose: 'Governance',
      howUsed: 'Rulers use it to align policy with natural order.',
    },
    {
      purpose: 'Education',
      howUsed: 'Classic in Chinese schools; cultivates moral judgment.',
    },
    {
      purpose: 'Art & Literature',
      howUsed: 'Influences poetry, painting, and opera.',
    },
  ],
  philosophical_schools: [
    {
      name: 'Daoism',
      focus: 'Cosmological harmony, the Dao, and the role of Qi.',
    },
    {
      name: 'Confucianism',
      focus:
        'Moral cultivation, governance, and ethical interpretation of hexagrams.',
    },
    {
      name: 'Buddhism',
      focus: 'Impermanence, suffering, and the cyclical nature of change.',
    },
  ],
  translations: [
    {
      translator: 'Thomas R. Legge',
      year: 1959,
      features: 'Comprehensive academic translation; explanatory notes.',
    },
    {
      translator: 'John A. DeFremery',
      year: 1976,
      features: 'Clear language, cross‑referenced hexagram index.',
    },
    {
      translator: 'Richard Wilhelm',
      year: 1939,
      features: 'Philosophical commentary; influenced Jung.',
    },
    {
      translator: 'Charles F. H. T. C. & R. L. Chittick',
      year: 2008,
      features: 'Modern commentary and updated terminology.',
    },
  ],
  modern_thought: [
    {
      area: 'Jungian Archetypes',
      description:
        'Hexagrams mapped to universal patterns such as ‘The Fool’ and ‘The Warrior.’',
    },
    {
      area: 'Chaos Theory',
      description:
        'Dynamic changing lines resemble attractor networks and chaos maps.',
    },
    {
      area: 'Literature',
      description:
        'Influences works from Toni Morrison to William S. Burroughs.',
    },
    {
      area: 'Gaming',
      description:
        'Used in tabletop RPGs for random encounters and plot twists.',
    },
    {
      area: 'Mindfulness',
      description:
        'Meditation practices use hexagrams to focus on impermanence.',
    },
  ],
  glossary: [
    { term: 'Yin', meaning: 'Passive, dark, receptive.' },
    { term: 'Yang', meaning: 'Active, bright, assertive.' },
    { term: 'Hexagram', meaning: 'Six‑line diagram of yin/yang.' },
    {
      term: 'Changing Line',
      meaning: 'Line that transforms to produce a new hexagram.',
    },
    {
      term: 'Ten Wings',
      meaning: 'Ten short commentaries added to the core text.',
    },
    { term: 'Dao', meaning: 'The natural order or Way.' },
    { term: 'Qi', meaning: 'Vital life energy.' },
    { term: 'Heaven', meaning: 'Divine cosmic principle.' },
    { term: 'Earth', meaning: 'Material world.' },
  ],
};

// ──────────────────────────────────────────────────────────────────────
//  TypeScript interface that reflects the structure of the JSON above
// ──────────────────────────────────────────────────────────────────────

export interface HistoryEvent {
  period: string;
  events: string;
  sources: string;
}

export interface CommentStructure {
  core: {
    hexagrams: number;
    lines_per_hexagram: number;
  };
  ten_wings: string[];
  later_commentaries: string[];
}

export interface Concept {
  concept: string;
  description: string;
}

export interface FunctionUse {
  purpose: string;
  howUsed: string;
}

export interface HexagramLine {
  position: number;
  yinYang: 'Yin' | 'Yang';
  description: string;
}

export interface SampleHexagram {
  number: number;
  name: string;
  lines: HexagramLine[];
}

export interface School {
  name: string;
  focus: string;
}

export interface TranslationEdition {
  translator: string;
  year: number;
  features: string;
}

export interface YijingInfo {
  title: string;
  overview: string;
  history: HistoryEvent[];
  structure: CommentStructure;
  core_concepts: Concept[];
  functions: FunctionUse[];
  philosophical_schools: School[];
  translations: TranslationEdition[];
  modern_thought: { area: string; description: string }[];
  glossary: { term: string; meaning: string }[];
}
