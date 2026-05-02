# MIDI to MP3 Converter

A lightweight, pluggable MIDI to MP3 converter for Node.js projects. Easily integrate it into your music production, game, or web application.

## Features

✅ **Simple API** - Easy to import and use in any Node.js project  
✅ **Customizable** - Control quality, sample rate, and soundfont  
✅ **Batch Processing** - Convert multiple MIDI files at once  
✅ **CLI Tool** - Use from command line directly  
✅ **CLI Tool** - Use from command line directly  
✅ **Express Integration** - Ready for REST API endpoints  
✅ **Error Handling** - Comprehensive error messages  

## Prerequisites

This converter requires system-level audio synthesis tools. Choose one:

### Option 1: TiMidity (Recommended)

**macOS:**
```bash
brew install timidity
```

**Ubuntu/Debian:**
```bash
sudo apt-get install timidity
```

**CentOS/RHEL:**
```bash
sudo yum install timidity
```

### Option 2: Fluidsynth

**macOS:**
```bash
brew install fluidsynth
```

**Ubuntu/Debian:**
```bash
sudo apt-get install fluidsynth
```

### Required: FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**CentOS/RHEL:**
```bash
sudo yum install ffmpeg
```

## Installation

### As an npm package (coming soon to npm registry):

```bash
npm install midi-to-mp3-converter
```

### Local development:

```bash
cd MidiToMp3
npm install
```

## Usage

### Basic Usage (Library)

```javascript
const MidiToMp3Converter = require('midi-to-mp3-converter');

const converter = new MidiToMp3Converter({
  quality: 192,      // bitrate in kbps (default: 192)
  sampleRate: 44100, // Hz (default: 44100)
});

// Convert single file
await converter.convert('song.mid', 'song.mp3');
```

### High-Quality Conversion

```javascript
const converter = new MidiToMp3Converter({
  quality: 320,
  sampleRate: 48000,
  soundfont: '/usr/share/soundfonts/FluidR3_GM.sf2',
});

await converter.convert('input.mid', 'output.mp3');
```

### Batch Conversion

```javascript
const converter = new MidiToMp3Converter();

const results = await converter.convertBatch(
  ['song1.mid', 'song2.mid', 'song3.mid'],
  './mp3_output'
);

console.log(results);
// Output: [
//   { input: 'song1.mid', output: './mp3_output/song1.mp3', status: 'success' },
//   ...
// ]
```

### CLI Usage

```bash
# Basic conversion
midi-to-mp3 song.mid

# With custom quality (192-320 kbps)
midi-to-mp3 -q 256 song.mid output.mp3

# With custom sample rate
midi-to-mp3 -r 48000 song.mid

# With custom soundfont
midi-to-mp3 -s /path/to/font.sf2 song.mid
```

### Express.js Integration

```javascript
const express = require('express');
const multer = require('multer');
const MidiToMp3Converter = require('midi-to-mp3-converter');

const app = express();
const upload = multer({ dest: 'uploads/' });
const converter = new MidiToMp3Converter({ quality: 256 });

app.post('/api/convert', upload.single('midi'), async (req, res) => {
  try {
    const outputPath = `./mp3_output/${req.file.filename}.mp3`;
    const result = await converter.convert(req.file.path, outputPath);
    res.download(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

## API Reference

### Constructor

```javascript
new MidiToMp3Converter(options)
```

**Options:**
- `quality` (number): MP3 bitrate in kbps (128-320, default: 192)
- `sampleRate` (number): Audio sample rate in Hz (default: 44100)
- `soundfont` (string): Path to soundfont file (default: /usr/share/soundfonts/FluidR3_GM.sf2)

### Methods

#### `convert(midiPath, mp3Path, options)`

Convert a single MIDI file to MP3.

**Parameters:**
- `midiPath` (string): Path to input MIDI file
- `mp3Path` (string): Path to output MP3 file
- `options` (object): Optional quality/sampleRate overrides

**Returns:** Promise<string> - Path to output MP3 file

**Example:**
```javascript
await converter.convert('input.mid', 'output.mp3', { quality: 320 });
```

#### `convertBatch(midiFiles, outputDir, options)`

Convert multiple MIDI files to MP3.

**Parameters:**
- `midiFiles` (string[]): Array of MIDI file paths
- `outputDir` (string): Output directory for MP3 files
- `options` (object): Optional quality/sampleRate overrides

**Returns:** Promise<Array> - Array of conversion results

**Example:**
```javascript
const results = await converter.convertBatch(
  ['song1.mid', 'song2.mid'],
  './mp3_files'
);
```

## Soundfont Locations

The converter looks for soundfonts in standard system locations:
- **macOS:** `/usr/local/share/soundfonts/`, `/usr/share/soundfonts/`
- **Linux:** `/usr/share/soundfonts/`
- **Windows:** `C:\soundfonts\`

### Popular Free Soundfonts

- [FluidR3_GM](https://musical-artifacts.com/artifacts/1) - General MIDI (recommended)
- [GeneralUser GS](https://www.schristiancollins.com/generaluser.php)
- [Unison GM](https://www.unisonguitars.com/soundfont.html)

## Performance Considerations

- **Quality:** Higher bitrate = larger file size. Use 192-256 for most use cases, 320 for lossless quality.
- **Sample Rate:** 44100 Hz is standard; 48000 Hz for professional audio.
- **Batch Processing:** Conversions run sequentially. For large batches, consider a queue system.

## Troubleshooting

### "timidity: command not found" or "fluidsynth: command not found"

Ensure you've installed the required audio synthesis tools (see Prerequisites above).

### "ffmpeg: command not found"

Install ffmpeg using your system package manager (brew, apt, yum, etc.).

### Conversion produces silent or low-quality audio

Try a different soundfont or increase the sample rate:
```javascript
const converter = new MidiToMp3Converter({
  soundfont: '/path/to/different/font.sf2',
  sampleRate: 48000,
});
```

### Out of memory with large batch conversions

Process conversions in smaller batches:
```javascript
const chunkSize = 10;
for (let i = 0; i < files.length; i += chunkSize) {
  const batch = files.slice(i, i + chunkSize);
  await converter.convertBatch(batch, outputDir);
}
```

## License

MIT

## Contributing

Contributions welcome! Feel free to submit issues or pull requests.

---

**Built with:** ffmpeg, timidity/fluidsynth, Node.js
