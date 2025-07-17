import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import type { HighlightDto } from '@/lib/api-client/rq-generated/requests'
import { getYouTubeId } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Pencil, Trash2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

interface HighlightTableRowProps {
  highlight: HighlightDto
  setHighlightToEdit: Dispatch<SetStateAction<HighlightDto | null>>
  setHighlightToDelete: Dispatch<SetStateAction<HighlightDto | null>>
}

export default function HighlightTableRow({
  highlight,
  setHighlightToEdit,
  setHighlightToDelete,
}: HighlightTableRowProps) {
  return (
    <TableRow
      key={highlight.id}
      className='hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100 group'
    >
      <TableCell className='py-4'>
        <div className='space-y-2'>
          <div className='font-semibold text-gray-900 line-clamp-2'>
            {highlight.title}
          </div>
          <Badge
            variant='secondary'
            className='bg-green-100 text-green-700 border-green-200'
          >
            ⭐ Point Fort
          </Badge>
        </div>
      </TableCell>
      <TableCell className='py-4 max-w-[400px]'>
        <p className='text-gray-600 text-sm line-clamp-3 leading-relaxed'>
          {highlight.description ?? 'Aucune description disponible'}
        </p>
      </TableCell>
      <TableCell className='py-4 max-w-[400px]'>
        {highlight.videoUrl ? (
          highlight.videoUrl.includes('youtube.com') ||
          highlight.videoUrl.includes('youtu.be') ? (
            (() => {
              const videoId = getYouTubeId(highlight.videoUrl)
              return videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title='YouTube video preview'
                  className='h-12 w-20 rounded shadow border border-gray-200'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  allowFullScreen
                />
              ) : (
                <span className='text-gray-400 text-xs'>
                  Lien YouTube invalide
                </span>
              )
            })()
          ) : (
            <video
              src={highlight.videoUrl}
              controls
              className='h-12 w-20 object-cover rounded shadow border border-gray-200'
            />
          )
        ) : (
          <span className='text-gray-400 text-xs'>Aucune vidéo</span>
        )}
      </TableCell>
      <TableCell className='py-4 max-w-[400px]'>
        <p className='text-gray-600 text-sm line-clamp-3 leading-relaxed'>
          {highlight.thumbnailUrl ? (
            <img
              src={highlight.thumbnailUrl}
              alt='Aperçu image'
              className='h-12 w-20 object-cover rounded shadow border border-gray-200'
            />
          ) : (
            <span className='text-gray-400 text-xs'>
              Aucune image miniature
            </span>
          )}
        </p>
      </TableCell>
      <TableCell className='text-right py-4'>
        <div className='text-sm text-gray-500'>
          {highlight.createdAt
            ? formatDistanceToNow(new Date(highlight.createdAt), {
                addSuffix: true,
                locale: fr,
              })
            : '-'}
        </div>
      </TableCell>
      <TableCell className='text-right py-4'>
        <div className='flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          <Button
            variant='ghost'
            size='sm'
            className='h-9 w-9 p-0 hover:bg-green-100 hover:text-green-600 transition-colors duration-200'
            onClick={() => setHighlightToEdit(highlight)}
          >
            <Pencil className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='h-9 w-9 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200'
            onClick={() => setHighlightToDelete(highlight)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
