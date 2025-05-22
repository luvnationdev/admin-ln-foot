'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { trpc } from '@/lib/trpc/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { type Highlight } from '@/types/highlight'

interface HighlightEditorProps {
  highlight?: Highlight | null
}

export default function HighlightEditor({ highlight }: HighlightEditorProps) {
  const [title, setTitle] = useState(highlight?.title ?? '')
  const [description, setDescription] = useState(highlight?.description ?? '')

  const utils = trpc.useUtils()

  const createHighlightMutation = trpc.highlights.createHighlight.useMutation({
    onSuccess: async () => {
      toast.success('Point fort créé avec succès')
      setTitle('')
      setDescription('')
      await utils.highlights.latest.invalidate()
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création: ${error.message}`)
    },
  })

  const updateHighlightMutation = trpc.highlights.updateHighlight.useMutation({
    onSuccess: async () => {
      toast.success('Point fort mis à jour avec succès')
      await utils.highlights.latest.invalidate()
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`)
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
        title,
        description,
      })
    } else {
       createHighlightMutation.mutate({
          title,
          description,
          videoUrl: "",
          thumbnailUrl: ""
      });
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
