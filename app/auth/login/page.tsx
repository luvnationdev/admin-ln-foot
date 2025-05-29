// app/login/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useEffect } from 'react'

export default function LoginPage() {
  useEffect(() => {
    void signIn('keycloak', { redirectTo: '/' })
  }, [])

  return <p>Redirecting to Keycloak...</p>
}
