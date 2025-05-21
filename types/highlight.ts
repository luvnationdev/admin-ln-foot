export interface Highlight {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  apiSource: string | null;
  matchId: string | null;
  title: string | null;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  publishedAt: Date | null;
  apiHighlightId: string | null;
}