import { trpc } from '../trpc/react'

export async function uploadFile(file: File) {
  const objectName = `uploads/${Date.now()}-${file.name}`
  const { mutateAsync: getPresignedUrl } =
    trpc.upload.getPresignedUrl.useMutation()
  console.log({ objectName })

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
  return objectUrl
}
