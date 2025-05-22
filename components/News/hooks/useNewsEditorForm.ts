import { useState, useRef } from 'react'
import type React from 'react'
import type { NewsArticle } from '@/types/news'
import { useUploadFile } from '@/lib/minio/upload'
import { trpc } from '@/lib/trpc/react'
import { toast } from 'sonner'
import type { Editor } from '@tiptap/react'

interface UseNewsEditorFormProps {
  article: NewsArticle | null
  editor: Editor | null
  onFormReset?: () => void // Callback for when form is reset (e.g., to reset view state)
}

export function useNewsEditorForm({
  article,
  editor,
  onFormReset,
}: UseNewsEditorFormProps) {
  const [isMajorUpdate, setIsMajorUpdate] = useState(
    article?.isMajorUpdate ?? false
  )
  const [title, setTitle] = useState(article?.title ?? '')
  const [excerpt, setExcerpt] = useState(article?.summary ?? '')
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null)
  const [featuredImage, setFeaturedImage] = useState(article?.imageUrl ?? '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: createNewsArticle, isPending: isSubmitting } =
    trpc.newsArticles.createNewsArticle.useMutation()
  const { mutateAsync: updateNewsArticle, isPending: isUpdating } =
    trpc.newsArticles.updateNewsArticle.useMutation()
  const { uploadFile: uploadFeaturedImageFileAndGetUrl } =
    useUploadFile(featuredImageFile)

  const handleFeaturedImageFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setFeaturedImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setFeaturedImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeFeaturedImage = () => {
    setFeaturedImage('')
    setFeaturedImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const resetForm = () => {
    setTitle('')
    setExcerpt('')
    removeFeaturedImage()
    editor?.commands.clearContent(true)
    if (onFormReset) {
      onFormReset()
    }
  }

  const handleSave = async () => {
    if (isSubmitting || !editor) return

    const submissionToastId = toast.loading('Enregistrement en cours...')

    const content = editor.getHTML()

    try {
      let finalImageUrl = featuredImage // Existing image URL if not changed
      if (featuredImageFile) {
        // If a new file is selected, upload it
        const uploadedUrl = await uploadFeaturedImageFileAndGetUrl()
        if (!uploadedUrl) {
          throw new Error("Échec du téléversement de l'image à la une.")
        }
        finalImageUrl = uploadedUrl
      }

      if (!title || !excerpt || !finalImageUrl || !content || editor.isEmpty) {
        toast.error(
          "Veuillez remplir tous les champs requis, y compris l'image à la une et le contenu.",
          { id: submissionToastId }
        )
        return
      }
      if (article?.id) {
        // If the article already exists, update it
        const data = await updateNewsArticle({
          id: article.id,
          title,
          content,
          isMajorUpdate,
          summary: excerpt,
          imageUrl: finalImageUrl,
          sourceUrl: 'lnfoot-cameroon', // Consider making this dynamic if needed
        })

        toast.success('Article mis à jour avec succès!', {
          id: submissionToastId,
        })
        console.log('Successfully updated article: ', data)
      } else
        await createNewsArticle({
          title,
          imageUrl: finalImageUrl,
          summary: excerpt,
          sourceUrl: 'lnfoot-cameroon', // Consider making this dynamic if needed
          content,
          isMajorUpdate,
        })
      toast.success('Article créé avec succès!', {
        id: submissionToastId,
      })
      resetForm()
    } catch (error) {
      console.error('Save operation error:', error)
      toast.error(
        (error as Error).message || "Impossible de traiter l'article.",
        { id: submissionToastId }
      )
    }
  }

  return {
    title,
    setTitle,
    isMajorUpdate,
    setIsMajorUpdate,
    excerpt,
    setExcerpt,
    featuredImage,
    featuredImageFile,
    handleFeaturedImageFileSelect,
    removeFeaturedImage,
    fileInputRef,
    isSubmitting: isSubmitting || isUpdating,
    handleSave,
    resetForm,
  }
}
