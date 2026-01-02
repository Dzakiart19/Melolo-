
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { meloloApi } from '../services/api';
import { Drama } from '../types';
import { DramaCard } from '../components/DramaCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

export const ListPage: React.FC = () => {
  const { name } = useParams<{ name?: string }>();
  const location = useLocation();
  const [items, setItems] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 24;

  const title = name || (location.pathname.includes('new') ? 'Rilis Terbaru' : location.pathname.includes('trending') ? 'Sedang Trending' : 'Koleksi Saya');

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        let res;
        if (location.pathname.includes('trending')) res = await meloloApi.getTrending();
        else if (location.pathname.includes('new')) res = await meloloApi.getLatest();
        else res = await meloloApi.search(name || 'Drama', page * LIMIT);
        
        const data = res.books || res.data?.books || [];
        setItems(data.slice((page-1)*LIMIT, page*LIMIT));
        setHasMore(data.length > page*LIMIT || (res.data?.has_more));
      } catch (e) { console.error(e); }
      finally { setLoading(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    };
    fetchList();
  }, [name, location.pathname, page]);

  return (
    <div className="container mx-auto px-6 md:px-12 py-40 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Explore List</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{title}</h1>
        </div>
        <div className="flex items-center gap-3 text-gray-500 font-bold uppercase text-xs tracking-widest">
          <LayoutGrid className="w-4 h-4" /> Displaying {items.length} Titles
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12">
        {loading ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />) : 
          items.map(item => <DramaCard key={item.book_id} drama={item} />)
        }
      </div>

      {!loading && items.length > 0 && (
        <div className="flex items-center justify-center gap-6 mt-24">
          <button 
            disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all disabled:opacity-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-lg font-bold text-white tracking-widest">PAGE {page}</span>
          <button 
            disabled={!hasMore} onClick={() => setPage(p => p + 1)}
            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all disabled:opacity-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
