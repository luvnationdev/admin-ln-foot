// lib/api-client/rq-generated/auth-interceptor.ts
import { OpenAPI } from './requests/core/OpenAPI';
import { getSession } from 'next-auth/react';

// This function will be our request interceptor
async function addAuthTokenToRequest(config: RequestInit): Promise<RequestInit> {
  try {
    const session = await getSession(); // Fetches client-side session
    // Ensure you adjust 'accessToken' if your session object nests the token differently
    const accessToken = (session as any)?.accessToken;

    if (accessToken && typeof accessToken === 'string') {
      const headers = new Headers(config.headers);
      headers.set('Authorization', `Bearer ${accessToken}`);
      return { ...config, headers };
    }
  } catch (error) {
    console.error('Error fetching session for API interceptor:', error);
    // Optionally, you could throw the error or handle it in a way that
    // prevents the request if auth is strictly required but session fetch failed.
  }
  return config; // Return original config if no token or if error
}

let isInterceptorRegistered = false;

export function registerAuthInterceptor() {
  if (!isInterceptorRegistered) {
    OpenAPI.interceptors.request.use(addAuthTokenToRequest);
    isInterceptorRegistered = true;
    console.log('Authentication interceptor for API requests has been registered.');
  }
}

// It's also good practice to provide a way to eject the interceptor if needed,
// though not strictly necessary for this primary use case.
export function ejectAuthInterceptor() {
  if (isInterceptorRegistered) {
    OpenAPI.interceptors.request.eject(addAuthTokenToRequest);
    isInterceptorRegistered = false;
    console.log('Authentication interceptor for API requests has been ejected.');
  }
}
