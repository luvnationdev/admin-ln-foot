import { useState } from 'react'
import { useUploadControllerServicePostApiV1UploadImagePresignedUrl } from '../api-client/rq-generated/queries'

export function useUploadFile(bucket: string, file?: File | null) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<Error>()
  const { mutateAsync: getPresignedUrl } =
    useUploadControllerServicePostApiV1UploadImagePresignedUrl()

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
        const { uploadUrl, finalUrl, formData } = await getPresignedUrl({
          requestBody: {
            fileName: objectName,
            entityType: bucket,
            contentType: file.type,
          },
        })

        console.log({ formData, uploadUrl, finalUrl })

        if (!uploadUrl || !finalUrl) {
          throw new Error('Failed to get presigned URL')
        }

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
        return finalUrl
      } catch (error) {
        setError(error as Error)
        throw error
      } finally {
        setIsUploading(false)
      }
    },
  }
}
