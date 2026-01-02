
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { Drama } from '../types';
import { getImageUrl } from '../services/api';

export const DramaCard: React.FC<{ drama: Drama }> = ({ drama }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const rating = drama.rating || (Math.random() * (9.5 - 7.5) + 7.5).toFixed(1);
  const posterUrl = getImageUrl(drama.cover_url || drama.thumb_url);

  return (
    <Link to={`/drama/${drama.book_id}`} className="group relative block w-full">
      <div className="drama-card-hover relative aspect-[2/3] rounded-2xl overflow-hidden bg-surface border border-white/5">
        {/* Shimmer Loading State */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-white/5 to-surface bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] z-10" />
        )}
        
        <img 
          src={posterUrl} 
          alt={drama.book_name} 
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          loading="lazy" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(229,9,20,0.4)] scale-75 group-hover:scale-100 transition-transform duration-500">
            <Play className="w-7 h-7 fill-current ml-1" />
          </div>
        </div>

        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black border border-white/10 flex items-center gap-1.5 z-20">
          <Star className="w-2.5 h-2.5 text-primary fill-current" /> {rating}
        </div>
      </div>
      
      <div className="mt-4 space-y-1.5 px-1">
        <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1 tracking-tight leading-tight">
          {drama.book_name}
        </h3>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
          {drama.category_schema?.name || 'Asian Drama'}
        </p>
      </div>
    </Link>
  );
};
