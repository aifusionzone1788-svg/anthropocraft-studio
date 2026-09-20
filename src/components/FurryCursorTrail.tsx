import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
  rotation: number;
  vRot: number;
}

const GOLD_PALETTE = [
  'rgba(197, 160, 89, ',   // Studio Atelier Gold
  'rgba(214, 180, 111, ',  // Bright Champagne Gold
  'rgba(255, 230, 180, ',  // Soft Starlight Amber
  'rgba(245, 245, 245, ',  // Shimmering White
];

export const FurryCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check if user prefers reduced motion or is on mobile touch device
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    let lastX = 0;
    let lastY = 0;
    let hasMoved = false;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (!hasMoved) {
        lastX = x;
        lastY = y;
        hasMoved = true;
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);

      // Emit 1-3 subtle particles only when cursor moves actively
      if (dist > 3) {
        const count = Math.min(Math.floor(dist / 8), 2);
        for (let i = 0; i < count; i++) {
          const colorBase = GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)];
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 0.8 + 0.3;

          particles.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            vx: Math.cos(angle) * speed + (dx * 0.05),
            vy: Math.sin(angle) * speed + (dy * 0.05) - 0.2, // Subtle upward buoyant drift
            size: Math.random() * 2.2 + 1,
            alpha: 0.7,
            color: colorBase,
            decay: Math.random() * 0.025 + 0.02,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.1,
          });
        }
      }

      lastX = x;
      lastY = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.vRot;
        p.size *= 0.98;

        if (p.alpha <= 0.01 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Draw soft 4-point sparkle or soft dot
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s * 1.6);
        ctx.lineTo(s * 0.5, -s * 0.5);
        ctx.lineTo(s * 1.6, 0);
        ctx.lineTo(s * 0.5, s * 0.5);
        ctx.lineTo(0, s * 1.6);
        ctx.lineTo(-s * 0.5, s * 0.5);
        ctx.lineTo(-s * 1.6, 0);
        ctx.lineTo(-s * 0.5, -s * 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full select-none"
    />
  );
};
