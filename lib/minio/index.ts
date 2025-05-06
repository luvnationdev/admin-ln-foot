import { Client } from 'minio'
import { env } from 'process'

export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT!,
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY!,
  secretKey: env.MINIO_SECRET_KEY!,
})
