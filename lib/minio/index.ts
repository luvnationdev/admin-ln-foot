import { Client } from 'minio'
import { env } from '@/env'

export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  useSSL: env.NODE_ENV === 'production',
  port: env.NODE_ENV !== 'production' ? 9000 : undefined,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
})
