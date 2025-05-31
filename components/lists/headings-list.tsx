import { useApiClient } from '@/lib/api-client'
import type { HeadingDto } from '@/lib/api-client/gen'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function HeadingsList() {
  const { headingsApi } = useApiClient()
  const [headings, setHeadings] = useState<HeadingDto[]>([])

  // Fetch headings when the component mounts
  useEffect(() => {
    const fetchHeadings = async () => {
      const { data, error } = await headingsApi.getHeadings()

      if (!data || error) {
        toast.error('Erreur lors de la récupération des titres')
        return
      }

      setHeadings(
        data.map((heading) => ({
          id: heading.id,
          title: heading.title ?? '',
          imageUrl: heading.imageUrl ?? '',
        }))
      )
    }

    fetchHeadings().catch((error) => {
      console.error('Error fetching headings:', error)
      toast.error('Erreur lors de la récupération des titres')
    })
    // Optionally, you can set up a polling mechanism to refresh the headings
    const interval = setInterval(() => {
      fetchHeadings().catch((error) => {
        console.error('Error fetching headings:', error)
        toast.error('Erreur lors de la récupération des titres')
      })
    }, 60000) // Fetch every 60 seconds

    return () => {
      clearInterval(interval)
    }
  }, [headingsApi])

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {headings.map((heading, idx) => (
        <div key={idx} className='border rounded-md p-4 shadow-sm bg-white'>
          <img
            src={heading.imageUrl}
            alt={heading.title}
            className='w-full h-40 object-cover rounded-md mb-2'
          />
          <h2 className='text-lg font-semibold'>{heading.title}</h2>
        </div>
      ))}
    </div>
  )
}
