/**
 * ErgoVision AI - Physiotherapy Routine State Engine
 * Manages active stretch pacing, hold intervals, repetitions and breathing cycles.
 */

import { getKineExercises } from './exercises.js';
import { playZenBell, playSoftTick } from '../audio/audio-engine.js';

export class KineRoutineManager {
  constructor() {
    this.exercises = getKineExercises();
    this.currentIndex = 0;
    this.phase = 'idle'; // 'idle' | 'prep' | 'hold' | 'rest' | 'completed'
    this.currentRep = 1;
    this.secondsRemaining = 0;
    this.totalExerciseSeconds = 0;
    this.isPaused = false;
    this.timerId = null;
    this.callbacks = {
      onTick: null,
      onPhaseChange: null,
      onExerciseChange: null,
      onRoutineComplete: null
    };
  }

  getCurrentExercise() {
    return this.exercises[this.currentIndex] || null;
  }

  setCallbacks({ onTick, onPhaseChange, onExerciseChange, onRoutineComplete }) {
    if (onTick) this.callbacks.onTick = onTick;
    if (onPhaseChange) this.callbacks.onPhaseChange = onPhaseChange;
    if (onExerciseChange) this.callbacks.onExerciseChange = onExerciseChange;
    if (onRoutineComplete) this.callbacks.onRoutineComplete = onRoutineComplete;
  }

  start() {
    this.currentIndex = 0;
    this.isPaused = false;
    this.startExercise(0);
  }

  startExercise(index) {
    if (index >= this.exercises.length) {
      this.completeRoutine();
      return;
    }
    this.currentIndex = index;
    this.currentRep = 1;
    this.startPrepPhase();
    if (this.callbacks.onExerciseChange) {
      this.callbacks.onExerciseChange(this.getCurrentExercise(), this.currentIndex, this.exercises.length);
    }
  }

  startPrepPhase() {
    this.phase = 'prep';
    this.secondsRemaining = 4; // 4s setup time
    this.totalExerciseSeconds = 4;
    playZenBell(432);
    this._notifyPhase();
    this._runTimer();
  }

  startHoldPhase() {
    const ex = this.getCurrentExercise();
    this.phase = 'hold';
    this.secondsRemaining = ex.holdSec;
    this.totalExerciseSeconds = ex.holdSec;
    playSoftTick();
    this._notifyPhase();
    this._runTimer();
  }

  startRestPhase() {
    const ex = this.getCurrentExercise();
    this.phase = 'rest';
    this.secondsRemaining = ex.restSec;
    this.totalExerciseSeconds = ex.restSec;
    this._notifyPhase();
    this._runTimer();
  }

  _notifyPhase() {
    if (this.callbacks.onPhaseChange) {
      this.callbacks.onPhaseChange({
        phase: this.phase,
        exercise: this.getCurrentExercise(),
        rep: this.currentRep,
        totalReps: this.getCurrentExercise().reps,
        secondsRemaining: this.secondsRemaining,
        totalSeconds: this.totalExerciseSeconds
      });
    }
  }

  _runTimer() {
    clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      if (this.isPaused) return;

      this.secondsRemaining--;
      if (this.callbacks.onTick) {
        this.callbacks.onTick({
          phase: this.phase,
          secondsRemaining: this.secondsRemaining,
          totalSeconds: this.totalExerciseSeconds,
          rep: this.currentRep,
          totalReps: this.getCurrentExercise().reps,
          breathState: this.phase === 'hold' ? 'in' : 'out'
        });
      }

      if (this.secondsRemaining <= 0) {
        this._handlePhaseTransition();
      }
    }, 1000);
  }

  _handlePhaseTransition() {
    const ex = this.getCurrentExercise();
    if (this.phase === 'prep') {
      this.startHoldPhase();
    } else if (this.phase === 'hold') {
      if (this.currentRep < ex.reps) {
        this.startRestPhase();
      } else {
        // Exercise completed, advance
        playZenBell(576);
        if (this.currentIndex + 1 < this.exercises.length) {
          this.startExercise(this.currentIndex + 1);
        } else {
          this.completeRoutine();
        }
      }
    } else if (this.phase === 'rest') {
      this.currentRep++;
      this.startHoldPhase();
    }
  }

  completeRoutine() {
    clearInterval(this.timerId);
    this.timerId = null;
    this.phase = 'completed';
    playZenBell(648);
    this._notifyPhase();
    if (this.callbacks.onRoutineComplete) {
      this.callbacks.onRoutineComplete();
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  next() {
    clearInterval(this.timerId);
    if (this.currentIndex + 1 < this.exercises.length) {
      this.startExercise(this.currentIndex + 1);
    } else {
      this.completeRoutine();
    }
  }

  prev() {
    clearInterval(this.timerId);
    if (this.currentIndex > 0) {
      this.startExercise(this.currentIndex - 1);
    } else {
      this.startExercise(0);
    }
  }

  skip() {
    this.next();
  }

  stop() {
    clearInterval(this.timerId);
    this.timerId = null;
    this.phase = 'idle';
    this.isPaused = false;
  }
}
