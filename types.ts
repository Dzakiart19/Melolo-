
export interface Drama {
  book_id: string;
  book_name: string;
  author: string;
  abstract: string;
  age_gate: string;
  cover_url?: string;
  thumb_url?: string;
  rating?: string;
  episode_count?: number;
  category_schema?: {
    name: string;
  };
  year?: string;
  region?: string;
}

export interface CastMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface User {
  username: string;
  email: string;
  avatar: string;
  joinedDate: string;
  watchedHours: number;
}

export interface VideoData {
  video_id: string;
  episode_title: string;
  episode_number: number;
  duration?: string;
  release_date?: string;
  video_url?: string;
}

export interface DramaDetail extends Drama {
  video_data: VideoData[];
  related_books?: Drama[];
  cast?: CastMember[];
}

export interface SearchResponse {
  code: number;
  data: {
    has_more: boolean;
    books: Drama[];
  };
}

export interface LatestResponse {
  books: Drama[];
}

export interface StreamResponse {
  code: number;
  data?: {
    video_url: string;
    subtitles?: { time: number; text: string }[];
  };
  msg?: string;
}
