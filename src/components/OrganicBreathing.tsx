import React from 'react';
import { motion } from 'motion/react';

interface OrganicBreathingProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  scaleAmount?: number;
  floatY?: number;
  disabled?: boolean;
}

/**
 * Organic Respiration & Micro-Floating Wrapper
 * Gives character portraits and avatars a lifelike breathing cadence
 * using hardware-accelerated transforms without triggering reflows.
 */
export const OrganicBreathing: React.FC<OrganicBreathingProps> = ({
  children,
  className = '',
  duration = 5.2,
  scaleAmount = 1.018,
  floatY = -3.5,
  disabled = false,
}) => {
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        y: [0, floatY, 0],
        scale: [1, scaleAmount, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};
