# Yi Jing (I Ching) - The Oracle of Changes

_"The only constant in life is change"_ - Heraclitus

## The Ancient Oracle Awakens in Digital Form

For over three millennia, seekers have turned to the Yi Jing—the Book of Changes—to divine the hidden currents of existence. This sacred text reveals the eternal dance between yin and yang, mapping the 64 archetypal patterns that govern all transformation in the universe. Now, through the precision of modern algorithms, we can consult this ancient oracle with the same reverence and insight that once guided emperors and sages.

### The Mystical Foundation

The Yi Jing operates on a profound understanding: that all of existence flows according to cosmic principles that can be perceived through symbolic patterns. Each of the 64 hexagrams represents a unique configuration of universal forces—six lines that capture a moment in the eternal cycle of change. When we consult the oracle, we are not merely generating random symbols; we are tapping into the synchronistic fabric of reality itself.

The 64 hexagrams represent every possible combination of the fundamental forces of creation. From **Qián** (☰ The Creative) to **Wèi Jì** (䷿ Before Completion), each pattern holds keys to understanding the cosmic rhythms that influence our lives.

### The Sacred Architecture

Our digital oracle preserves the essential components of traditional Yi Jing consultation:

**The Hexagram Structure:**

- **Upper Trigram (Heaven)**: Represents the cosmic forces, the greater context
- **Lower Trigram (Earth)**: Represents earthly matters, immediate concerns
- **Six Lines**: Each carrying yin (⚋) or yang (⚊) energy, building from earth to heaven
- **Changing Lines**: Dynamic points of transformation that reveal the flow of change

**The Oracle's Voice:**

- **The Judgment**: The oracle's primary message about the overall situation
- **The Image**: A poetic reflection on the hexagram's deeper meaning
- **Line Interpretations**: Specific guidance for each position and its changing nature
- **Future Hexagram**: When lines change, revealing the situation's evolution

**The Consultation Process:**

1. **Approach with Sincerity**: The oracle responds to genuine inquiry
2. **Formulate Your Question**: Be specific about what guidance you seek
3. **Generate the Hexagram**: Let the Oracle channel the moment's energy
4. **Contemplate the Symbols**: Read not just with mind, but with intuition
5. **Integrate the Wisdom**: Apply the guidance to your life's circumstances

This digital manifestation honors the Yi Jing's core principle: that wisdom emerges from the intersection of cosmic pattern, personal consciousness, and the precise moment of inquiry.

## Technical Implementation

Ready to integrate the ancient oracle into your modern application? Here's how to get started:

## Installation

```bash
npm install yi-jing
```

## Visual Presentation & Preview if Cloned/Forked

```bash
npm start
```

## Quick Start: Consulting the Oracle

```typescript
import { helloWorld, getYiJingInfo, hexagrams } from 'yi-jing';

// Begin your journey with the oracle
console.log(helloWorld());
// "Hello from the Yi Jing! The Oracle of Changes welcomes you to explore the ancient wisdom of the I Ching."

// Access the complete repository of hexagrams
console.log(`The oracle contains ${hexagrams.length} hexagrams`);

// Example: Explore a specific hexagram
const qian = hexagrams[0]; // The Creative (Hexagram 1)
console.log(`${qian.title}: ${qian.description}`);

// Access the judgment and image for divination
console.log('The Judgment:', qian.judgement[0]);
console.log('The Image:', qian.image[0]);

// Examine the structure of cosmic forces
console.log(`Chinese Character: ${qian.character}`);
console.log(`Binary Pattern: ${qian.binary}`);
console.log(`Lines (from bottom to top): ${qian.line_numbers.join('')}`);
```

## API Reference

### Core Oracle Functions

### `helloWorld(): string`

Invokes the oracle's greeting, establishing the sacred connection between user and ancient wisdom.

**Returns:** A welcome message from the Oracle of Changes.

### `getYiJingInfo(): object`

Retrieves fundamental information about the divinatory system.

**Returns:** An object containing the oracle's basic parameters:

- `name`: The formal name of the oracle system
- `description`: Overview of the Book of Changes as both divination tool and philosophical system
- `hexagrams`: The complete count of possible hexagram states (64)

### `hexagrams: Hexagram[]`

The complete repository of all 64 hexagrams, each containing the full depth of ancient wisdom.

**Hexagram Structure:**

```typescript
interface Hexagram {
  number: number; // Position in the traditional sequence (1-64)
  names: string[]; // Multiple names/translations
  chinese_name: string; // Original Chinese name
  pinyin: string; // Romanized pronunciation
  character: string; // Unicode hexagram symbol (䷀ - ䷿)
  top_trigram: number; // Upper trigram (cosmic realm)
  bottom_trigram: number; // Lower trigram (earthly realm)
  binary: string; // Six-bit binary representation
  lines_string: string; // Visual line pattern
  line_numbers: number[]; // Array of line values [1,1,1,1,1,1]
  description: string; // Overview of the hexagram's meaning
  title: string; // Formal title
  heaven: string; // Relationship between trigrams
  summary: string; // Extended philosophical context
  judgement: string[]; // The oracle's primary pronouncement
  image: string[]; // Poetic reflection on the hexagram
  lines: string[]; // Individual line interpretations
}
```

## Development

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/yi-jing.git
cd yi-jing
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm run clean` - Remove build artifacts
- `npm run prepublishOnly` - Prepare package for publishing

## Publishing to NPM

### Prerequisites for Publishing

1. **Create an NPM account**: Sign up at [npmjs.com](https://www.npmjs.com)
2. **Login via CLI**: Run `npm login` and enter your credentials
3. **Verify your email**: NPM requires email verification for publishing

### Publishing Steps

1. **Update package version**:

   ```bash
   npm version patch  # or minor/major
   ```

2. **Build the package**:

   ```bash
   npm run build
   ```

3. **Test the package locally** (optional):

   ```bash
   npm pack
   # This creates a .tgz file you can test with: npm install ./yi-jing-1.0.0.tgz
   ```

4. **Publish to NPM**:
   ```bash
   npm publish
   ```

### Publishing Best Practices

- **Semantic Versioning**: Use semantic versioning (MAJOR.MINOR.PATCH)
  - PATCH: Bug fixes
  - MINOR: New features (backward compatible)
  - MAJOR: Breaking changes
- **Test before publishing**: Always run tests and build before publishing
- **Use `.npmignore`**: Exclude unnecessary files from the published package
- **Update documentation**: Keep README and changelog up to date
- **Consider scoped packages**: For organization packages, use `@yourorg/package-name`

### NPM Registry Configuration

If you need to publish to a different registry:

```bash
npm config set registry https://registry.npmjs.org/
# Or for scoped packages:
npm config set @yourscope:registry https://your-private-registry.com/
```

## Integration with Modern Practice

### Bridging Ancient and Digital

This library represents more than a simple data repository—it's a bridge between ancient wisdom and contemporary consciousness. Whether you're building:

**Divination Applications:**

- Personal oracle apps for daily guidance
- Decision-making tools for business or life choices
- Meditation and mindfulness applications
- Synchronicity trackers and pattern recognition tools

**Educational Platforms:**

- Interactive learning systems for Eastern philosophy
- Cultural heritage preservation projects
- Comparative religion and philosophy studies
- Symbol and archetype exploration tools

**Creative Projects:**

- Generative art based on hexagram patterns
- Music composition using I Ching structures
- Literary works incorporating oracle wisdom
- Game mechanics based on change dynamics

The API provides not just data access but maintains the sacred context that makes the Yi Jing a living oracle rather than a static reference.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### [1.0.0] - 2024-01-01

- Initial release
- Basic hello world functionality
- TypeScript support
- NPM package structure
