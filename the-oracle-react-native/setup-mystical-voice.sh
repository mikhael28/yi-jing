#!/bin/bash

# Mystical Voice Setup Script for Oracle Yi Jing App
# This script sets up the divine audio effects system

echo "🔮 Setting up the Oracle's Mystical Voice System..."
echo "=================================================="

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing Python audio processing dependencies..."
cd api

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing audio processing libraries..."
pip install --upgrade pip
pip install setuptools wheel
pip install -r requirements.txt

# Check if FFmpeg is available (required for audio processing)
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg is not installed - REQUIRED for mystical audio effects!"
    echo ""
    echo "📥 Installing FFmpeg..."
    
    # Detect OS and install FFmpeg
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt-get &> /dev/null; then
            echo "🐧 Detected Ubuntu/Debian - installing FFmpeg..."
            sudo apt-get update && sudo apt-get install -y ffmpeg
        elif command -v dnf &> /dev/null; then
            echo "🎩 Detected Fedora/RHEL - installing FFmpeg..."
            sudo dnf install -y ffmpeg
        elif command -v pacman &> /dev/null; then
            echo "🏹 Detected Arch Linux - installing FFmpeg..."
            sudo pacman -S --noconfirm ffmpeg
        else
            echo "❌ Unknown Linux distribution. Please install FFmpeg manually:"
            echo "   Visit: https://ffmpeg.org/download.html"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            echo "🍎 Detected macOS - installing FFmpeg with Homebrew..."
            brew install ffmpeg
        else
            echo "❌ Homebrew not found. Please install FFmpeg manually:"
            echo "   1. Install Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            echo "   2. Run: brew install ffmpeg"
        fi
    else
        echo "❌ Unsupported OS. Please install FFmpeg manually:"
        echo "   - Windows: Download from https://ffmpeg.org/download.html"
        echo "   - Or use chocolatey: choco install ffmpeg"
    fi
    
    echo ""
    # Verify installation
    if command -v ffmpeg &> /dev/null; then
        echo "✅ FFmpeg installed successfully!"
        ffmpeg -version | head -1
    else
        echo "⚠️  FFmpeg installation may have failed. Audio effects might not work optimally."
        echo "   Please install FFmpeg manually and restart the setup."
    fi
else
    echo "✅ FFmpeg is already installed!"
    ffmpeg -version | head -1
fi

echo "✅ Python dependencies installed successfully!"

# Go back to project root
cd ..

echo ""
echo "🎵 Mystical Voice System Setup Complete!"
echo "======================================="
echo ""
echo "🔧 To start the enhanced voice API server:"
echo "   cd api"
echo "   source venv/bin/activate  # (Linux/Mac)"
echo "   # OR venv\\Scripts\\activate  # (Windows)"
echo "   python main.py"
echo ""
echo "📱 The React Native app now includes:"
echo "   ✨ Sacred Reverb - Cathedral-like spaciousness"
echo "   🌊 Mystical Echo - Ethereal voice resonance"
echo "   👼 Angelic Chorus - Celestial choir harmonies"
echo "   🎵 Divine Harmonics - Multiple voice layers"
echo "   🌌 Mystical Ambience - Background atmosphere"
echo ""
echo "🎮 Access the mystical effects in the app:"
echo "   1. Triple-tap the top-left corner to open settings"
echo "   2. Navigate to the 'Voice' tab"
echo "   3. Enable 'Divine Audio Effects'"
echo "   4. Customize your mystical experience!"
echo ""
echo "🔮 May the Oracle's voice guide you to enlightenment!"
