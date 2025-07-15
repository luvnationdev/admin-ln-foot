'use client'

import {
  useHeadingControllerServiceDeleteApiHeadingsById,
  useHeadingControllerServiceGetApiHeadings,
} from '@/lib/api-client/rq-generated/queries'
import { useEffect } from 'react'
import { toast } from 'sonner'

function HeadingSkeleton() {
  return (
    <div className='border rounded-md p-4 shadow-sm bg-white animate-pulse'>
      <div className='w-full h-40 bg-gray-300 rounded-md mb-2'></div>
      <div className='h-6 bg-gray-300 rounded w-3/4'></div>
    </div>
  )
}

export function HeadingsManagement() {
  const {
    data: headings,
    error,
    isLoading,
    refetch,
  } = useHeadingControllerServiceGetApiHeadings(undefined, {
    refetchInterval: 60000,
    select: (apiResponse) => {
      return apiResponse.map((heading) => ({
        id: heading.id,
        title: heading.title ?? '',
        imageUrl: heading.imageUrl ?? '',
      }))
    },
  })

  const { mutate: deleteHeading, isPending: isDeleting } =
    useHeadingControllerServiceDeleteApiHeadingsById()

  const handleDelete = (id: string) => {
    const confirmed = confirm('Voulez-vous vraiment supprimer ce titre ?')
    if (!confirmed) return

    deleteHeading(
      { id },
      {
        onSuccess: () => {
          toast.success('Titre supprimé avec succès')
          void refetch()
        },
        onError: (err) => {
          console.error('Erreur lors de la suppression:', err)
          toast.error('Erreur lors de la suppression du titre')
        },
      }
    )
  }

  useEffect(() => {
    if (error) {
      toast.error('Erreur lors de la récupération des titres')
      console.error('Error fetching headings:', error)
    }
  }, [error])

  if (isLoading) {
    return (
      <div className='grid gap-4 sm:grid-cols-2'>
        <HeadingSkeleton />
        <HeadingSkeleton />
      </div>
    )
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {headings?.map((heading, idx) => (
        <div
          key={heading.id ?? idx}
          className='border rounded-md p-4 shadow-sm bg-white'
        >
          <img
            src={heading.imageUrl}
            alt={heading.title}
            className='w-full h-40 object-cover rounded-md mb-2'
          />
          <h2 className='text-lg font-semibold'>{heading.title}</h2>
          <button
            onClick={() => handleDelete(heading.id!)}
            disabled={isDeleting}
            className='mt-3 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded'
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      ))}
      {(!headings || headings.length === 0) && !isLoading && (
        <p className='col-span-full text-center text-gray-500'>
          Aucun titre trouvé.
        </p>
      )}
    </div>
  )
}
