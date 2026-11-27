import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  radius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: 'core' | 'spiral' | 'dust' | 'twinkle';
  spiralAngle?: number;
  spiralDist?: number;
  vx: number;
  vy: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  decay: number;
}

export const AsmrBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const targetCount = isMobile ? 600 : 1400;

    const particles: Particle[] = [];
    const shootingStars: ShootingStar[] = [];

    // Cursor position for gravity well
    const mouse = { x: -1000, y: -1000, radius: 180 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const initParticles = () => {
      particles.length = 0;
      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < targetCount; i++) {
        const rand = Math.random();
        let layer: Particle['layer'] = 'spiral';
        let color = '#4fd8ff';
        let baseAlpha = 0.4 + Math.random() * 0.4;
        let radius = 0.5 + Math.random() * 1.5;

        let originX = 0;
        let originY = 0;
        let spiralAngle = 0;
        let spiralDist = 0;

        if (rand < 0.25) {
          // Galactic Core
          layer = 'core';
          color = Math.random() > 0.4 ? '#fff8e7' : '#ffb300';
          const r = Math.random() * Math.min(width, height) * 0.18;
          const theta = Math.random() * Math.PI * 2;
          originX = centerX + Math.cos(theta) * r;
          originY = centerY + Math.sin(theta) * r;
          radius = 0.8 + Math.random() * 1.4;
          baseAlpha = 0.6 + Math.random() * 0.4;
        } else if (rand < 0.65) {
          // Spiral Arms
          layer = 'spiral';
          const arms = 2;
          const arm = Math.floor(Math.random() * arms);
          spiralDist = Math.random() * Math.max(width, height) * 0.6;
          spiralAngle = arm * Math.PI + Math.log(spiralDist + 10) * 1.8 + (Math.random() - 0.5) * 0.5;
          originX = centerX + Math.cos(spiralAngle) * spiralDist;
          originY = centerY + Math.sin(spiralAngle) * spiralDist;
          color = Math.random() > 0.7 ? '#ff6b00' : Math.random() > 0.4 ? '#ffb300' : '#e2e8f0';
          baseAlpha = 0.3 + Math.random() * 0.45;
        } else if (rand < 0.8) {
          // Cosmic Dust Lanes
          layer = 'dust';
          color = '#78350f';
          originX = Math.random() * width;
          originY = Math.random() * height;
          radius = 1.2 + Math.random() * 2.0;
          baseAlpha = 0.15;
        } else {
          // Foreground Twinkle Stars
          layer = 'twinkle';
          color = '#ffffff';
          originX = Math.random() * width;
          originY = Math.random() * height;
          radius = 0.6 + Math.random() * 1.8;
          baseAlpha = 0.3 + Math.random() * 0.7;
        }

        particles.push({
          x: originX,
          y: originY,
          originX,
          originY,
          radius,
          color,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: 0.02 + Math.random() * 0.05,
          twinklePhase: Math.random() * Math.PI * 2,
          layer,
          spiralAngle,
          spiralDist,
          vx: 0,
          vy: 0,
        });
      }
    };

    const maybeSpawnShootingStar = () => {
      if (Math.random() < 0.012 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          length: 60 + Math.random() * 90,
          speed: 8 + Math.random() * 12,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.3,
          alpha: 1.0,
          decay: 0.015 + Math.random() * 0.02,
        });
      }
    };

    initParticles();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rotationAngle = 0;

    const render = () => {
      ctx.fillStyle = '#050612';
      ctx.fillRect(0, 0, width, height);

      // Deep void subtle vignette
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.7);
      grad.addColorStop(0, 'rgba(10, 20, 50, 0.25)');
      grad.addColorStop(0.6, 'rgba(5, 6, 18, 0.6)');
      grad.addColorStop(1, '#020308');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        rotationAngle += 0.0008; // Galactic spiral slow orbit
        maybeSpawnShootingStar();
      }

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Orbit update for spiral particles
        if (!prefersReducedMotion && p.layer === 'spiral' && p.spiralAngle !== undefined && p.spiralDist !== undefined) {
          p.spiralAngle += 0.0004;
          p.originX = centerX + Math.cos(p.spiralAngle) * p.spiralDist;
          p.originY = centerY + Math.sin(p.spiralAngle) * p.spiralDist;
        }

        // Mouse gravity well push
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 12;
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
        }

        // Spring back to origin
        p.vx += (p.originX - p.x) * 0.04;
        p.vy += (p.originY - p.y) * 0.04;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        // Twinkle
        if (!prefersReducedMotion) {
          p.twinklePhase += p.twinkleSpeed;
          p.alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.twinklePhase));
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fill();
      }

      // Draw Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.beginPath();
        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const starGrad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        starGrad.addColorStop(0, 'rgba(255, 179, 0, 0)');
        starGrad.addColorStop(1, `rgba(255, 248, 231, ${s.alpha})`);

        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 1.6;
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= s.decay;

        if (s.alpha <= 0 || s.x > width + 100 || s.y > height + 100) {
          shootingStars.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

