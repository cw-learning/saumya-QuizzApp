import clsx from 'clsx';
import type { ProgressBarProps } from './progressBar.types';
import {
  progressContainer,
  progressBaseFill,
  progressColors,
} from './progressBar.styles';

const LOW_THRESHOLD = 40;
const HIGH_THRESHOLD = 70;

export function ProgressBar({ value = 0 }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const colorClass =
    clampedValue >= HIGH_THRESHOLD
      ? progressColors.high
      : clampedValue >= LOW_THRESHOLD
        ? progressColors.medium
        : progressColors.low;

  return (
    <div
      className={progressContainer}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedValue}
    >
      <div
        className={clsx(progressBaseFill, colorClass)}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
