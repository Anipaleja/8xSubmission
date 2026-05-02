#!/usr/bin/env node

/**
 * Setup verification script
 * Checks if all required dependencies are installed
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execPromise = promisify(exec);

async function checkCommand(command, displayName) {
  try {
    await execPromise(`${command} --version`);
    console.log(`✅ ${displayName} is installed`);
    return true;
  } catch (error) {
    console.log(`❌ ${displayName} is NOT installed`);
    return false;
  }
}

async function verify() {
  console.log('\n🔍 Checking MIDI to MP3 Converter dependencies...\n');

  const checks = [
    checkCommand('ffmpeg', 'FFmpeg'),
    checkCommand('timidity', 'TiMidity') || checkCommand('fluidsynth', 'Fluidsynth'),
    checkCommand('node', 'Node.js'),
  ];

  const results = await Promise.all(checks);

  console.log('\n' + '='.repeat(50));

  if (results.every(r => r)) {
    console.log('✅ All dependencies are installed!');
    console.log('\nYou can now use the converter:');
    console.log('  npm install');
    console.log('  node src/example.js');
  } else {
    console.log('⚠️  Missing dependencies detected.');
    console.log('\nPlease install:');
    if (!results[0]) console.log('  - FFmpeg');
    if (!results[1]) console.log('  - TiMidity or Fluidsynth');
    console.log('\nSee README.md for installation instructions.');
  }

  console.log('='.repeat(50) + '\n');
}

verify();
