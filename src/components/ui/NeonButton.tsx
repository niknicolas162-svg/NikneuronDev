import React from 'react';
import { soundEngine } from '../../lib/audio';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'pink' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2.5 px-4 text-xs tracking-wider',
    lg: 'py-3.5 px-6 text-sm tracking-wide',
  };

  const variantClasses = {
    primary:
      'bg-cyan-electric/15 text-cyan-electric border border-cyan-electric/50 hover:bg-cyan-electric/25 hover:border-cyan-electric hover:shadow-cyan-glow-sm',
    pink: 'bg-pink-accent/15 text-pink-accent border border-pink-accent/50 hover:bg-pink-accent/25 hover:border-pink-accent hover:shadow-pink-glow-sm',
    ghost:
      'bg-transparent text-text-secondary hover:text-white hover:bg-white/5 border border-transparent',
    outline:
      'bg-void-surface/50 text-text-primary border border-white/15 hover:border-cyan-electric/40 hover:bg-void-hover',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundEngine.playClick();
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => soundEngine.playTone(600, 0.03, 'sine', 0.02)}
      className={`relative inline-flex items-center justify-center gap-2 font-display font-semibold uppercase rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

