'use client'

import HighlightTableRow from '@/components/dashboard/web/highlights/highlight-table-row'
import DeleteHighlightDialog from '@/components/dashboard/web/highlights/subcomponents/delete-highlight-dialog'
import EditHighlightDialog from '@/components/dashboard/web/highlights/subcomponents/edit-highlight-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useHighlightControllerServiceDeleteApiV1HighlightsById,
  useHighlightControllerServiceGetApiV1Highlights,
} from '@/lib/api-client/rq-generated/queries'
import * as CommonQueryKeys from '@/lib/api-client/rq-generated/queries/common'; // For query key functions
import type {
  HighlightDto,
  Pageable,
} from '@/lib/api-client/rq-generated/requests'
import { useQueryClient } from '@tanstack/react-query'
import { Calendar, FileText, Star } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function HighlightsManagement() {
  const defaultPageable: Pageable = {
    page: 0,
    size: 20,
    sort: ['createdAt,desc'],
  }

  const { data: highlights, isLoading } =
    useHighlightControllerServiceGetApiV1Highlights({
      pageable: defaultPageable,
    })
  const [highlightToDelete, setHighlightToDelete] =
    useState<HighlightDto | null>(null)
  const [highlightToEdit, setHighlightToEdit] = useState<HighlightDto | null>(
    null
  )
  const queryClient = useQueryClient()
  const deleteHighlightMutation =
    useHighlightControllerServiceDeleteApiV1HighlightsById({
      onSuccess: () => {
        setHighlightToDelete(null)
        // Invalidate the query using the key function
        void queryClient.invalidateQueries({
          queryKey:
            CommonQueryKeys.UseHighlightControllerServiceGetApiV1HighlightsKeyFn(
              {
                pageable: defaultPageable,
              }
            ),
        })
      },
      onError: (error) => {
        toast.error(
          `Erreur lors de la suppression: ${error instanceof Error ? error.message : "Une erreur inconnue s'est produite"}`
        )
      },
    })
  if (isLoading) {
    return (
      <div className='w-full p-12 flex flex-col items-center justify-center space-y-4'>
        <div className='animate-spin h-12 w-12 border-4 border-green-500 rounded-full border-t-transparent'></div>
        <p className='text-gray-500 text-sm'>Chargement des points forts...</p>
      </div>
    )
  }

  return (
    <div className='w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg'>
      {/* Header moderne avec gradient */}
      <div className='p-6 bg-gradient-to-r from-green-600 to-green-700 text-white'>
        <div className='flex items-center space-x-3'>
          <div className='p-2 bg-white/20 rounded-lg'>
            <Star className='h-6 w-6' />
          </div>
          <div>
            <h2 className='text-2xl font-bold'>Points Forts</h2>
            <p className='text-green-100 text-sm'>
              Gérez vos points forts et avantages
            </p>
          </div>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-50/80 border-b border-gray-200'>
              <TableHead className='w-[350px] font-semibold text-gray-700 py-4'>
                <div className='flex items-center space-x-2'>
                  <FileText className='h-4 w-4' />
                  <span>Titre</span>
                </div>
              </TableHead>
              <TableHead className='font-semibold text-gray-700'>
                Description
              </TableHead>
              <TableHead className='font-semibold text-gray-700'>
                Video Url
              </TableHead>
              <TableHead className='font-semibold text-gray-700'>
                Thumbnail Url
              </TableHead>
              <TableHead className='text-right font-semibold text-gray-700'>
                <div className='flex items-center justify-end space-x-2'>
                  <Calendar className='h-4 w-4' />
                  <span>Date</span>
                </div>
              </TableHead>
              <TableHead className='text-right font-semibold text-gray-700'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {highlights?.content ? (
              highlights?.content.map((highlight) => (
                <HighlightTableRow
                  key={highlight.id}
                  highlight={highlight}
                  setHighlightToEdit={setHighlightToEdit}
                  setHighlightToDelete={setHighlightToDelete}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='text-center py-16'>
                  <div className='flex flex-col items-center space-y-4'>
                    <div className='p-4 bg-gray-100 rounded-full'>
                      <Star className='h-8 w-8 text-gray-400' />
                    </div>
                    <div>
                      <p className='text-gray-500 font-medium'>
                        Aucun point fort disponible
                      </p>
                      <p className='text-gray-400 text-sm'>
                        Commencez par créer votre premier point fort
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DeleteHighlightDialog
        highlightToDelete={highlightToDelete}
        setHighlightToDelete={setHighlightToDelete}
        deleteHighlightMutation={deleteHighlightMutation}
      />
      <EditHighlightDialog
        highlightToEdit={highlightToEdit}
        setHighlightToEdit={setHighlightToEdit}
      />
    </div>
  )
}
