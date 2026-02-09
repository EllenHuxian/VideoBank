export interface Tag {
  id: string;
  label: string;
}

export interface VideoMetadata {
  id: string;
  thumbnail?: string;
  duration: number; // in seconds
  tags: Tag[];
  category: string;
  description: string;
  earnings: number;
  createdAt: Date;
}

export type AppView = 'DASHBOARD' | 'RECORDER' | 'REVIEW' | 'SUCCESS';

export interface UserStats {
  totalEarnings: number;
  totalVideos: number;
  pendingPayout: number;
}
