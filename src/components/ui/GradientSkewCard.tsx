import React, { useRef, useState } from 'react';

export const GradientSkewCard: React.FC<{
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
  onClick?: () => void;
}> = ({ children, accentColor = '#4fd8ff', className = '', onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => setMousePos({ x: -1000, y: -1000 });

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-2xl bg-void-surface/50 border border-white/10 transition-all duration-300 hover:border-cyan-electric/40 hover:shadow-glass ${className}`}
    >
      {/* Radial Glare Follower */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${accentColor}25, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

