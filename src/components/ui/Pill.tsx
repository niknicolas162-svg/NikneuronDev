import React from 'react';
import { soundEngine } from '../../lib/audio';

interface PillProps {
  label: string;
  active?: boolean;
  accentColor?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick?: () => void;
  className?: string;
}

export const Pill: React.FC<PillProps> = ({
  label,
  active = false,
  accentColor = '#4fd8ff',
  icon,
  shortcut,
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    if (onClick) {
      soundEngine.playTone(650, 0.05, 'triangle', 0.04);
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => soundEngine.playTone(550, 0.03, 'sine', 0.02)}
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
        active
          ? 'text-white border shadow-sm'
          : 'bg-white/5 text-text-secondary border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/10'
      } ${className}`}
      style={
        active
          ? {
              backgroundColor: `${accentColor}25`,
              borderColor: accentColor,
              boxShadow: `0 0 14px -2px ${accentColor}60`,
              color: '#ffffff',
            }
          : undefined
      }
    >
      {active && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-ping"
          style={{ backgroundColor: accentColor }}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="font-semibold tracking-wider uppercase text-[11px]">{label}</span>
      {shortcut && (
        <span
          className="ml-1 text-[9px] px-1 py-0.2 rounded border"
          style={
            active
              ? { borderColor: `${accentColor}80`, color: accentColor }
              : { borderColor: 'rgba(255,255,255,0.15)', color: '#8ba1c2' }
          }
        >
          {shortcut}
        </span>
      )}
    </button>
  );
};

