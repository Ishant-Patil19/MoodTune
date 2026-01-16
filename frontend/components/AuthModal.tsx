'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './AuthModal.module.css'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const router = useRouter()

    if (!isOpen) return null

    const handleSignup = () => {
        router.push('/signup')
    }

    const handleLogin = () => {
        router.push('/login')
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className={styles.modalBody}>
                    <p className={styles.modalMessage}>
                        Log in to MoodTune for a personalized and enhanced music experience.
                    </p>

                    <div className={styles.buttonContainer}>
                        <button className={styles.authButton} onClick={handleSignup}>
                            Signup
                        </button>
                        <button className={styles.authButton} onClick={handleLogin}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
