import * as CommonQueryKeys from '@/lib/api-client/rq-generated/queries/common'; // For query key functions
import { useCategoryControllerServicePostApiCategories } from '@/lib/api-client/rq-generated/queries/queries'
import { useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const CategoryForm: React.FC = ({}) => {
  const [name, setName] = useState('')
  const queryClient = useQueryClient()

  const createMutation = useCategoryControllerServicePostApiCategories({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          CommonQueryKeys.UseCategoryControllerServiceGetApiCategoriesKeyFn(),
      })
    },
    onError: (error: unknown) => {
      console.error('Error creating category:', error)
      if (error instanceof Error) {
        toast.error(`Error creating category: ${error.message}`)
      } else {
        toast.error('An unexpected error occurred.')
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      requestBody: { name },
    })
  }

  return (
    <div className='w-full max-w-3xl mx-auto p-6 space-y-8'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col sm:flex-row gap-6 justify-between space-y-6 p-4 rounded-md'
      >
        <div className='flex-1 space-y-4'>
          <div>
            <Label className='block text-sm font-medium mb-1'>Name:</Label>
            <Input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='w-full px-3 py-2 border rounded-md'
            />
          </div>
          <Button
            type='submit'
            className='w-full py-3 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 disabled:opacity-50'
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CategoryForm
