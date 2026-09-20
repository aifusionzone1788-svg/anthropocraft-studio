import { useRef } from 'react';
import type { MouseEvent } from 'react';
import { useMotionValue, useSpring, useTransform, MotionValue } from 'motion/react';

export interface TiltOptions {
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  glare?: boolean;
}

/**
 * 60fps Spring-Damped 3D Parallax Tilt Hook
 * Computes realistic 3D perspective rotation and dynamic specular light reflections
 * on pointer hover without modifying DOM structure or layout.
 */
export function useTiltAnimation(options?: TiltOptions) {
  const maxTilt = options?.maxTilt ?? 7;
  const scale = options?.scale ?? 1.025;
  const perspective = options?.perspective ?? 1000;

  const cardRef = useRef<HTMLDivElement | null>(null);

  // Normalized cursor coordinates (0 to 1)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Fine-tuned physics: high response, zero jitter, organic organic easing
  const springConfig = { damping: 22, stiffness: 280, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);
  const scaleVal = useSpring(1, springConfig);

  const glareOpacity = useSpring(0, { damping: 25, stiffness: 300 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = (e.clientX - rect.left) / rect.width;
    const clientY = (e.clientY - rect.top) / rect.height;

    x.set(clientX);
    y.set(clientY);
  };

  const handleMouseEnter = () => {
    scaleVal.set(scale);
    glareOpacity.set(0.16);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    scaleVal.set(1);
    glareOpacity.set(0);
  };

  const glareBackground = useTransform(
    [smoothX, smoothY, glareOpacity] as [MotionValue<number>, MotionValue<number>, MotionValue<number>],
    ([gx, gy, op]) =>
      `radial-gradient(circle 360px at ${(gx as number) * 100}% ${(gy as number) * 100}%, rgba(197, 160, 89, ${op as number}), transparent 75%)`
  );

  return {
    cardRef,
    style: {
      rotateX,
      rotateY,
      scale: scaleVal,
      transformStyle: 'preserve-3d' as const,
      perspective,
    },
    glareBackground,
    bind: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}
