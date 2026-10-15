/**
 * ErgoVision AI - 20-20-20 Eye Rest & Visual Hygiene Guardian
 * Follows the clinical 20-20-20 rule: Every 20 minutes, gaze at 20 feet (6m) for 20 seconds.
 */

import { playZenBell, playSoftTick } from '../audio/audio-engine.js';

export const EYE_REST_CONFIG = {
  workMinutes: 20,
  restSeconds: 20
};

export class EyeRestManager {
  constructor(config = EYE_REST_CONFIG) {
    this.config = { ...config };
    this.workSeconds = this.config.workMinutes * 60;
    this.restSeconds = this.config.restSeconds;
    this.remainingWorkSeconds = this.workSeconds;
    this.remainingRestSeconds = this.restSeconds;
    this.isEyeRestActive = false;
    this.isPaused = false;
    this.timerId = null;
    this.callbacks = {
      onTick: null,
      onRestStart: null,
      onRestEnd: null
    };
  }

  setCallbacks({ onTick, onRestStart, onRestEnd }) {
    if (onTick) this.callbacks.onTick = onTick;
    if (onRestStart) this.callbacks.onRestStart = onRestStart;
    if (onRestEnd) this.callbacks.onRestEnd = onRestEnd;
  }

  start() {
    this.stop();
    this.isPaused = false;
    this.isEyeRestActive = false;
    this.remainingWorkSeconds = this.workSeconds;
    this.remainingRestSeconds = this.restSeconds;
    this._runTimer();
  }

  _runTimer() {
    this.timerId = setInterval(() => {
      if (this.isPaused) return;

      if (!this.isEyeRestActive) {
        this.remainingWorkSeconds--;
        if (this.callbacks.onTick) {
          this.callbacks.onTick({
            workSecondsRemaining: this.remainingWorkSeconds,
            restSecondsRemaining: this.remainingRestSeconds,
            isEyeRestActive: false
          });
        }

        if (this.remainingWorkSeconds <= 0) {
          this.startRest();
        }
      } else {
        this.remainingRestSeconds--;
        playSoftTick();

        if (this.callbacks.onTick) {
          this.callbacks.onTick({
            workSecondsRemaining: 0,
            restSecondsRemaining: this.remainingRestSeconds,
            isEyeRestActive: true
          });
        }

        if (this.remainingRestSeconds <= 0) {
          this.endRest();
        }
      }
    }, 1000);
  }

  startRest() {
    this.isEyeRestActive = true;
    this.remainingRestSeconds = this.restSeconds;
    playZenBell(528); // Fréquence réparatrice
    if (this.callbacks.onRestStart) {
      this.callbacks.onRestStart();
    }
  }

  endRest() {
    this.isEyeRestActive = false;
    this.remainingWorkSeconds = this.workSeconds;
    this.remainingRestSeconds = this.restSeconds;
    playZenBell(660);
    if (this.callbacks.onRestEnd) {
      this.callbacks.onRestEnd();
    }
  }

  skipRest() {
    if (this.isEyeRestActive) {
      this.endRest();
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
