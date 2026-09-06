import React from 'react';
import { motion } from 'motion/react';

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  id?: string;
  viewportMargin?: string;
  once?: boolean;
}

/**
 * Smooth GPU-accelerated scroll-triggered fade-up wrapper
 */
export const FadeUp: React.FC<FadeUpProps> = ({
  children,
  delay = 0,
  duration = 0.55,
  yOffset = 24,
  className = '',
  id,
  viewportMargin = '-40px',
  once = true,
}) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: viewportMargin }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Luxurious smooth cubic-bezier
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface HeadingRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
  className?: string;
  delay?: number;
  glow?: boolean;
  startTracking?: string;
  endTracking?: string;
}

/**
 * Page and section heading reveal with crisp letter-spacing transition and subtle ambient gold glow
 */
export const HeadingReveal: React.FC<HeadingRevealProps> = ({
  text,
  as = 'h1',
  className = '',
  delay = 0,
  glow = true,
  startTracking = '0.08em',
  endTracking = '-0.02em',
}) => {
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      initial={{
        opacity: 0,
        y: 18,
        letterSpacing: startTracking,
        textShadow: glow ? '0 0 0px rgba(197, 160, 89, 0)' : 'none',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        letterSpacing: endTracking,
        textShadow: glow ? '0 0 20px rgba(197, 160, 89, 0.22)' : 'none',
      }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`will-change-transform inline-block ${className}`}
    >
      {text}
    </Component>
  );
};

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

/**
 * Container that orchestrates staggered child animations
 */
export const StaggerGroup: React.FC<StaggerGroupProps> = ({
  children,
  className = '',
  staggerDelay = 0.08,
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
