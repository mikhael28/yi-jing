/**
 * Mystical Voice System Test Script
 * Tests the audio effects API endpoints and validates configuration
 */

const API_BASE_URL = 'http://localhost:8001';

// Test configuration with mystical effects
const testConfig = {
  text: "Behold, seeker of ancient wisdom! The Oracle speaks through divine channels, blessed with sacred reverb, mystical echo, and celestial chorus. Can you feel the otherworldly power flowing through these words?",
  voice: "alloy",
  model: "tts-1",
  speed: 1.0,
  mystical_effects: {
    enabled: true,
    reverb: {
      enabled: true,
      roomSize: 0.8,
      damping: 0.5,
      wetLevel: 0.4
    },
    echo: {
      enabled: true,
      delay: 300,
      feedback: 0.3,
      wetLevel: 0.2
    },
    chorus: {
      enabled: true,
      depth: 0.3,
      rate: 0.5,
      wetLevel: 0.15
    },
    harmonics: {
      enabled: true,
      layers: 2,
      detune: 15
    },
    ambience: {
      enabled: true,
      type: "celestial",
      volume: 0.3
    },
    pitchShift: {
      enabled: false,
      semitones: 0
    }
  }
};

async function testVoiceService() {
  console.log('🔮 Testing Mystical Voice System...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing API Health...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    
    if (healthData.voice_available) {
      console.log('✅ Voice service is healthy');
    } else {
      console.log('❌ Voice service is not available');
      return;
    }

    // Test 2: Available Voices
    console.log('\n2️⃣  Testing Available Voices...');
    const voicesResponse = await fetch(`${API_BASE_URL}/voices`);
    const voicesData = await voicesResponse.json();
    console.log(`✅ Found ${voicesData.voices.length} available voices`);

    // Test 3: Basic TTS without effects
    console.log('\n3️⃣  Testing Basic TTS (no effects)...');
    const basicConfig = { ...testConfig, mystical_effects: null };
    const basicResponse = await fetch(`${API_BASE_URL}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(basicConfig)
    });
    const basicData = await basicResponse.json();
    
    if (basicData.success) {
      console.log('✅ Basic TTS working');
      console.log(`   Audio size: ${Math.round(basicData.audio_base64.length / 1024)}KB`);
    } else {
      console.log('❌ Basic TTS failed:', basicData.error);
    }

    // Test 4: Mystical Effects TTS
    console.log('\n4️⃣  Testing Mystical Effects TTS...');
    const mysticalResponse = await fetch(`${API_BASE_URL}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testConfig)
    });
    const mysticalData = await mysticalResponse.json();
    
    if (mysticalData.success) {
      console.log('✅ Mystical effects TTS working');
      console.log(`   Audio size: ${Math.round(mysticalData.audio_base64.length / 1024)}KB`);
      console.log(`   Effects applied: ${mysticalData.mystical_effects_applied ? 'Yes' : 'No'}`);
      
      // Compare sizes
      const sizeIncrease = ((mysticalData.audio_base64.length - basicData.audio_base64.length) / basicData.audio_base64.length * 100).toFixed(1);
      console.log(`   Size increase with effects: ${sizeIncrease}%`);
    } else {
      console.log('❌ Mystical effects TTS failed:', mysticalData.error);
    }

    // Test 5: Streaming TTS with effects
    console.log('\n5️⃣  Testing Streaming TTS with effects...');
    const streamResponse = await fetch(`${API_BASE_URL}/tts/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...testConfig, chunk_size: 30 })
    });
    
    if (streamResponse.ok) {
      console.log('✅ Streaming TTS endpoint accessible');
      // Note: Full streaming test would require reading the stream
    } else {
      console.log('❌ Streaming TTS failed');
    }

    // Test 6: Effect Configuration Validation
    console.log('\n6️⃣  Testing Effect Configuration...');
    const effects = testConfig.mystical_effects;
    
    console.log(`   Reverb: ${effects.reverb.enabled ? '✅' : '❌'} (Room: ${effects.reverb.roomSize}, Wet: ${effects.reverb.wetLevel})`);
    console.log(`   Echo: ${effects.echo.enabled ? '✅' : '❌'} (Delay: ${effects.echo.delay}ms, Feedback: ${effects.echo.feedback})`);
    console.log(`   Chorus: ${effects.chorus.enabled ? '✅' : '❌'} (Depth: ${effects.chorus.depth}, Rate: ${effects.chorus.rate}Hz)`);
    console.log(`   Harmonics: ${effects.harmonics.enabled ? '✅' : '❌'} (Layers: ${effects.harmonics.layers}, Detune: ${effects.harmonics.detune} cents)`);
    console.log(`   Ambience: ${effects.ambience.enabled ? '✅' : '❌'} (Type: ${effects.ambience.type}, Volume: ${effects.ambience.volume})`);

    console.log('\n🎉 Mystical Voice System Test Complete!');
    console.log('\n📱 To test in the React Native app:');
    console.log('   1. Start the app and triple-tap top-left corner');
    console.log('   2. Go to Voice settings');
    console.log('   3. Enable mystical effects');
    console.log('   4. Test voice with different configurations');
    console.log('\n🔮 May the Oracle\'s voice guide you to enlightenment!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Ensure the API server is running (python api/main.py)');
    console.log('   - Check that all Python dependencies are installed');
    console.log('   - Verify OpenAI API key is configured');
    console.log('   - Make sure FFmpeg is installed for audio processing');
  }
}

// Run the test
testVoiceService();
