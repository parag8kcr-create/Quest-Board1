/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  redeem: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  alarm: 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3',
  token: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
};

class SoundManager {
  static instance;
  audioCache = new Map();
  muted = false;

  constructor() {}

  static getInstance() {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  setMuted(isMuted) {
    this.muted = isMuted;
  }

  play(soundName) {
    if (this.muted) return;
    const url = SOUNDS[soundName];
    let audio = this.audioCache.get(url);
    if (!audio) {
      audio = new Audio(url);
      this.audioCache.set(url, audio);
    }
    audio.currentTime = 0;
    audio.play().catch(e => console.warn('Sound playback blocked:', e));
  }
}

export const soundManager = SoundManager.getInstance();
