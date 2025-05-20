export interface Advertisement {
  id: string;
  title: string | null;
  description: string | null;
  referenceUrl: string | null;
  imageUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
