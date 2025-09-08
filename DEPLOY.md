# Deployment Guide for Yi Jing NPM Package

This document provides step-by-step instructions for deploying the Yi Jing package to npm.

## Prerequisites

Before deploying, ensure you have:

1. **npm account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **npm CLI**: Installed and logged in to your npm account
3. **Git repository**: Code is committed and pushed to your repository
4. **Version control**: All changes are committed

## Pre-Deployment Checklist

### 1. Verify Package Configuration

Ensure your `package.json` has the correct configuration:

```json
{
  "name": "yi-jing",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "type": "module",
  "files": ["dist/**/*"]
}
```

### 2. Update Package Information

Before publishing, update these fields in `package.json`:

- **`repository.url`**: Update from `https://github.com/yourusername/yi-jing.git` to your actual repository URL
- **`author`**: Add your name and email
- **`homepage`**: Update to your actual homepage URL
- **`bugs.url`**: Update to your actual issues URL

### 3. Code Quality Checks

Run the following commands to ensure code quality:

```bash
# Lint the code
npm run lint

# Format the code
npm run format

# Build the project
npm run build
```

### 4. Test the Build

Verify that the build generates all necessary files:

```bash
# Clean and rebuild
npm run clean
npm run build

# Check that dist/ contains all expected files
ls -la dist/
```

Expected files in `dist/`:

- `index.js` and `index.d.ts`
- `trigrams.js` and `trigrams.d.ts`
- `hexagrams.js` and `hexagrams.d.ts`
- `dao.js` and `dao.d.ts`
- `about.js` and `about.d.ts`

## Deployment Steps

### Step 1: Login to npm

```bash
npm login
```

Enter your npm username, password, and email when prompted.

### Step 2: Verify Login

```bash
npm whoami
```

This should display your npm username.

### Step 3: Update Version (if needed)

If this is not your first release, update the version:

```bash
# For patch releases (bug fixes)
npm version patch

# For minor releases (new features)
npm version minor

# For major releases (breaking changes)
npm version major
```

### Step 4: Test the Package

Before publishing, test what will be included:

```bash
npm pack --dry-run
```

This shows you exactly what files will be included in the package.

### Step 5: Publish to npm

For first-time publication:

```bash
npm publish
```

For subsequent releases:

```bash
npm publish
```

### Step 6: Verify Publication

1. Check your package on npm: `https://www.npmjs.com/package/yi-jing`
2. Test installation in a separate project:

```bash
mkdir test-yi-jing
cd test-yi-jing
npm init -y
npm install yi-jing
```

3. Test TypeScript types:

```typescript
// test.ts
import { getTrigram, type Trigram } from 'yi-jing';

const trigram: Trigram | undefined = getTrigram(1);
console.log(trigram);
```

## Post-Deployment

### Create Git Tag

After successful publication, tag the release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Update Documentation

1. Update README.md with installation instructions
2. Create release notes on GitHub
3. Update any documentation sites

## Package Scripts Reference

Your package includes these helpful scripts:

```bash
# Development
npm run dev          # Watch mode for development
npm run build        # Build for production
npm run clean        # Clean build directory

# Quality Assurance
npm run lint         # Check code style
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Publishing
npm run prepublishOnly # Automatically runs before publish
```

## Version Management

Follow semantic versioning (semver):

- **Patch** (1.0.1): Bug fixes, no breaking changes
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes

## Troubleshooting

### Common Issues

1. **"Package name already exists"**
   - Choose a different package name in `package.json`
   - Add a scope: `@yourusername/yi-jing`

2. **"You do not have permission to publish"**
   - Ensure you're logged in: `npm whoami`
   - Check if package name is available: `npm info yi-jing`

3. **"Files not included in package"**
   - Check `files` array in `package.json`
   - Ensure files exist in `dist/` directory
   - Run `npm pack --dry-run` to see what's included

4. **"Types not working after installation"**
   - Verify `types` field points to `dist/index.d.ts`
   - Ensure TypeScript declaration files are generated
   - Check that `.d.ts` files are included in the `files` array

### Build Issues

If the build fails:

```bash
# Clean everything and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Security Considerations

1. **Never commit sensitive data** to your repository
2. **Review your package contents** with `npm pack --dry-run`
3. **Use `.npmignore`** if you need to exclude files beyond what's in `files`
4. **Enable 2FA** on your npm account for security

## Continuous Integration

Consider setting up GitHub Actions for automated publishing:

```yaml
# .github/workflows/publish.yml
name: Publish to npm
on:
  release:
    types: [created]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm install
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Support

For issues with:

- **npm publishing**: [npm support](https://www.npmjs.com/support)
- **Package issues**: Create an issue in your GitHub repository
- **TypeScript types**: Check [TypeScript documentation](https://www.typescriptlang.org/docs/)

---

**Ready to deploy?** Follow the checklist above and you'll have your Yi Jing package live on npm! 🚀
