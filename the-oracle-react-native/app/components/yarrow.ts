/**
 * Yarrow Stalk algorithm for divining the Yi Jing (I Ching), the Oracle of Changes
 * This implements the traditional three-round yarrow stalk casting method
 * to generate a single line (yao) with its changing properties.
 */

/**
 * Divides stalks into two piles and removes one from the west pile
 * @param {number} yarrowStalks - Number of stalks to divide
 * @returns {object} - Object containing the divided piles and hand pile
 */
const divideStalks = (yarrowStalks: number) => {
  const westPile = Math.floor(Math.random() * yarrowStalks) + 1;
  const eastPile = yarrowStalks - westPile;
  
  return {
    eastPile,
    westPile: westPile - 1,
    handPile: 1
  };
};

/**
 * Divides east and west piles by 4 and calculates remainders
 * @param {number} eastPile - Number of stalks in east pile
 * @param {number} westPile - Number of stalks in west pile
 * @param {number} handPile - Current number of stalks in hand
 * @returns {object} - Updated piles with remainders added to hand
 */
const divideEastAndWest = (eastPile: number, westPile: number, handPile: number) => {
  let eastRemainder = eastPile % 4;
  let westRemainder = westPile % 4;
  
  // If remainder is 0, treat as 4 (traditional yarrow stalk method)
  if (eastRemainder === 0) eastRemainder = 4;
  if (westRemainder === 0) westRemainder = 4;
  
  return {
    eastRemainder,
    westRemainder,
    handPile: handPile + eastRemainder + westRemainder
  };
};

/**
 * Draws the visual representation of a line
 * @param {string} lineType - 'strong' or 'weak'
 * @param {boolean} changing - Whether the line is changing
 * @returns {object} - Contains both the symbol and ASCII art representation
 */
const drawLine = (lineType: string, changing: any) => {
  const lineMap = {
    'weak-changing': { symbol: 'o', ascii: '====&nbsp;o&nbsp;===' },
    'strong-changing': { symbol: 'x', ascii: '====x====' },
    'strong-unchanging': { symbol: '1', ascii: '=========' },
    'weak-unchanging': { symbol: '0', ascii: '===&nbsp;&nbsp;&nbsp;===' }
  };
  
  const key = `${lineType}-${changing ? 'changing' : 'unchanging'}`;
//   @ts-ignore
  return lineMap[key];
};

/**
 * Performs the complete Yarrow Stalk divination for a single line
 * @returns {object} - Contains the line symbol, ASCII representation, and numerical value
 */
export const castYarrowLine = () => {
  try {
    let stalks = 49; // Traditional number: 50 minus 1 set aside
    const countValues = [];
    
    // Perform three rounds of stalk division
    for (let round = 0; round < 3; round++) {
      // Divide stalks into east and west piles
      const { eastPile, westPile, handPile } = divideStalks(stalks);
      
      // Calculate remainders when dividing by 4
      const { eastRemainder, westRemainder, handPile: finalHandPile } = 
        divideEastAndWest(eastPile, westPile, handPile);
      
      // Total stalks in hand will be 5 or 9 in first round, 4 or 8 in subsequent rounds
      const totalInHand = eastRemainder + westRemainder + 1;
      
      // Assign counting values based on traditional method
      if (round === 0) {
        countValues.push(totalInHand === 9 ? 2 : 3);
      } else {
        countValues.push(totalInHand === 8 ? 2 : 3);
      }
      
      // Remove stalks from hand and continue with remaining stalks
      stalks -= finalHandPile;
    }
    
    // Calculate final line value (sum of three count values)
    const lineValue = countValues.reduce((sum, value) => sum + value, 0);
    
    // Determine line type based on traditional interpretation
    const lineTypes = {
      6: { type: 'weak', changing: true },    // Old Yin (yielding but changing)
      7: { type: 'strong', changing: false }, // Young Yang (strong)
      8: { type: 'weak', changing: false },   // Young Yin (yielding)
      9: { type: 'strong', changing: true }   // Old Yang (strong but changing)
    };
    // @ts-ignore
    const { type, changing } = lineTypes[lineValue];
    const lineResult = drawLine(type, changing);
    
    return {
      symbol: lineResult.symbol,
      ascii: lineResult.ascii,
      value: lineValue,
      type,
      changing,
      countValues
    };
    
  } catch (error) {
    console.error('Error in yarrow stalk casting:', error);
    throw new Error('Failed to cast yarrow line');
  }
};

/**
 * Casts a complete hexagram (6 lines) using the yarrow stalk method
 * @returns {object} - Complete hexagram with all six lines
 */
export const castYarrowHexagram = () => {
  const lines = [];
  
  // Cast six lines (traditional hexagram structure, bottom to top)
  for (let i = 0; i < 6; i++) {
    lines.push(castYarrowLine());
  }
  
  return {
    lines,
    symbols: lines.map(line => line.symbol).join(''),
    hasChangingLines: lines.some(line => line.changing),
    changingLines: lines
      .map((line, index) => line.changing ? index + 1 : null)
      .filter(index => index !== null)
  };
};

// Legacy export for backward compatibility
export const LineCast = castYarrowLine;