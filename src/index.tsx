import React from 'react';
import { useProgressBarMode } from './useProgressBarMode';

type Props = {
  style?: Record<string, unknown>;
};

export function ProgressBar({ style }: Props) {
  const { mode } = useProgressBarMode();

  if (mode === 'hibernate') {
    return null;
  }

  const width = mode === 'complete' ? 100 : mode === 'init' ? 0 : 80;
  const animationSpeed = mode === 'complete' ? 0.8 : 30;

  return (
    <div
      className="react-axios-progress-bar"
      style={{
        position: 'absolute',
        top: '0',
        zIndex: 9000,
        backgroundColor: '#f0ad4e',
        height: '4px',
        ...style,
        width: `${width}%`,
        transition: `width ${animationSpeed}s ease-in`
      }}
    />
  );
}
