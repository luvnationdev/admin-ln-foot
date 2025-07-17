import HighlightEditor from '@/components/dashboard/web/highlights/highlight-editor'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { HighlightDto } from '@/lib/api-client/rq-generated/requests'

interface EditHighlightDialogProps {
  highlightToEdit: HighlightDto | null
  setHighlightToEdit: (highlight: HighlightDto | null) => void
}

export default function EditHighlightDialog({
  highlightToEdit,
  setHighlightToEdit,
}: EditHighlightDialogProps) {
  const isOpen = !!highlightToEdit

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setHighlightToEdit(null)}>
      <DialogContent className='max-w-6xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Modifier le point fort</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <HighlightEditor
            highlight={highlightToEdit}
            onMutationSuccess={() => setHighlightToEdit(null)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}