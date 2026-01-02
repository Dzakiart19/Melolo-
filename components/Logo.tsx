
import React from 'react';
import { Play } from 'lucide-react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className={`
        bg-gradient-to-br from-primary to-secondary 
        ${isLarge ? 'p-3' : isSmall ? 'p-1' : 'p-2'} 
        rounded-full shadow-lg group-hover:scale-110 transition-transform
      `}>
        <Play className={`fill-white text-white ${isLarge ? 'w-8 h-8' : isSmall ? 'w-4 h-4' : 'w-5 h-5'}`} />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`
          font-black tracking-tighter text-white animate-glow
          ${isLarge ? 'text-4xl' : isSmall ? 'text-lg' : 'text-2xl'}
        `}>
          MELOLO
        </span>
        <span className={`
          text-secondary font-bold tracking-widest
          ${isLarge ? 'text-xs' : 'text-[10px]'}
        `}>
          FREE STREAMING
        </span>
      </div>
    </div>
  );
};
