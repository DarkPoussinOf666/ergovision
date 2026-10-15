/**
 * ErgoVision AI - Biomechanical Analysis & Posture Engine
 * C7-C8 cervical forward slump (text-neck), shoulder asymmetry & head lateral tilt.
 */

export const SENSITIVITY_THRESHOLDS = {
  strict: { neckDelta: 0.10, shoulderDiff: 0.04, headTilt: 0.035, screenProximityDelta: 0.18 },
  standard: { neckDelta: 0.14, shoulderDiff: 0.06, headTilt: 0.05, screenProximityDelta: 0.25 },
  relaxed: { neckDelta: 0.19, shoulderDiff: 0.09, headTilt: 0.075, screenProximityDelta: 0.35 }
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
  const faceWidth = Math.hypot(leftEar.x - rightEar.x, leftEar.y - rightEar.y) || 0.001;
  const midShoulderY = (leftShoulder.y + rightShoulder.y) / 2;

  return {
    neckHeightRatio: (midShoulderY - nose.y) / shoulderWidth,
    shoulderDiffRatio: (rightShoulder.y - leftShoulder.y) / shoulderWidth,
    headTiltRatio: Math.abs(leftEar.y - rightEar.y) / shoulderWidth,
    faceWidth,
    shoulderWidth
  };
}

export function evaluatePosture(current, baseline, sensitivity = 'standard') {
  if (!current || !baseline) return null;
  const th = SENSITIVITY_THRESHOLDS[sensitivity] || SENSITIVITY_THRESHOLDS.standard;

  const neckDrop = baseline.neckHeightRatio - current.neckHeightRatio;
  const shoulderDiff = Math.abs(current.shoulderDiffRatio - baseline.shoulderDiffRatio);
  const headTilt = Math.abs(current.headTiltRatio - baseline.headTiltRatio);
  const proximityIncrease = baseline.faceWidth > 0 ? (current.faceWidth - baseline.faceWidth) / baseline.faceWidth : 0;

  const neckRatio = Math.max(0, neckDrop / th.neckDelta);
  const shoulderRatio = Math.max(0, shoulderDiff / th.shoulderDiff);
  const tiltRatio = Math.max(0, headTilt / th.headTilt);
  const distanceRatio = Math.max(0, proximityIncrease / th.screenProximityDelta);

  const isNeckBad = neckRatio >= 1.0;
  const isShoulderBad = shoulderRatio >= 1.0;
  const isTiltBad = tiltRatio >= 1.0;
  const isDistanceBad = distanceRatio >= 1.0;

  const reasons = [];
  if (isNeckBad) reasons.push('neck');
  if (isShoulderBad) reasons.push('shoulder');
  if (isTiltBad) reasons.push('tilt');
  if (isDistanceBad) reasons.push('distance');

  return {
    isBad: isNeckBad || isShoulderBad || isTiltBad || isDistanceBad,
    reasons,
    ratios: {
      neckRatio,
      shoulderRatio,
      tiltRatio,
      distanceRatio
    },
    raw: {
      neckDrop,
      shoulderDiff,
      headTilt,
      proximityIncrease
    }
  };
}
