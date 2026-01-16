'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import GmailAccountSelector from '@/components/GmailAccountSelector'

export default function Signup() {
  const [isGmailPopupOpen, setIsGmailPopupOpen] = useState(false)

  const handleGoogleClick = () => {
    setIsGmailPopupOpen(true)
  }

  const handleAccountSelect = (email: string) => {
    console.log('Selected account:', email)
    // TODO: Implement Google OAuth authentication with selected account
    // For now, just log the selected email
    // In production, this would trigger the OAuth flow with the selected account
  }

  return (
    <div className={styles.container}>
      {/* Main content container */}
      <div className={styles.mainContainer}>
        {/* Left side content */}
        <div className={styles.leftContent}>
          <h1 className={styles.title}>
            Create your account<br />
            and start tuning in
          </h1>

          <div className={styles.continueSection}>
            <p className={styles.continueText}>Continue with</p>
            <div className={styles.arrowIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.signupButton} onClick={handleGoogleClick}>
              Google
            </button>
            <Link href="/email-signup" className={styles.signupButton}>
              Email
            </Link>
            <button className={styles.signupButton}>
              Phone
            </button>
          </div>
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
              <path d="M18 6L6 18M6 6L18 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Gmail Account Selector Popup */}
      <GmailAccountSelector
        isOpen={isGmailPopupOpen}
        onClose={() => setIsGmailPopupOpen(false)}
        onSelectAccount={handleAccountSelect}
      />
    </div>
  )
}

