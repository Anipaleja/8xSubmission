/**
 * TypeScript type definitions for midi-to-mp3-converter
 */

export interface ConversionOptions {
  quality?: number;
  sampleRate?: number;
}

export interface ConverterOptions {
  soundfont?: string;
  quality?: number;
  sampleRate?: number;
}

export interface ConversionResult {
  input: string;
  output?: string;
  status: 'success' | 'error';
  error?: string;
}

export class MidiToMp3Converter {
  constructor(options?: ConverterOptions);
  
  /**
   * Convert a single MIDI file to MP3
   */
  convert(
    midiPath: string,
    mp3Path: string,
    options?: ConversionOptions
  ): Promise<string>;
  
  /**
   * Convert multiple MIDI files to MP3
   */
  convertBatch(
    midiFiles: string[],
    outputDir: string,
    options?: ConversionOptions
  ): Promise<ConversionResult[]>;
}

export default MidiToMp3Converter;
