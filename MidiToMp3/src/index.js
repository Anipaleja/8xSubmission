const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

/**
 * MidiToMp3Converter - Convert MIDI files to MP3
 * Requires: ffmpeg, timidity (or fluidsynth) to be installed on system
 */
class MidiToMp3Converter {
  constructor(options = {}) {
    this.soundfont = options.soundfont || '/usr/share/soundfonts/FluidR3_GM.sf2';
    this.quality = options.quality || 192; // bitrate in kbps
    this.sampleRate = options.sampleRate || 44100;
    this.checkRequirements();
  }

  /**
   * Check if required system tools are installed
   */
  checkRequirements() {
    try {
      require('fluent-ffmpeg').setFfmpegPath(
        require('ffmpeg-static').path
      );
    } catch (e) {
      console.warn('ffmpeg-static not found, ensure ffmpeg is in PATH');
    }
  }

  /**
   * Convert MIDI file to WAV (intermediate format)
   */
  async midiToWav(midiPath, wavPath) {
    const soundfontOption = fs.existsSync(this.soundfont)
      ? `-soundfont ${this.soundfont}`
      : '';

    const command = `timidity ${midiPath} -Ow -o ${wavPath} -r ${this.sampleRate} ${soundfontOption}`;

    try {
      await execPromise(command);
      return true;
    } catch (error) {
      // Fallback: try fluidsynth
      const fluidCommand = `fluidsynth -F ${wavPath} ${this.soundfont} ${midiPath}`;
      try {
        await execPromise(fluidCommand);
        return true;
      } catch (err) {
        throw new Error(
          `Failed to convert MIDI to WAV. Ensure timidity or fluidsynth is installed.\nOriginal error: ${error.message}`
        );
      }
    }
  }

  /**
   * Convert WAV file to MP3
   */
  wavToMp3(wavPath, mp3Path) {
    return new Promise((resolve, reject) => {
      ffmpeg(wavPath)
        .audioCodec('libmp3lame')
        .audioBitrate(`${this.quality}k`)
        .on('error', (err) => reject(err))
        .on('end', () => resolve(true))
        .save(mp3Path);
    });
  }

  /**
   * Main conversion method: MIDI -> WAV -> MP3
   */
  async convert(midiPath, mp3Path, options = {}) {
    const quality = options.quality || this.quality;
    const sampleRate = options.sampleRate || this.sampleRate;

    // Validate input
    if (!fs.existsSync(midiPath)) {
      throw new Error(`MIDI file not found: ${midiPath}`);
    }

    if (!midiPath.toLowerCase().endsWith('.mid') && !midiPath.toLowerCase().endsWith('.midi')) {
      throw new Error('Input file must be a MIDI file (.mid or .midi)');
    }

    // Create temp WAV file
    const tempWav = path.join(
      path.dirname(mp3Path),
      `.${path.basename(mp3Path, '.mp3')}_temp.wav`
    );

    try {
      console.log(`🎵 Converting MIDI to WAV...`);
      await this.midiToWav(midiPath, tempWav);

      console.log(`🎵 Converting WAV to MP3 (${quality}kbps)...`);
      await this.wavToMp3(tempWav, mp3Path);

      console.log(`✅ Conversion complete: ${mp3Path}`);
      return mp3Path;
    } catch (error) {
      throw error;
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempWav)) {
        fs.unlinkSync(tempWav);
      }
    }
  }

  /**
   * Batch convert multiple MIDI files
   */
  async convertBatch(midiFiles, outputDir, options = {}) {
    const results = [];

    for (const midiFile of midiFiles) {
      try {
        const fileName = path.basename(midiFile, path.extname(midiFile));
        const mp3Path = path.join(outputDir, `${fileName}.mp3`);

        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const result = await this.convert(midiFile, mp3Path, options);
        results.push({ input: midiFile, output: result, status: 'success' });
      } catch (error) {
        results.push({
          input: midiFile,
          status: 'error',
          error: error.message,
        });
      }
    }

    return results;
  }
}

module.exports = MidiToMp3Converter;
