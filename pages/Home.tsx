
import React, { useEffect, useState } from 'react';
import { meloloApi, getImageUrl } from '../services/api';
import { Drama } from '../types';
import { DramaCard } from '../components/DramaCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const [data, setData] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHome = async () => {
      setLoading(true);
      try {
        // MENGAMBIL DATA NYATA BERDASARKAN HALAMAN
        const res = await meloloApi.getTrending(page);
        setData(res.books || []);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
      }
    };
    fetchHome();
  }, [page]);

  const featured = data.length > 0 ? data[0] : null;

  return (
    <div className="pb-24">
      {featured && (
        <section className="relative h-[85vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img src={getImageUrl(featured.cover_url)} className="w-full h-full object-cover" alt="hero" />
            <div className="absolute inset-0 hero-gradient" />
          </div>
          <div className="absolute bottom-0 inset-x-0 p-8 md:p-24 space-y-8 max-w-4xl">
            <div className="space-y-4">
              <span className="text-[11px] font-bold text-primary uppercase tracking-[0.4em]">Melolo Featured</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{featured.book_name}</h1>
              <p className="text-gray-300 text-lg line-clamp-2 max-w-2xl">{featured.abstract}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => navigate(`/drama/${featured.book_id}`)} className="bg-white text-black px-8 py-4 rounded-lg font-bold flex items-center gap-3 hover:bg-gray-200">
                <Play className="fill-current" /> Tonton Sekarang
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-6 md:px-12 mt-20 space-y-12">
        <h2 className="text-3xl font-black">Trending Pekan Ini</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {loading ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />) : 
            data.map((item) => <DramaCard key={item.book_id} drama={item} />)
          }
        </div>

        {/* PAGINATION NYATA */}
        <div className="flex items-center justify-center gap-6 pt-20">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary disabled:opacity-20">
            <ChevronLeft />
          </button>
          <span className="font-black">HALAMAN {page}</span>
          <button onClick={() => setPage(p => p + 1)} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary">
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};
