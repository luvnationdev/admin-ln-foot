export interface NewsArticle {
  id: string;
  title: string | null;
  content: string | null;
  summary: string | null;
  imageUrl: string | null;
  sourceUrl: string | null; // Link to the original article
  publishedAt: Date | null;
  apiSource: string | null;
  apiArticleId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
