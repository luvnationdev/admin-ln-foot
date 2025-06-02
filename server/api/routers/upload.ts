import { z } from 'zod'
import { minioClient } from '@/lib/minio'
import { adminProcedure, createTRPCRouter } from '@/server/api/trpc'
import { env } from '@/env'
import { getMinioObjectPublicUrl } from '@/lib/utils'

export const uploadRouter = createTRPCRouter({
  getPresignedUrl: adminProcedure
    .input(
      z.object({
        // e.g., 'images/my-file.jpg'
        objectName: z.string(),
        bucketName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { objectName, bucketName } = input

      // Ensure bucket exists
      const exists = await minioClient.bucketExists(bucketName)
      if (!exists) {
        await minioClient.makeBucket(bucketName)

        const publicReadPolicy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: {
                AWS: ['*'], // Represents anonymous users
              },
              Action: ['s3:GetObject'], // Allows reading objects
              Resource: [`arn:aws:s3:::${bucketName}/*`], // Apply to all objects in the bucket
            },
          ],
        }
        await minioClient.setBucketPolicy(
          bucketName,
          JSON.stringify(publicReadPolicy)
        )
      }

      const uploadUrl = await minioClient.presignedPutObject(
        bucketName,
        objectName,
        24 * 3600
      )

      const objectUrl = getMinioObjectPublicUrl(
        env.MINIO_ENDPOINT,
        `${bucketName}/${encodeURIComponent(objectName)}`
      )

      return { uploadUrl, objectUrl }
    }),
})
