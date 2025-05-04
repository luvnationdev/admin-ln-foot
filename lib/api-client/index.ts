import { client as apiClient } from './gen/client.gen'
import { auth } from '@/server/auth'

export const createApiClient = async () => {
  const session = await auth()

  // Add request interceptor to add the bearer token
  apiClient.interceptors.request.use(async (config) => {
    if (session?.accessToken) {
      config.headers.set('Authorization', `Bearer ${session.accessToken}`)
    }
    return config
  })

  return apiClient
}
