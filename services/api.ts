
import { LatestResponse, SearchResponse, DramaDetail, StreamResponse } from '../types';

const BASE_URL = 'https://api.sansekai.my.id/api/melolo';

// Fungsi KRUSIAL: Memperbaiki thumbnail yang blank karena path relatif
export const getImageUrl = (url: string | undefined): string => {
  if (!url) return 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=300&h=450&auto=format&fit=crop';
  if (url.startsWith('http')) return url;
  
  // Jika path diawali '/', ini biasanya TMDB image
  if (url.startsWith('/')) {
    return `https://image.tmdb.org/t/p/w500${url}`;
  }
  
  // Fallback ke domain API jika formatnya tidak diketahui
  return `https://api.sansekai.my.id${url.startsWith('/') ? '' : '/'}${url}`;
};

export const meloloApi = {
  getLatest: async (page: number = 1): Promise<LatestResponse> => {
    try {
      // Mengirim parameter page yang nyata ke API
      const res = await fetch(`${BASE_URL}/latest?page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch latest');
      return await res.json();
    } catch (e) {
      console.error("API Error (Latest):", e);
      return { books: [] };
    }
  },

  getTrending: async (page: number = 1): Promise<LatestResponse> => {
    try {
      const res = await fetch(`${BASE_URL}/trending?page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch trending');
      return await res.json();
    } catch (e) {
      console.error("API Error (Trending):", e);
      return { books: [] };
    }
  },

  search: async (query: string, limit: number = 25): Promise<SearchResponse> => {
    try {
      const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      if (!res.ok) throw new Error('Search failed');
      return await res.json();
    } catch (e) {
      console.error("API Error (Search):", e);
      return { code: 500, data: { has_more: false, books: [] } };
    }
  },

  getDetail: async (bookId: string): Promise<DramaDetail> => {
    const res = await fetch(`${BASE_URL}/detail?bookId=${bookId}`);
    if (!res.ok) throw new Error('Failed to fetch detail');
    return await res.json();
  },

  getStream: async (videoId: string): Promise<StreamResponse> => {
    try {
      const res = await fetch(`${BASE_URL}/stream?videoId=${videoId}`);
      if (!res.ok) throw new Error('Failed to fetch stream');
      const data = await res.json();
      return data;
    } catch (e) {
      console.error("API Error (Stream):", e);
      return { code: 500, msg: "Gagal menghubungkan ke server video" };
    }
  }
};
