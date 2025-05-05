

export interface NewsArticle {
    id: number
    title: string
    content: string
    summary: string
    imageUrl: string
    sourceUrl?: string // Link to the original article
    publishedAt?: string
    apiSource?: string
    apiArticleId?: string
    createdAt: string
    updatedAt: string
}