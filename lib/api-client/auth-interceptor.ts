import { env } from '@/env'
import { OpenAPI } from './rq-generated/requests/core/OpenAPI'
import { getSession, signOut } from 'next-auth/react'

// This function will be our request interceptor
async function addAuthTokenToRequest(
  config: RequestInit
): Promise<RequestInit> {
  try {
    const session = await getSession() // Fetches client-side session
    // Ensure you adjust 'accessToken' if your session object nests the token differently
    const accessToken = session?.accessToken

    if (accessToken && typeof accessToken === 'string') {
      const headers = new Headers(config.headers)
      headers.set('Authorization', `Bearer ${accessToken}`)
      return { ...config, headers }
    }
  } catch (error) {
    console.error('Error fetching session for API interceptor:', error)
  }
  return config // Return original config if no token or if error
}

let isInterceptorRegistered = false

export function registerAuthInterceptor() {
  if (!isInterceptorRegistered) {
    OpenAPI.BASE = env.NEXT_PUBLIC_API_URL
    OpenAPI.interceptors.request.use(addAuthTokenToRequest)
    OpenAPI.interceptors.response.use((res) => {
      if (res.status === 401) {
        void signOut({ redirectTo: '/' })
      }
      return res
    })
    isInterceptorRegistered = true
    console.log(
      'Authentication interceptor for API requests has been registered.'
    )
  }
}

// It's also good practice to provide a way to eject the interceptor if needed,
// though not strictly necessary for this primary use case.
export function ejectAuthInterceptor() {
  if (isInterceptorRegistered) {
    OpenAPI.interceptors.request.eject(addAuthTokenToRequest)
    isInterceptorRegistered = false
    console.log('Authentication interceptor for API requests has been ejected.')
  }
}
