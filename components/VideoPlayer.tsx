
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Maximize, Loader2, AlertCircle, Server, Check
} from 'lucide-react';

interface VideoServer {
  name: string;
  url: string;
  quality: string;
}

interface VideoPlayerProps {
  servers: VideoServer[];
  poster?: string;
  error?: string | null;
}

declare global {
  interface Window {
    Hls: any;
  }
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ servers, poster, error }) => {
  const [currentServerIdx, setCurrentServerIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showServerMenu, setShowServerMenu] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<any>(null);

  const currentServer = servers[currentServerIdx];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentServer?.url) return;

    if (hlsRef.current) hlsRef.current.destroy();

    const videoUrl = currentServer.url;

    // Logika KRUSIAL: Menggunakan HLS.js jika link berakhiran .m3u8
    if (videoUrl.includes('.m3u8') && window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls();
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        setIsBuffering(false);
        // video.play().catch(() => {}); // Optional auto-play
      });
    } else {
      video.src = videoUrl;
      video.load();
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [currentServer?.url]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  if (error || !currentServer?.url) {
    return (
      <div className="aspect-video bg-gray-900 rounded-3xl flex flex-col items-center justify-center text-center p-8 border border-white/10">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-2xl font-black mb-2">Video Gagal Dimuat</h3>
        <p className="text-gray-500 mb-8 max-w-sm">{error || "Server pusat sedang mengalami gangguan."}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-primary rounded-xl font-bold">Refresh Halaman</button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="group relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl cursor-pointer" onClick={togglePlay}>
      <video ref={videoRef} poster={poster} className="w-full h-full" onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)} onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)} onWaiting={() => setIsBuffering(true)} onPlaying={() => setIsBuffering(false)} playsInline />
      
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 inset-x-0 p-6 space-y-4" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={togglePlay} className="text-white">{isPlaying ? <Pause /> : <Play />}</button>
              <span className="text-xs font-bold">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowServerMenu(!showServerMenu)} className="p-2 hover:bg-white/10 rounded-lg"><Server className="w-5 h-5" /></button>
              <Maximize className="w-5 h-5 cursor-pointer" onClick={() => containerRef.current?.requestFullscreen()} />
            </div>
          </div>
        </div>
      </div>

      {showServerMenu && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowServerMenu(false)}>
          <div className="bg-surface border border-white/10 p-6 rounded-3xl w-full max-w-xs space-y-4" onClick={e => e.stopPropagation()}>
            <h4 className="font-black text-xs uppercase text-gray-500">Ganti Server</h4>
            {servers.map((s, i) => (
              <button key={i} onClick={() => { setCurrentServerIdx(i); setShowServerMenu(false); }} className={`w-full flex items-center justify-between p-4 rounded-2xl ${currentServerIdx === i ? 'bg-primary' : 'bg-white/5'}`}>
                <span className="font-bold">{s.name}</span>
                {currentServerIdx === i && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
