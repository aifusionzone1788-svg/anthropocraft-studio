import React from 'react';

export const StarSparkle: React.FC<{
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'gold' | 'muted' | 'white';
}> = ({ className = '', size = 'sm', variant = 'gold' }) => {
  const sizeMap = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const colorMap = {
    gold: 'bg-[#C5A059]',
    muted: 'bg-zinc-600',
    white: 'bg-[#F5F5F5]',
  };

  return (
    <span
      className={`inline-block star-decor ${sizeMap[size]} ${colorMap[variant]} shrink-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export const SmallStar: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`text-[#C5A059] select-none text-xs font-serif ${className}`}>✦</span>
);

export const CornerCrosshairs: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = '', color = 'border-zinc-800' }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {/* Top Left */}
      <span className={`absolute top-0 left-0 w-2.5 h-2.5 border-t border-l ${color}`} />
      {/* Top Right */}
      <span className={`absolute top-0 right-0 w-2.5 h-2.5 border-t border-r ${color}`} />
      {/* Bottom Left */}
      <span className={`absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l ${color}`} />
      {/* Bottom Right */}
      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r ${color}`} />
    </div>
  );
};

export const HairlineDivider: React.FC<{
  className?: string;
  withStar?: boolean;
  align?: 'center' | 'left' | 'right';
}> = ({ className = '', withStar = false, align = 'center' }) => {
  if (withStar) {
    return (
      <div className={`flex items-center gap-4 my-8 ${className}`}>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <StarSparkle size="xs" variant="gold" />
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`h-[1px] bg-white/10 my-6 ${
        align === 'left'
          ? 'bg-gradient-to-r from-white/15 to-transparent'
          : align === 'right'
          ? 'bg-gradient-to-l from-white/15 to-transparent'
          : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
      } ${className}`}
    />
  );
};

export const EditorialNumber: React.FC<{
  number: string;
  className?: string;
}> = ({ number, className = '' }) => (
  <span
    className={`font-display text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#C5A059] group-hover:text-[#d6b46f] transition-colors duration-300 select-none ${className}`}
  >
    {number}
  </span>
);

