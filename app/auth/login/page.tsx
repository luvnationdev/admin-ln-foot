// app/login/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useEffect } from 'react'

export default function LoginPage() {
  useEffect(() => {
    void signIn('keycloak', { redirectTo: '/' })
  }, [])

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-gray-900 px-4 text-white'>
      <div className='text-center'>
        {/* <h1 className='text-6xl font-extrabold tracking-tight sm:text-7xl'>
          302
        </h1> */}
        <p className='mt-4 text-xl sm:text-2xl'>Login Page</p>
        <p className='mt-2 text-base text-gray-300'>
          Veillez patientez! Redirection en cours...
        </p>
      </div>
    </main>
  )
}
