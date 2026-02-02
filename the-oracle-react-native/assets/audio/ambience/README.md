# Mystical Ambience Audio Assets

This directory contains ambient audio files for creating divine, otherworldly atmosphere during Oracle responses.

## Files:

- `temple-bells.mp3` - Soft temple bells and chimes for a sacred atmosphere
- `cosmic-wind.mp3` - Ethereal wind sounds with cosmic undertones
- `mystical-forest.mp3` - Forest ambience with magical elements
- `celestial-choir.mp3` - Angelic choir harmonies for divine presence

## Usage:

These files are automatically loaded by the VoiceService based on the selected ambience type in the mystical effects configuration.

## Audio Requirements:

- Format: MP3
- Duration: 60+ seconds (loopable)
- Volume: Pre-normalized for background use
- Quality: High enough for immersive experience but small enough for mobile

## Installation:

To add custom ambient sounds:

1. Place MP3 files in this directory
2. Update the `getAmbiencePath` method in VoiceService.ts
3. Add the new type to the VoiceConfig interface
