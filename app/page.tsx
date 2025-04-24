import { auth } from '@/server/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
      <main className='h-screen bg-gray-100'>
        <div className='max-w-7xl mx-auto p-8'>
          <Link
            href='/dashboard/web'
            className='px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800'
          >
            Voir le tableau de bord (démo)
          </Link>
        </div>
      </main>
  )
}
