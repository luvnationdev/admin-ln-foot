import { Button } from '@/components/ui/button'
import {
  useCategoryControllerServiceDeleteApiCategoriesById,
  useCategoryControllerServiceGetApiCategories,
} from '@/lib/api-client/rq-generated/queries/queries'
import type { CategoryDto } from '@/lib/api-client/rq-generated/requests/types.gen'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'

const CategoriesManagement: React.FC = () => {
  const queryClient = useQueryClient()
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useCategoryControllerServiceGetApiCategories<CategoryDto[]>()

  const deleteMutation = useCategoryControllerServiceDeleteApiCategoriesById({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error: unknown) => {
      console.error('Error deleting category:', error)
      if (error instanceof Error) {
        toast.error(`Error deleting category: ${error.message}`)
      } else {
        toast.error('An unexpected error occurred.')
      }
    },
  })

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate({ id: id })
    }
  }

  if (isLoading) {
    return <div>Loading categories...</div>
  }

  if (isError) {
    console.error('Error fetching categories:', error)
    return <div>Error fetching categories.</div>
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {categories?.map((category, idx) => (
        <div
          key={category.id ?? idx}
          className='border rounded-md p-4 shadow-sm bg-white'
        >
          <h2 className='text-lg font-semibold'>{category.name}</h2>
          <Button
            onClick={() => handleDelete(category.id ?? '')}
            className='mt-3 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded'
          >
            Delete
          </Button>
        </div>
      ))}
      {(!categories || categories.length === 0) && !isLoading && (
        <p className='col-span-full text-center text-gray-500'>
          No categories found.
        </p>
      )}
    </div>
  )
}

export default CategoriesManagement
