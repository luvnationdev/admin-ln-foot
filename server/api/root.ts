import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'
import { fixturesRouter } from './routers/fixtures'
import { newsArticleRouter } from './routers/news-articles'
import { ecommerceArticlesRouter } from './routers/ecommerce-articles'
import { highlightRouter } from './routers/highlights'
import { leaguesRouter } from './routers/leagues'
import { advertisementsRouter } from './routers/advertisements'
import { teamRouter } from './routers/teams'
import { syncRouter } from './routers/sync'
import { uploadRouter } from './routers/upload'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  fixtures: fixturesRouter,
  newsArticles: newsArticleRouter,
  ecommerceArticles: ecommerceArticlesRouter,
  highlights: highlightRouter,
  leagues: leaguesRouter,
  advertisements: advertisementsRouter,
  teams: teamRouter,
  sync: syncRouter,
  upload: uploadRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
