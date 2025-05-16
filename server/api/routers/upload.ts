import { z } from "zod";
import { minioClient } from "@/lib/minio";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { env } from "@/env";

export const uploadRouter = createTRPCRouter({
  getPresignedUrl: adminProcedure
    .input(
      z.object({
        // e.g., 'images/my-file.jpg'
        objectName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const bucket = "uploads";
      const { objectName } = input;

      // Ensure bucket exists
      const exists = await minioClient.bucketExists(bucket);
      if (!exists) {
        await minioClient.makeBucket(bucket);
      }

      const uploadUrl = await minioClient.presignedPutObject(
        bucket,
        objectName,
        24 * 3600,
      );
      const objectUrl = `${env.MINIO_ENDPOINT}/${bucket}/${encodeURIComponent(objectName)}`;

      return { uploadUrl, objectUrl };
    }),
});
