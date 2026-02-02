# Oracular Chatbot - Divine Oracle App

A mystical mobile application featuring an interactive Oracle inspired by the Oracle of Delphi, complete with divine visualizations, I Ching divination, and sacred flame animations.

2.2.26 Release Note - Building local iOS & Android not officially supported, this web-only build is available as a refrence for how to implement the `yi-jing-oracle` npm package & was originally put together for a hackathon.

## Features

- **Divine Oracle Interface**: Pulsating torch with audio-visualizer effects during AI responses
- **Pull-down Drawer**: Swipe down or tap the orb icon to access:
  - Yi Jing tab
  - Dao tab
  - Journal tab
  - Divine tab with interactive I Ching line generation
- **Secret Settings**: Triple-tap top-left corner to access:
  - Style settings with dark/light mode toggle
  - History tab
  - Alternate Prometheus flame animation
- **Cross-platform**: Runs on iOS, Android, and web

## Installation & Setup

### Prerequisites

- Node.js (v18 or later)
- Bun package manager
- Expo CLI: `npm install -g @expo/cli`
- For mobile testing: Expo Go app on your device

### Quick Start

1. **Clone and install dependencies:**

   ```bash
   git clone <your-repo-url>
   cd oracular-chatbot
   bun install
   ```

2. **Start the development server:**
   ```bash
   bun start
   # or
   npx expo start
   ```

## Platform-Specific Installation

### 📱 iOS Installation

#### Option 1: Using Expo Go (Recommended for Development)

1. **Install Expo Go** from the App Store on your iPhone/iPad
2. **Start the development server:**
   ```bash
   bun start
   ```
3. **Connect your device:**
   - Ensure your phone and computer are on the same WiFi network
   - Open Expo Go app
   - Scan the QR code displayed in your terminal/browser
   - The app will load automatically

#### Option 2: iOS Simulator (macOS only)

1. **Install Xcode** from the Mac App Store
2. **Open iOS Simulator:**
   ```bash
   bun start
   # Press 'i' to open iOS simulator
   ```

### 🤖 Android Installation

#### Option 1: Using Expo Go (Recommended for Development)

1. **Install Expo Go** from Google Play Store on your Android device
2. **Start the development server:**
   ```bash
   bun start
   ```
3. **Connect your device:**
   - Ensure your phone and computer are on the same WiFi network
   - Open Expo Go app
   - Scan the QR code displayed in your terminal/browser
   - The app will load automatically

#### Option 2: Android Emulator

1. **Install Android Studio** and set up an Android Virtual Device (AVD)
2. **Start your emulator**
3. **Run the app:**
   ```bash
   bun start
   # Press 'a' to open Android emulator
   ```

### 🌐 Web Installation

#### Local Development

1. **Start the development server:**
   ```bash
   bun start
   ```
2. **Open in browser:**
   - Press 'w' in the terminal, or
   - Navigate to `http://localhost:8081` in your web browser

#### Production Web Deployment

1. **Build for web:**
   ```bash
   npx expo export -p web
   ```
2. **Deploy the `dist` folder** to your preferred hosting service:
   - Vercel: `vercel dist`
   - Netlify: Drag and drop the `dist` folder
   - GitHub Pages: Push the `dist` contents to your gh-pages branch

## Troubleshooting

### Common Issues

**QR Code not working:**

- Ensure both devices are on the same WiFi network
- Try using the tunnel connection: `bun start --tunnel`

**Metro bundler issues:**

```bash
# Clear cache and restart
npx expo start --clear
```

**iOS Simulator not opening:**

- Make sure Xcode is installed and updated
- Try: `sudo xcode-select --install`

**Android emulator issues:**

- Ensure Android Studio is properly configured
- Check that your AVD has sufficient storage and RAM

### Performance Tips

- **For best performance on older devices:** Use the alternate Prometheus flame animation (lighter on resources)
- **Web performance:** The app is optimized for React Native Web compatibility
- **Memory usage:** The divine animations are optimized but may use more resources during active visualization

## Development Commands

```bash
# Start development server
bun start

# Start with cache cleared
bun start --clear

# Start with tunnel (for network issues)
bun start --tunnel

# Type checking
bun run type-check

# Linting
bun run lint
```

## App Structure

```
app/
├── _layout.tsx          # Root layout with theme provider
├── index.tsx            # Main Oracle interface
└── contexts/
    └── ThemeContext.tsx  # Theme management (dark/light mode)
```

## Usage Guide

### Basic Interaction

1. **Ask the Oracle**: Type your question in the input field
2. **Watch the Divine Response**: The torch will animate as the AI streams its response
3. **Access Features**: Swipe down from the top or tap the orb icon (top-right)

### Secret Settings

1. **Triple-tap** the top-left corner of the screen
2. **Style Tab**: Toggle between dark and light modes, switch animation styles
3. **History Tab**: View your interaction history (coming soon)

### Divine Tab Features

1. Navigate to the **Divine** tab in the main drawer
2. Press **Go** to generate a mystical I Ching hexagram
3. Watch as 8 lines are drawn in elegant calligraphy (broken or unbroken)

## Technical Notes

- Built with **Expo SDK 53** and **React Native**
- Uses **TypeScript** for type safety
- **Cross-platform compatible** (iOS, Android, Web)
- **Responsive design** adapts to different screen sizes
- **Optimized animations** using React Native's Animated API

## Support

For technical issues or questions about the mystical features, please refer to the app's built-in guidance or consult the ancient wisdom within. 🔮

---

_"Know thyself" - Oracle of Delphi_
