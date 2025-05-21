import { trpc } from '../trpc/react'

export function useUploadFile(file?: File | null) {
  const { mutateAsync: getPresignedUrl } =
    trpc.upload.getPresignedUrl.useMutation()

  return {
    uploadFile: async (f?: File) => {
      file = f ?? file
      if (!file) {
        throw new Error('No file to upload')
      }

      const objectName = `${crypto.randomUUID()}-${file.name.replace(/ /g, '')}`
      const { objectUrl, uploadUrl } = await getPresignedUrl({
        objectName,
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
    },
  }
}
