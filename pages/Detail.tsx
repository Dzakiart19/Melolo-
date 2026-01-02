
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { meloloApi, getImageUrl } from '../services/api';
import { DramaDetail } from '../types';
import { Star, Play, Plus, ArrowLeft, Loader2, Users, Calendar, Globe } from 'lucide-react';

export const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<DramaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await meloloApi.getDetail(id);
        setDetail(data);
        const favorites = JSON.parse(localStorage.getItem('melolo_favorites') || '[]');
        setIsFavorite(favorites.includes(id));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="flex flex-col items-center justify-center py-40 space-y-4"><Loader2 className="w-12 h-12 text-primary animate-spin" /><p className="text-gray-500 font-bold animate-pulse">MEMUAT DATA ASLI...</p></div>;
  if (!detail) return <div className="text-center py-40 font-bold text-xl">Drama tidak ditemukan atau API bermasalah.</div>;

  const poster = getImageUrl(detail.cover_url || detail.thumb_url);

  return (
    <div className="space-y-16 pb-20">
      <section className="relative -mx-6 -mt-32">
        <div className="absolute inset-0 h-[700px] overflow-hidden">
          <img src={poster} className="w-full h-full object-cover blur-3xl opacity-30 scale-125" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
        </div>
        
        <div className="relative pt-40 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full max-w-[300px] mx-auto md:mx-0 flex-shrink-0 shadow-2xl rounded-[2.5rem] overflow-hidden border-8 border-white/5">
            <img src={poster} className="w-full aspect-[2/3] object-cover" alt={detail.book_name} />
          </div>
          
          <div className="flex-1 space-y-8 py-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-[0.3em]"><ArrowLeft className="w-4 h-4" /> Kembali</button>
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">{detail.book_name}</h1>
            
            <div className="flex flex-wrap gap-6 text-sm font-bold items-center text-gray-400">
               <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full"><Star className="w-4 h-4 fill-current" /> {detail.rating || 'N/A'}</div>
               <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {detail.year || '2024'}</div>
               <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> {detail.region || 'Asia'}</div>
               <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] uppercase font-black">Full HD</span>
            </div>

            <div className="flex flex-wrap gap-4">
               {detail.video_data && detail.video_data.length > 0 ? (
                 <Link 
                   to={`/watch/${detail.video_data[0].video_id}`} 
                   className="bg-primary text-white font-black py-5 px-12 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-primary/40 active:scale-95"
                 >
                   <Play className="fill-current w-5 h-5" /> Mulai Menonton
                 </Link>
               ) : (
                 <div className="bg-white/5 text-gray-500 font-bold py-5 px-12 rounded-2xl border border-white/10">Video Tidak Tersedia</div>
               )}
               <button 
                onClick={() => {
                  const favorites = JSON.parse(localStorage.getItem('melolo_favorites') || '[]');
                  if (isFavorite) {
                    const newFavs = favorites.filter((fid: string) => fid !== id);
                    localStorage.setItem('melolo_favorites', JSON.stringify(newFavs));
                  } else {
                    favorites.push(id);
                    localStorage.setItem('melolo_favorites', JSON.stringify(favorites));
                  }
                  setIsFavorite(!isFavorite);
                }}
                className={`p-5 rounded-2xl border-2 transition-all ${isFavorite ? 'bg-white text-dark border-white' : 'border-white/10 hover:bg-white/5'}`}
               >
                 <Plus className={isFavorite ? 'rotate-45' : ''} />
               </button>
            </div>

            <div className="space-y-4 pt-6">
              <h2 className="text-xl font-black uppercase tracking-widest text-primary">Sinopsis</h2>
              <p className="text-gray-400 leading-relaxed text-lg font-medium max-w-3xl">{detail.abstract || "Tidak ada deskripsi tersedia untuk drama ini."}</p>
            </div>
          </div>
        </div>
      </section>

      {detail.video_data && detail.video_data.length > 1 && (
        <section className="container mx-auto px-6 max-w-7xl space-y-8">
           <h3 className="text-2xl font-black">Daftar Episode</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {detail.video_data.map((ep) => (
                <Link 
                  key={ep.video_id} 
                  to={`/watch/${ep.video_id}`}
                  className="bg-surface border border-white/5 p-4 rounded-2xl hover:border-primary transition-all text-center group"
                >
                  <span className="block text-xs font-black text-gray-500 uppercase mb-1">Episode</span>
                  <span className="text-xl font-black group-hover:text-primary">{ep.episode_number}</span>
                </Link>
              ))}
           </div>
        </section>
      )}
    </div>
  );
};
