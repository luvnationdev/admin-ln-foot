import DashboardForm from '@/components/dashboard/dashboard-form'
import { auth } from '@/server/auth'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function WebDashboardPage() {
  const session = await auth();
  console.log(session);
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main className='min-h-screen bg-white'>
      {/* Hero Banner with Section Title */}
      <div className='relative w-full h-32'>
        <div className='absolute inset-0'>
          <Image
            src='/stadium-background.jpg'
            alt='Stadium'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40'></div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl px-4 mx-auto my-6">
        {/* Content Tabs */}
        <ContentTabs activeTab={contentTab} onTabChange={setContentTab} />

        {/* Form Title */}
        <h2 className="my-6 text-2xl font-bold text-center">{getFormTitle()}</h2>

      </div>
    </main>
  )
}
