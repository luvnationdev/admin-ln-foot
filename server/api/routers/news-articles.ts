import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure
} from '@/server/api/trpc'
import { db } from '@/server/db'
import { newsArticles as NewsArticlesTable } from '@/server/db/schema'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'

const zNewsArticleSchema = z.object({
  id: z.string(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  apiSource: z.string().nullable(),
  title: z.string().nullable(),
  publishedAt: z.date().nullable(),
  content: z.string().nullable(),
  summary: z.string().nullable(),
  imageUrl: z.string().nullable(),
  sourceUrl: z.string().nullable(),
  apiArticleId: z.string().nullable(),
  isMajorUpdate: z.boolean().nullable(),
})
export const newsArticleRouter = createTRPCRouter({
  latest: publicProcedure
    .output(z.array(zNewsArticleSchema))
    .query(async () => {
      const news = await db.query.newsArticles.findMany({
        orderBy: [desc(NewsArticlesTable.createdAt)],
      })
      return news
    }),
  findOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(zNewsArticleSchema.optional())
    .query(async ({ input }) => {
      const news = await db.query.newsArticles.findFirst({
        where: eq(NewsArticlesTable.id, input.id),
      })
      return news
    }),
  createNewsArticle: adminProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        summary: z.string().optional(),
        imageUrl: z.string(),
        sourceUrl: z.string(),
        apiSource: z.string().optional(),
        apiNewsId: z.string().optional(),
        isMajorUpdate: z.boolean().default(false).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const news = await db.insert(NewsArticlesTable).values({
        ...input,
      })
      return news
    }),
  updateNewsArticle: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        summary: z.string().optional(),
        imageUrl: z.string().optional(),
        sourceUrl: z.string().optional(),
        apiSource: z.string().optional(),
        apiNewsId: z.string().optional(),
        isMajorUpdate: z.boolean().default(false).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const news = await db
        .update(NewsArticlesTable)
        .set({ ...input })
        .where(eq(NewsArticlesTable.id, input.id))
      return news
    }),
  deleteNewsArticle: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .delete(NewsArticlesTable)
        .where(eq(NewsArticlesTable.id, input.id))
      return { success: true }
    }),
})
