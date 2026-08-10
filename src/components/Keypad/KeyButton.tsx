import React from 'react';
import { playKeyClickSound } from '../../utils/sound';

export type KeyVariant = 
  | 'number' 
  | 'operator' 
  | 'action' 
  | 'equals' 
  | 'function' 
  | 'clear';

interface KeyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
  variant?: KeyVariant;
  onClick?: () => void;
  audioFreq?: number;
  className?: string;
  title?: string;
}

export function KeyButton({
  label,
  variant = 'number',
  onClick,
  audioFreq,
  className = '',
  ...props
}: KeyButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Default sound frequency based on variant
    let freq = audioFreq;
    if (!freq) {
      if (variant === 'number') freq = 600;
      else if (variant === 'operator') freq = 800;
      else if (variant === 'equals') freq = 1000;
      else if (variant === 'clear') freq = 450;
      else freq = 700;
    }
    playKeyClickSound(freq);
    if (onClick) onClick();
  };

  const getVariantStyles = (): string => {
    switch (variant) {
      case 'number':
        return 'bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border-white/10 font-black text-xl sm:text-2xl shadow-xs';
      case 'operator':
        return 'bg-white/10 hover:bg-amber-500/20 hover:text-amber-500 active:bg-amber-500/30 text-white border-white/10 font-black text-xl sm:text-2xl';
      case 'action':
        return 'bg-white/5 hover:bg-white/10 text-white/90 border-white/5 text-xs font-bold uppercase tracking-widest';
      case 'function':
        return 'bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/80 border-white/5 text-xs font-bold uppercase tracking-widest';
      case 'equals':
        return 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black border-amber-400 font-black text-2xl sm:text-4xl shadow-[0_0_30px_rgba(245,158,11,0.3)]';
      case 'clear':
        return 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/30 font-black text-xs sm:text-sm uppercase tracking-widest';
      default:
        return '';
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        h-11 sm:h-12 w-full rounded-xl border flex items-center justify-center font-mono text-sm sm:text-base 
        transition-all duration-150 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50
        active:scale-[0.97] ${getVariantStyles()} ${className}
      `}
      {...props}
    >
      {label}
    </button>
  );
}
