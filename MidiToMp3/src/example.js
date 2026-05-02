const MidiToMp3Converter = require('./index.js');
const path = require('path');

/**
 * Example: Basic usage in a project
 */
async function exampleBasicConversion() {
  const converter = new MidiToMp3Converter({
    quality: 192, // bitrate in kbps
    sampleRate: 44100,
  });

  try {
    await converter.convert(
      './path/to/song.mid',
      './path/to/song.mp3'
    );
  } catch (error) {
    console.error('Conversion failed:', error.message);
  }
}

/**
 * Example: High-quality conversion
 */
async function exampleHighQuality() {
  const converter = new MidiToMp3Converter({
    quality: 320,
    sampleRate: 48000,
    soundfont: '/usr/share/soundfonts/FluidR3_GM.sf2',
  });

  await converter.convert(
    './input.mid',
    './output_hq.mp3',
    { quality: 320, sampleRate: 48000 }
  );
}

/**
 * Example: Batch conversion
 */
async function exampleBatchConversion() {
  const converter = new MidiToMp3Converter({ quality: 192 });

  const midiFiles = [
    './song1.mid',
    './song2.mid',
    './song3.mid',
  ];

  const results = await converter.convertBatch(
    midiFiles,
    './output_mp3_files'
  );

  console.log('Batch conversion results:', results);
}

/**
 * Example: Integration in an Express API
 */
async function exampleExpressIntegration() {
  const express = require('express');
  const multer = require('multer');
  const converter = new MidiToMp3Converter({ quality: 256 });

  const app = express();
  const upload = multer({ dest: 'uploads/' });

  app.post('/convert', upload.single('midi'), async (req, res) => {
    try {
      const outputPath = `./mp3_files/${req.file.filename}.mp3`;
      
      const result = await converter.convert(
        req.file.path,
        outputPath
      );

      res.download(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.listen(3000, () => console.log('API running on port 3000'));
}

console.log(`
✅ MIDI to MP3 Converter Module Loaded
Import this module in your project:

  const MidiToMp3Converter = require('midi-to-mp3-converter');
  const converter = new MidiToMp3Converter({ quality: 192 });
  await converter.convert('input.mid', 'output.mp3');

Examples above show basic, high-quality, batch, and API integration usage.
`);
