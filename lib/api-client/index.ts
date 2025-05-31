import { useSession } from 'next-auth/react'
import { deleteProductVariant, getHeadings } from './gen'

export * as apiClient from './gen'

export function useApiClient() {
  const { data: session } = useSession()

  return {
    headingsApi: {
      getHeadings: async () => {
        const { data, error } = await getHeadings({
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })

        if (!data || error) {
          return { error }
        }

        return { data: data[200] }
      },
    },
    productsApi: {
      deleteProductVariant: async (id: string) => {
        const { data, error } = await deleteProductVariant({
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
          path: { id },
        })

        if (!data || error) {
          return { error }
        }

        return { data: data[204] }
      },
    },
  }
}
