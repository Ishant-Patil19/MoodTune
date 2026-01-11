import type { Metadata } from 'next'
import { Merienda, Konkhmer_Sleokchher } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const merienda = Merienda({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-merienda',
})

const konkhmer = Konkhmer_Sleokchher({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-konkhmer',
})

export const metadata: Metadata = {
  title: 'MoodTune - Home',
  description: 'Discover music that matches your mood',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${merienda.variable} ${konkhmer.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

