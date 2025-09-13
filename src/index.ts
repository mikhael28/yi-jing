/**
 * Yi Jing (I Ching) - The Oracle of Changes
 * A TypeScript library for working with the ancient Chinese divination system
 */

// Import data and types
import { trigrams, type Trigram } from './trigrams.js';
import { hexagrams, type Hexagram } from './hexagrams.js';
import { tao, type Tao } from './dao.js';
// import { LineCast } from './yarrow.js';

/**
 * A simple hello world function to demonstrate the yi-jing package
 * @returns A greeting message introducing the Yi Jing
 */
export function helloWorld(): string {
  return 'Hello from the Yi Jing! The Oracle of Changes welcomes you to explore the ancient wisdom of the I Ching.';
}

/**
 * Get information about the Yi Jing
 * @returns Basic information about the Yi Jing system
 */
export function getYiJingInfo(): {
  name: string;
  description: string;
  hexagrams: number;
} {
  return {
    name: 'Yi Jing (I Ching)',
    description:
      'The Book of Changes - an ancient Chinese divination text and philosophical system',
    hexagrams: 64,
  };
}

/**
 * Get a specific trigram by its number (1-8)
 * @param number The trigram number (1-8)
 * @returns The trigram data or undefined if not found
 */
export function getTrigram(number: number): Trigram | undefined {
  return trigrams.find(t => t.number === number);
}

/**
 * Get all trigrams
 * @returns Array of all 8 trigrams
 */
export function getAllTrigrams(): Trigram[] {
  return trigrams;
}

/**
 * Get a specific hexagram by its number (1-64)
 * @param number The hexagram number (1-64)
 * @returns The hexagram data or undefined if not found
 */
export function getHexagram(number: number): Hexagram | undefined {
  return hexagrams.find(h => h.number === number);
}

/**
 * Get all hexagrams
 * @returns Array of all 64 hexagrams
 */
export function getAllHexagrams(): Hexagram[] {
  return hexagrams;
}

/**
 * Get a specific Tao chapter by its number (as string)
 * @param chapterNumber The chapter number as a string
 * @returns The Tao chapter data or undefined if not found
 */
export function getTaoChapter(chapterNumber: string): Tao | undefined {
  return tao.find(t => t.chapter_number === chapterNumber);
}

/**
 * Get all Tao chapters
 * @returns Array of all Tao chapters
 */
export function getAllTaoChapters(): Tao[] {
  return tao;
}

/**
 * Cast a single line using the traditional yarrow stick method
 * @returns A string representing the line ('0' for broken, '1' for solid, 'o' for changing broken, 'x' for changing solid)
 */
// export function castLine(): string {
//   return LineCast();
// }

/**
 * Cast a complete hexagram (6 lines) using the yarrow stick method
 * @returns An object containing the lines array and binary representation
 */
// export function castHexagram(): { lines: string[]; binary: string } {
//   const lines: string[] = [];
//   for (let i = 0; i < 6; i++) {
//     lines.push(LineCast());
//   }
//   // Convert to binary (1 for solid/changing solid, 0 for broken/changing broken)
//   const binary = lines
//     .map(line => (line === '1' || line === 'x' ? '1' : '0'))
//     .join('');
//   return { lines, binary };
// }

/**
 * Find hexagram by its binary representation
 * @param binary 6-character binary string (e.g., "111111")
 * @returns The matching hexagram or undefined if not found
 */
export function findHexagramByBinary(binary: string): Hexagram | undefined {
  return hexagrams.find(h => h.binary === binary);
}

// Re-export types for external use
export type { Trigram, Hexagram, Tao };

// Default export
export default {
  helloWorld,
  getYiJingInfo,
  getTrigram,
  getAllTrigrams,
  getHexagram,
  getAllHexagrams,
  getTaoChapter,
  getAllTaoChapters,
  // castLine,
  // castHexagram,
  findHexagramByBinary,
};
