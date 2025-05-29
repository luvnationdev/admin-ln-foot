import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { publicities as PublicitiesTable } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const zAdvertisementSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  referenceUrl: z.string().nullable(),
});
export const advertisementsRouter = createTRPCRouter({
  latest: publicProcedure
    .output(z.array(zAdvertisementSchema))
    .query(async () => {
      const publicities = await db.query.publicities.findMany({
        orderBy: [desc(PublicitiesTable.createdAt)],
        limit: 10,
      });
      return publicities;
    }),
  findOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(zAdvertisementSchema.optional())
    .query(async ({ input }) => {
      const advertisement = await db.query.publicities.findFirst({
        where: eq(PublicitiesTable.id, input.id),
      });
      return advertisement;
    }),
  createAdvertisement: adminProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        referenceUrl: z.string(),
        imageUrl: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const advertisement = await db.insert(PublicitiesTable).values({
        ...input,
      });
      return advertisement;
    }),
  updateAdvertisement: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        referenceUrl: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const advertisement = await db
        .update(PublicitiesTable)
        .set({ ...input })
        .where(eq(PublicitiesTable.id, input.id));
      return advertisement;
    }),
  deleteAdvertisement: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .delete(PublicitiesTable)
        .where(eq(PublicitiesTable.id, input.id));
      return { success: true };
    }),
});
