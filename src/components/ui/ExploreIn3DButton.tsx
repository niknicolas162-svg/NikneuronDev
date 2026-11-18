import React from 'react';
import { Box, ArrowRight } from 'lucide-react';
import { soundEngine } from '../../lib/audio';

interface ExploreIn3DButtonProps {
  accentColor?: string;
  onClick: () => void;
  label?: string;
  className?: string;
}

export const ExploreIn3DButton: React.FC<ExploreIn3DButtonProps> = ({
  accentColor = '#4fd8ff',
  onClick,
  label = 'Explore in 3D',
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playSnapHolo();
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => soundEngine.playTone(680, 0.04, 'sine', 0.03)}
      className={`relative group/btn min-h-[42px] py-2 px-3.5 rounded-xl text-[11px] font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 text-white shadow-lg cursor-pointer bg-void-surface/80 hover:scale-[1.02] active:scale-[0.98] ${className}`}
      style={{
        borderColor: `${accentColor}90`,
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: `0 4px 18px -4px ${accentColor}40`,
      }}
    >
      {/* Luminous Shimmer Sweep */}
      <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* 3D Wireframe Box Icon */}
      <Box
        className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:rotate-12 group-hover/btn:scale-110 shrink-0"
        style={{ color: accentColor }}
      />

      <span className="font-display font-semibold text-white tracking-wide">
        {label}
      </span>

      <ArrowRight
        className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1 shrink-0"
        style={{ color: accentColor }}
      />
    </button>
  );
};

