
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { meloloApi } from '../services/api';
import { Drama } from '../types';
import { DramaCard } from '../components/DramaCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { Search as SearchIcon, Loader2, Frown, ChevronLeft, ChevronRight } from 'lucide-react';

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 25;

  useEffect(() => {
    setPage(1);
    setResults([]);
  }, [query]);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await meloloApi.search(query, LIMIT * page);
        // Emulating pagination results
        const start = (page - 1) * LIMIT;
        const currentData = res.data.books.slice(start, start + LIMIT);
        
        setResults(currentData);
        setHasMore(res.data.has_more || res.data.books.length > (page * LIMIT));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    performSearch();
  }, [query, page]);

  return (
    <div className="space-y-10 container mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-primary font-bold uppercase tracking-widest text-xs">Hasil Pencarian Untuk</p>
          <h1 className="text-4xl font-black text-white">"{query}"</h1>
        </div>
        <div className="flex items-center gap-3 bg-gray-800/50 p-2 px-4 rounded-2xl border border-white/5">
          <span className="text-sm font-bold text-gray-400">Sortir:</span>
          <select className="bg-transparent text-sm font-bold focus:outline-none text-white">
            <option className="bg-dark">Relevansi</option>
            <option className="bg-dark">Terbaru</option>
            <option className="bg-dark">Rating Tertinggi</option>
          </select>
        </div>
      </div>

      {loading && results.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12 animate-in fade-in duration-500">
          {results.map((drama) => (
            <DramaCard key={drama.book_id} drama={drama} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-gray-800/20 rounded-[3rem] p-12 text-center space-y-4">
          <div className="p-6 bg-white/5 rounded-full">
            <Frown className="w-16 h-16 text-gray-600" />
          </div>
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-white">Ups, Drama Tidak Ditemukan</h2>
            <p className="text-gray-400 mt-2">
              Kami tidak dapat menemukan drama dengan kata kunci "{query}". Coba kata kunci lain seperti "Action", "Love", atau nama drama spesifik.
            </p>
          </div>
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="flex items-center justify-center gap-4 pt-12 pb-10">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <span className="text-white font-black px-4">Halaman {page}</span>

          <button 
            disabled={!hasMore}
            onClick={() => setPage(p => p + 1)}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
