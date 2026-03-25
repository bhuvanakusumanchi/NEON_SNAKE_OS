import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'SYNTH_WAVE_01',
    artist: 'NEURAL_CORE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12',
  },
  {
    id: '2',
    title: 'GLITCH_DATA_STREAM',
    artist: 'VOID_ENGINE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05',
  },
  {
    id: '3',
    title: 'CYBER_PULSE_X',
    artist: 'BINARY_GHOST',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:22',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 50;
