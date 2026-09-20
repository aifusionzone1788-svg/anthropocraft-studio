import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
}

/**
 * Organic Magnetic Micro-Interaction
 * Gently pulls the button towards the user's cursor with smooth spring damping
 * and snaps cleanly back to rest on pointer leave.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 14,
  onClick,
  title,
  type = 'button',
  id,
}) => {
  const ref = useRef<HTMLButtonElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 220, mass: 0.2 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (e.clientX - centerX) / (width / 2);
    const deltaY = (e.clientY - centerY) / (height / 2);

    x.set(deltaX * strength);
    y.set(deltaY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      id={id}
      type={type}
      title={title}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: smoothX,
        y: smoothY,
      }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.98 }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.button>
  );
};
