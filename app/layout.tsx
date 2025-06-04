import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Layout/footer'
import Navbar from '@/components/Layout/navbar'
import { TRPCReactProvider } from '@/lib/trpc/react'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/server/auth'
import { Toaster } from 'sonner'
import { AppSetup } from '@/components/AppSetup' // Import AppSetup

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'LNFoot admin',
  description: 'LNFoot admin platform',
  icons: {
    icon: '/ln.ico'
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang='en'>
      <body className={`${openSans.variable} antialiased`}>
        <TRPCReactProvider>
          <SessionProvider session={session}>
            <AppSetup />
            <Navbar isLoggedIn={!!session} user={session?.user} />
            <Toaster />
            {children}
            <Footer />
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
