'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  useHighlightControllerServicePostApiV1Highlights,
  useHighlightControllerServicePutApiV1HighlightsById,
} from '@/lib/api-client/rq-generated/queries'
import * as CommonQueryKeys from '@/lib/api-client/rq-generated/queries/common' // For query key functions
import type { HighlightDto } from '@/lib/api-client/rq-generated/requests'
import { DEFAULT_HIGHLIGHTS_PAGINATION } from '@/lib/api-football/constants'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

interface HighlightEditorProps {
  highlight?: HighlightDto | null
  onMutationSuccess: () => void
}

export default function HighlightEditor({
  highlight,
  onMutationSuccess,
}: HighlightEditorProps) {
  const [title, setTitle] = useState(highlight?.title ?? '')
  const [videoUrl, setVideoUrl] = useState(highlight?.videoUrl ?? '')
  const [thumbnailUrl, setThumbnailUrl] = useState(
    highlight?.thumbnailUrl ?? ''
  )
  const [description, setDescription] = useState(highlight?.description ?? '')

  const queryClient = useQueryClient()

  const createHighlightMutation =
    useHighlightControllerServicePostApiV1Highlights({
      onSuccess: () => {
        toast.success('Point fort créé avec succès')
        setTitle('')
        setDescription('')
        void queryClient.invalidateQueries({
          queryKey:
            CommonQueryKeys.UseHighlightControllerServiceGetApiV1HighlightsKeyFn(
              { pageable: DEFAULT_HIGHLIGHTS_PAGINATION }
            ),
        })
        onMutationSuccess()
      },
      onError: (error) => {
        toast.error(
          `Erreur lors de la création: ${error instanceof Error ? error.message : "Une erreur inconnue s'est produite"}`
        )
      },
    })

  const updateHighlightMutation =
    useHighlightControllerServicePutApiV1HighlightsById({
      onSuccess: async () => {
        toast.success('Point fort mis à jour avec succès')
        void queryClient.invalidateQueries({
          queryKey:
            CommonQueryKeys.UseHighlightControllerServiceGetApiV1HighlightsKeyFn(
              { pageable: DEFAULT_HIGHLIGHTS_PAGINATION }
            ),
        })
        onMutationSuccess()
      },
      onError: (error) => {
        toast.error(
          `Erreur lors de la mise à jour: ${error instanceof Error ? error.message : "Une erreur inconnue s'est produite"}`
        )
      },
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    if (highlight?.id) {
      updateHighlightMutation.mutate({
        id: highlight.id,
        requestBody: {
          title,
          description,
          videoUrl,
          thumbnailUrl,
        },
      })
    } else {
      createHighlightMutation.mutate({
        requestBody: {
          title,
          description,
          videoUrl,
          thumbnailUrl,
        },
      })
    }
  }

  return (
    <div className='space-y-4'>
      <Input
        type='text'
        placeholder='Titre'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        type='text'
        placeholder='Video Url'
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <Input
        type='text'
        placeholder='Thumbnail Url'
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
      />

      <Textarea
        placeholder='Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <Button
        type='submit'
        onClick={handleSubmit}
        disabled={
          createHighlightMutation.isPending || updateHighlightMutation.isPending
        }
      >
        {highlight
          ? updateHighlightMutation.isPending
            ? 'Mise à jour...'
            : 'Mettre à jour'
          : createHighlightMutation.isPending
            ? 'Création...'
            : 'Créer'}
      </Button>
    </div>
  )
}
