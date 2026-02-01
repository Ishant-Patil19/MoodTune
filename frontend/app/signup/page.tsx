'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.css'

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    // Handle Google signup callback
    const googleToken = searchParams.get('google_token')
    const error = searchParams.get('error')

    if (googleToken) {
      // Store token and redirect to home
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', googleToken)
        // Redirect to home page
        window.location.href = '/home'
      }
    } else if (error) {
      const details = searchParams.get('details')
      const errorMessage = details 
        ? `Google signup failed: ${error}. Details: ${details}`
        : `Google signup failed: ${error}`
      console.error('Google signup error:', error, details)
      alert(errorMessage)
      // Clean URL
      router.replace('/signup')
    }
  }, [searchParams, router])

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/google/login`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        const errorMessage = errorData.error || `Server error: ${response.status}`
        alert(`Failed to initiate Google signup: ${errorMessage}`)
        setGoogleLoading(false)
        return
      }
      
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to initiate Google signup: No URL received from server')
        setGoogleLoading(false)
      }
    } catch (error) {
      console.error('Google signup error:', error)
      alert(`Failed to initiate Google signup: ${error instanceof Error ? error.message : 'Network error'}`)
      setGoogleLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Main content container */}
      <div className={styles.mainContainer}>
        {/* Left side content */}
        <div className={styles.leftContent}>
          <h1 className={styles.title}>
            Create your account and start tuning in
          </h1>
          
          <div className={styles.continueSection}>
            <p className={styles.continueText}>Continue with</p>
            <div className={styles.arrowIcon}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 9L22.5 18L13.5 27M22.5 18H4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <Link href="/email-signup" className={styles.emailPasswordButton}>
            Email & Password
          </Link>

          {/* Google Signup Button */}
          <button 
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className={styles.googleButton}
            style={{
              opacity: googleLoading ? 0.7 : 1,
              cursor: googleLoading ? 'not-allowed' : 'pointer'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>
        </div>

        {/* Right side image */}
        <div className={styles.rightImage}>
          <Image
            src="/images/signup-background.png"
            alt="Signup background"
            width={796}
            height={1157}
            className={styles.backgroundImage}
            unoptimized
            priority
          />
          {/* Close button on top right of image */}
          <Link href="/" className={styles.closeButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Signup() {
  return (
    <Suspense fallback={<div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>}>
      <SignupContent />
    </Suspense>
  )
}

