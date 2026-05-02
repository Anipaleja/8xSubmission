#!/usr/bin/env node

const MidiToMp3Converter = require('./index.js');
const path = require('path');
const fs = require('fs');

// Simple CLI argument parser
const args = process.argv.slice(2);

function showHelp() {
  console.log(`
MIDI to MP3 Converter
Usage: midi-to-mp3 [options] <input.mid> [output.mp3]

Options:
  -h, --help              Show this help message
  -q, --quality <kbps>    MP3 quality (default: 192)
  -r, --rate <hz>         Sample rate (default: 44100)
  -s, --soundfont <path>  Path to soundfont (default: /usr/share/soundfonts/FluidR3_GM.sf2)

Examples:
  midi-to-mp3 song.mid
  midi-to-mp3 -q 320 song.mid output.mp3
  midi-to-mp3 --soundfont /path/to/font.sf2 song.mid
`);
}

async function main() {
  let midiPath = null;
  let mp3Path = null;
  let quality = 192;
  let sampleRate = 44100;
  let soundfont = '/usr/share/soundfonts/FluidR3_GM.sf2';

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      showHelp();
      process.exit(0);
    } else if (arg === '-q' || arg === '--quality') {
      quality = parseInt(args[++i]);
    } else if (arg === '-r' || arg === '--rate') {
      sampleRate = parseInt(args[++i]);
    } else if (arg === '-s' || arg === '--soundfont') {
      soundfont = args[++i];
    } else if (!midiPath) {
      midiPath = arg;
    } else if (!mp3Path) {
      mp3Path = arg;
    }
  }

  if (!midiPath) {
    console.error('❌ Error: No MIDI file provided');
    showHelp();
    process.exit(1);
  }

  // Default output path
  if (!mp3Path) {
    mp3Path = midiPath.replace(/\.(mid|midi)$/i, '.mp3');
  }

  try {
    const converter = new MidiToMp3Converter({
      quality,
      sampleRate,
      soundfont,
    });

    await converter.convert(midiPath, mp3Path, { quality, sampleRate });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
