
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { meloloApi, getImageUrl } from '../services/api';
import { StreamResponse, Drama } from '../types';
import { VideoPlayer } from '../components/VideoPlayer';
import { Loader2, AlertTriangle, List, Star } from 'lucide-react';

export const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [streamData, setStreamData] = useState<StreamResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Drama[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const stream = await meloloApi.getStream(id);
        
        // HANDLING ERROR NYATA DARI API
        if (stream.code === 101000) {
          setError("LIMIT API: Server sedang sangat sibuk. Mohon tunggu beberapa saat atau ganti episode.");
        } else if (!stream.data?.video_url) {
          setError("LINK MATI: Video ini tidak ditemukan di server pusat.");
        }
        
        setStreamData(stream);
        const recs = await meloloApi.getTrending();
        setRecommendations(recs.books.slice(0, 6));
      } catch (err) {
        setError("KONEKSI GAGAL: Tidak dapat menghubungi server streaming.");
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="h-screen flex flex-col items-center justify-center space-y-6"><Loader2 className="w-16 h-16 text-primary animate-spin" /><p className="font-black tracking-widest uppercase">Mempersiapkan Player...</p></div>;

  const videoUrl = streamData?.data?.video_url || '';
  const servers = videoUrl ? [{ name: 'Primary Server (Auto)', url: videoUrl, quality: 'HD' }] : [];

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-8">
          <VideoPlayer servers={servers} error={error} />
          <div className="bg-surface p-8 rounded-3xl border border-white/5 space-y-4">
             <h1 className="text-3xl font-black">Sekarang Memutar</h1>
             {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 font-bold"><AlertTriangle /> {error}</div>}
          </div>
        </div>
        <div className="space-y-8">
          <h3 className="text-xl font-black flex items-center gap-3"><List className="text-primary" /> Rekomendasi</h3>
          <div className="space-y-6">
            {recommendations.map(d => (
              <a key={d.book_id} href={`#/drama/${d.book_id}`} className="flex gap-4 group">
                <div className="w-20 aspect-[2/3] bg-surface rounded-xl overflow-hidden flex-shrink-0">
                   <img src={getImageUrl(d.cover_url)} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div>
                   <h4 className="font-bold text-sm line-clamp-2 group-hover:text-primary">{d.book_name}</h4>
                   <div className="flex items-center gap-2 mt-2 text-xs font-bold text-gray-500"><Star className="w-3 h-3 text-yellow-500 fill-current" /> {d.rating || '8.5'}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
