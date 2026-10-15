/**
 * ErgoVision AI - Kiné Studio UI View Component (Fluent UI 2 Mica)
 * Displays interactive back physiotherapy exercises with step-by-step guidance.
 */

import { t } from '../i18n/translations.js';

export class KineStudioView {
  constructor(containerId, routineManager) {
    this.container = document.getElementById(containerId);
    this.manager = routineManager;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.renderInitialStructure();
    this.bindManagerCallbacks();
  }

  renderInitialStructure() {
    this.container.innerHTML = `
      <div class="kine-studio-card" role="region" aria-label="${t('kine_studio_title')}">
        <!-- Header du Studio -->
        <div class="kine-header">
          <div class="kine-header-title">
            <svg class="icon kine-icon-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a4 4 0 0 0-4 4v12a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Z"/>
              <path d="M6 10h12"/>
              <path d="M6 14h12"/>
            </svg>
            <div>
              <div class="kine-title" id="kineStudioTitle">${t('kine_studio_title')}</div>
              <div class="kine-subtitle" id="kineStudioSub">${t('kine_studio_subtitle')}</div>
            </div>
          </div>
          <span id="kineProtocolBadge" class="kine-badge">McKenzie</span>
        </div>

        <!-- Corps de l'exercice actif -->
        <div class="kine-body">
          <div class="kine-visual-box" id="kineSvgBox">
            <!-- SVG injecté dynamiquement -->
          </div>
          <div class="kine-details">
            <div class="kine-exercise-name" id="kineExName">---</div>
            <div class="kine-zone-badge" id="kineZoneBadge">---</div>
            <p class="kine-steps" id="kineExSteps">---</p>
            <div class="kine-benefit-box">
              <svg class="icon" style="width:14px; height:14px; color:var(--status-success); flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              <span id="kineExBenefit" class="kine-benefit-text">---</span>
            </div>
          </div>
        </div>

        <!-- Jauge de Maintien & Respiration Guidée -->
        <div class="kine-pacing-bar">
          <div class="kine-timer-circle">
            <span id="kineTimerDigits" class="mono-big kine-digits">04</span>
            <span id="kinePhaseLabel" class="kine-phase-label">${t('kine_phase_prep')}</span>
          </div>

          <div class="kine-breath-guide">
            <div class="kine-breath-bubble" id="kineBreathBubble"></div>
            <div class="kine-breath-text" id="kineBreathText">${t('kine_breath_in')}</div>
            <div class="kine-rep-counter" id="kineRepCounter">${t('kine_rep_label')} 1 / 5</div>
          </div>
        </div>

        <!-- Contrôles de Routine -->
        <div class="kine-actions">
          <button type="button" class="btn-action kine-btn" id="kineBtnPrev" title="${t('kine_btn_prev')}">
            <svg class="icon" viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
            <span>${t('kine_btn_prev')}</span>
          </button>
          <button type="button" class="btn-action kine-btn kine-btn-primary" id="kineBtnTogglePause">
            <svg class="icon" id="kineIconPause" viewBox="0 0 24 24"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>
            <span id="kineTextPause">${t('kine_btn_pause')}</span>
          </button>
          <button type="button" class="btn-action kine-btn" id="kineBtnNext" title="${t('kine_btn_next')}">
            <span>${t('kine_btn_next')}</span>
            <svg class="icon" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
          </button>
        </div>
      </div>
    `;

    this.bindDomEvents();
  }

  bindDomEvents() {
    const prevBtn = document.getElementById('kineBtnPrev');
    const nextBtn = document.getElementById('kineBtnNext');
    const pauseBtn = document.getElementById('kineBtnTogglePause');

    if (prevBtn) prevBtn.addEventListener('click', () => this.manager.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.manager.next());
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        const isPaused = this.manager.togglePause();
        const icon = document.getElementById('kineIconPause');
        const text = document.getElementById('kineTextPause');
        if (isPaused) {
          icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
          text.innerText = t('kine_btn_resume');
        } else {
          icon.innerHTML = '<rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/>';
          text.innerText = t('kine_btn_pause');
        }
      });
    }
  }

  bindManagerCallbacks() {
    this.manager.setCallbacks({
      onExerciseChange: (ex, idx, total) => this.updateExercise(ex, idx, total),
      onPhaseChange: (state) => this.updatePhase(state),
      onTick: (state) => this.updateTick(state),
      onRoutineComplete: () => this.updateComplete()
    });
  }

  updateExercise(ex, idx, total) {
    if (!ex) return;
    const titleKey = `ex_${ex.id}_title`;
    const stepsKey = `ex_${ex.id}_steps`;
    const benefitKey = `ex_${ex.id}_benefit`;
    const zoneKey = `kine_zone_${ex.targetArea}`;

    document.getElementById('kineProtocolBadge').innerText = ex.protocol;
    document.getElementById('kineExName').innerText = t(titleKey);
    document.getElementById('kineZoneBadge').innerText = t(zoneKey);
    document.getElementById('kineExSteps').innerText = t(stepsKey);
    document.getElementById('kineExBenefit').innerText = t(benefitKey);
    document.getElementById('kineSvgBox').innerHTML = ex.iconSvg;
    document.getElementById('kineRepCounter').innerText = `${t('kine_rep_label')} 1 / ${ex.reps}`;
  }

  updatePhase(state) {
    const digits = document.getElementById('kineTimerDigits');
    const phaseLabel = document.getElementById('kinePhaseLabel');
    const bubble = document.getElementById('kineBreathBubble');
    const breathText = document.getElementById('kineBreathText');

    digits.innerText = String(state.secondsRemaining).padStart(2, '0');

    if (state.phase === 'prep') {
      phaseLabel.innerText = t('kine_phase_prep');
      digits.style.color = 'var(--fluent-fg-secondary)';
      breathText.innerText = t('kine_breath_in');
      bubble.className = 'kine-breath-bubble breath-in';
    } else if (state.phase === 'hold') {
      phaseLabel.innerText = t('kine_phase_hold');
      digits.style.color = 'var(--status-success)';
      breathText.innerText = t('kine_breath_out');
      bubble.className = 'kine-breath-bubble breath-hold';
    } else if (state.phase === 'rest') {
      phaseLabel.innerText = t('kine_phase_rest');
      digits.style.color = 'var(--fluent-fg-secondary)';
      breathText.innerText = t('kine_breath_in');
      bubble.className = 'kine-breath-bubble breath-in';
    }

    document.getElementById('kineRepCounter').innerText = `${t('kine_rep_label')} ${state.rep} / ${state.totalReps}`;
  }

  updateTick(state) {
    const digits = document.getElementById('kineTimerDigits');
    if (digits) {
      digits.innerText = String(state.secondsRemaining).padStart(2, '0');
    }
  }

  updateComplete() {
    const phaseLabel = document.getElementById('kinePhaseLabel');
    const breathText = document.getElementById('kineBreathText');
    const digits = document.getElementById('kineTimerDigits');
    if (phaseLabel) phaseLabel.innerText = t('kine_phase_done');
    if (breathText) breathText.innerText = "✨ " + t('kine_phase_done');
    if (digits) {
      digits.innerText = "✓";
      digits.style.color = 'var(--status-success)';
    }
  }

  show() {
    if (this.container) this.container.style.display = 'block';
  }

  hide() {
    if (this.container) this.container.style.display = 'none';
  }
}
