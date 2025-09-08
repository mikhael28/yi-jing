export interface Trigram {
  number: number;
  names: string[];
  chinese_name: string;
  pinyin_name: string;
  character: string;
  attribute: string;
  images: string[];
  chinese_image: string;
  pinyin_image: string;
  family_relationship: string;
  binary: string;
  line_numbers: number[];
}

export const trigrams: Trigram[] = [
  {
    number: 1,
    names: ['Force', 'The Creative'],
    chinese_name: '乾',
    pinyin_name: 'qián',
    character: '☰',
    attribute: 'strong',
    images: ['heaven'],
    chinese_image: '天',
    pinyin_image: 'tiān',
    family_relationship: 'father',
    binary: '111',
    line_numbers: [1, 1, 1],
  },
  {
    number: 2,
    names: ['Field', 'The Receptive'],
    chinese_name: '坤',
    pinyin_name: 'kūn',
    character: '☷',
    attribute: 'devoted, yielding',
    images: ['earth'],
    chinese_image: '地',
    pinyin_image: 'dì',
    family_relationship: 'mother',
    binary: '000',
    line_numbers: [0, 0, 0],
  },
  {
    number: 3,
    names: ['Shake', 'The Arousing'],
    chinese_name: '震',
    pinyin_name: 'zhèn',
    character: '☳',
    attribute: 'inciting movement',
    images: ['thunder'],
    chinese_image: '雷',
    pinyin_image: 'léi',
    family_relationship: 'first son',
    binary: '001',
    line_numbers: [1, 0, 0],
  },
  {
    number: 4,
    names: ['Gorge', 'The Abysmal'],
    chinese_name: '坎',
    pinyin_name: 'kǎn',
    character: '☵',
    attribute: 'dangerous',
    images: ['water'],
    chinese_image: '水',
    pinyin_image: 'shuǐ',
    family_relationship: 'second son',
    binary: '010',
    line_numbers: [0, 1, 0],
  },
  {
    number: 5,
    names: ['Bound', 'Keeping Still'],
    chinese_name: '艮',
    pinyin_name: 'gèn',
    character: '☶',
    attribute: 'resting',
    images: ['mountain'],
    chinese_image: '山',
    pinyin_image: 'shān',
    family_relationship: 'third son',
    binary: '100',
    line_numbers: [0, 0, 1],
  },
  {
    number: 6,
    names: ['Ground', 'The Gentle'],
    chinese_name: '巽',
    pinyin_name: 'xùn',
    character: '☴',
    attribute: 'penetrating',
    images: ['wind', 'wood'],
    chinese_image: '風',
    pinyin_image: 'fēng',
    family_relationship: 'first daughter',
    binary: '110',
    line_numbers: [0, 1, 1],
  },
  {
    number: 7,
    names: ['Radiance', 'The Clinging'],
    chinese_name: '離',
    pinyin_name: 'lí',
    character: '☲',
    attribute: 'light-giving',
    images: ['fire'],
    chinese_image: '火',
    pinyin_image: 'huǒ',
    family_relationship: 'second daughter',
    binary: '101',
    line_numbers: [1, 0, 1],
  },
  {
    number: 8,
    names: ['Open', 'The Joyous'],
    chinese_name: '兌',
    pinyin_name: 'duì',
    character: '☱',
    attribute: 'joyful',
    images: ['swamp', 'lake'],
    chinese_image: '澤',
    pinyin_image: 'zé',
    family_relationship: 'third daughter',
    binary: '011',
    line_numbers: [1, 1, 0],
  },
];
