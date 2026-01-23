import { memo } from 'react';
import type { ProgressBarProps } from './progressBar.types';
import {
  progressContainer,
  progressBaseFill,
  progressColors,
} from './progressBar.styles';

function ProgressBarComponent({ value = 0 }: ProgressBarProps) {
  let colorClass: string = progressColors.low;

  if (value >= 70) {
    colorClass = progressColors.high;
  } else if (value >= 40) {
    colorClass = progressColors.medium;
  }

  return (
    <div className={progressContainer}>
      <div
        className={`${progressBaseFill} ${colorClass}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export const ProgressBar = memo(ProgressBarComponent);
