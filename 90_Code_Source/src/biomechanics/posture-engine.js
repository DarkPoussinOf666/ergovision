/**
 * ErgoVision AI - Biomechanical Analysis & Posture Engine
 * C7-C8 cervical forward slump (text-neck), shoulder asymmetry & head lateral tilt.
 */

export const SENSITIVITY_THRESHOLDS = {
  strict: { neckDelta: 0.10, shoulderDiff: 0.04, headTilt: 0.035 },
  standard: { neckDelta: 0.14, shoulderDiff: 0.06, headTilt: 0.05 },
  relaxed: { neckDelta: 0.19, shoulderDiff: 0.09, headTilt: 0.075 }
};

export function computeMetrics(lm) {
  if (!lm || lm.length < 13) return null;
  const nose = lm[0];
  const leftEar = lm[7];
  const rightEar = lm[8];
  const leftShoulder = lm[11];
  const rightShoulder = lm[12];

  const keyLandmarks = [nose, leftEar, rightEar, leftShoulder, rightShoulder];
  const allVisible = keyLandmarks.every(pt => (pt.visibility === undefined || pt.visibility > 0.45));
  if (!allVisible) {
    return null;
  }

  const shoulderWidth = Math.hypot(leftShoulder.x - rightShoulder.x, leftShoulder.y - rightShoulder.y) || 0.001;
  const midShoulderY = (leftShoulder.y + rightShoulder.y) / 2;

  return {
    neckHeightRatio: (midShoulderY - nose.y) / shoulderWidth,
    shoulderDiffRatio: (rightShoulder.y - leftShoulder.y) / shoulderWidth,
    headTiltRatio: Math.abs(leftEar.y - rightEar.y) / shoulderWidth
  };
}

export function evaluatePosture(current, baseline, sensitivity = 'standard') {
  if (!current || !baseline) return null;
  const th = SENSITIVITY_THRESHOLDS[sensitivity] || SENSITIVITY_THRESHOLDS.standard;

  const neckDrop = baseline.neckHeightRatio - current.neckHeightRatio;
  const shoulderDiff = Math.abs(current.shoulderDiffRatio - baseline.shoulderDiffRatio);
  const headTilt = Math.abs(current.headTiltRatio - baseline.headTiltRatio);

  const neckRatio = Math.max(0, neckDrop / th.neckDelta);
  const shoulderRatio = Math.max(0, shoulderDiff / th.shoulderDiff);
  const tiltRatio = Math.max(0, headTilt / th.headTilt);

  const isNeckBad = neckRatio >= 1.0;
  const isShoulderBad = shoulderRatio >= 1.0;
  const isTiltBad = tiltRatio >= 1.0;

  const reasons = [];
  if (isNeckBad) reasons.push('neck');
  if (isShoulderBad) reasons.push('shoulder');
  if (isTiltBad) reasons.push('tilt');

  return {
    isBad: isNeckBad || isShoulderBad || isTiltBad,
    reasons,
    ratios: {
      neckRatio,
      shoulderRatio,
      tiltRatio
    },
    raw: {
      neckDrop,
      shoulderDiff,
      headTilt
    }
  };
}
