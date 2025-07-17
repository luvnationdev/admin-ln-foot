import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { useHighlightControllerServiceDeleteApiV1HighlightsById } from '@/lib/api-client/rq-generated/queries'
import type { HighlightDto } from '@/lib/api-client/rq-generated/requests'

interface DeleteHighlightDialogProps {
  highlightToDelete: HighlightDto | null
  setHighlightToDelete: (highlight: HighlightDto | null) => void
  deleteHighlightMutation: ReturnType<
    typeof useHighlightControllerServiceDeleteApiV1HighlightsById
  >
}

export default function DeleteHighlightDialog({
  highlightToDelete,
  setHighlightToDelete,
  deleteHighlightMutation,
}: DeleteHighlightDialogProps) {
  const isOpen = !!highlightToDelete

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setHighlightToDelete(null)}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-red-600'>
            Supprimer le point fort
          </DialogTitle>
          <DialogDescription className='text-gray-600'>
            Êtes-vous sûr de vouloir supprimer ce point fort ? Cette action est
            irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='mt-6 space-x-2'>
          <Button
            variant='outline'
            onClick={() => setHighlightToDelete(null)}
            className='border-gray-300'
          >
            Annuler
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              if (highlightToDelete?.id) {
                deleteHighlightMutation.mutate({
                  id: highlightToDelete.id,
                })
              }
            }}
            disabled={deleteHighlightMutation.isPending}
            className='bg-red-600 hover:bg-red-700'
          >
            {deleteHighlightMutation.isPending
              ? 'Suppression...'
              : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}