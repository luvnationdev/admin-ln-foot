import { useState } from 'react'
import { trpc } from '../trpc/react'

export function useUploadFile(bucket: string, file?: File | null) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<Error>()
  const { mutateAsync: getPresignedUrl } =
    trpc.upload.getPresignedUrl.useMutation()

  return {
    error,
    isUploading,
    uploadFile: async (f?: File) => {
      setIsUploading(true)

      try {
        file = f ?? file
        if (!file) {
          throw new Error('No file to upload')
        }
        const objectName = `${crypto.randomUUID()}-${file.name.replace(/ /g, '')}`
        const { objectUrl, uploadUrl } = await getPresignedUrl({
          objectName,
          bucketName: bucket,
        })

        const res = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        })

        if (!res.ok) {
          throw new Error('Upload failed')
        }

        // You can now use this to reference the file
        return `https://${objectUrl}`
      } catch (error) {
        setError(error as Error)
        throw error
      } finally {
        setIsUploading(false)
      }
    },
  }
}
