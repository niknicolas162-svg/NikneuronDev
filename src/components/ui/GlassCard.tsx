import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tier?: 1 | 2 | 3;
  glowColor?: string;
  className?: string;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  tier = 2,
  glowColor,
  className,
  children,
  style,
  ...props
}) => {
  const tierClass =
    tier === 1
      ? 'glass-surface-tier-1 rounded-2xl'
      : tier === 3
      ? 'glass-surface-tier-3 rounded-xl'
      : 'glass-surface-tier-2 rounded-2xl';

  const customStyle: React.CSSProperties = {
    ...style,
    ...(glowColor && tier === 2
      ? {
          borderColor: `${glowColor}35`,
          boxShadow: `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${glowColor}15`,
        }
      : {}),
  };

  return (
    <div
      className={clsx(tierClass, 'relative overflow-hidden', className)}
      style={customStyle}
      {...props}
    >
      {children}
    </div>
  );
};

