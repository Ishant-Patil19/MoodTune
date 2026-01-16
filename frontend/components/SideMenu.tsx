'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'
import styles from './SideMenu.module.css'

interface SideMenuProps {
    isOpen: boolean
    onClose: () => void
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
    const { isAuthenticated } = useAuth()
    const router = useRouter()
    const [showAuthModal, setShowAuthModal] = useState(false)

    const handleMenuClick = (path: string, requiresAuth: boolean) => {
        if (requiresAuth && !isAuthenticated) {
            // Show login popup for protected routes when user is not authenticated
            setShowAuthModal(true)
        } else {
            // Navigate to the page
            router.push(path)
            onClose()
        }
    }

    const handleAuthModalClose = () => {
        setShowAuthModal(false)
    }

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className={styles.overlay}
                    onClick={onClose}
                />
            )}

            {/* Side Menu */}
            <div className={`${styles.sideMenu} ${isOpen ? styles.open : ''}`}>
                {/* Close Button */}
                <button className={styles.closeButton} onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Menu Items */}
                <nav className={styles.menuNav}>
                    {/* Home - redirects based on auth state */}
                    <button
                        className={styles.menuItem}
                        onClick={() => handleMenuClick(isAuthenticated ? '/home' : '/', false)}
                    >
                        <span className={styles.menuText}>Home</span>
                    </button>

                    {/* Profile - requires auth */}
                    <button
                        className={styles.menuItem}
                        onClick={() => handleMenuClick('/edit-profile', true)}
                    >
                        <span className={styles.menuText}>Profile</span>
                    </button>

                    {/* Library - requires auth */}
                    <button
                        className={styles.menuItem}
                        onClick={() => handleMenuClick('/library', true)}
                    >
                        <span className={styles.menuText}>Library</span>
                    </button>

                    {/* Settings - requires auth */}
                    <button
                        className={styles.menuItem}
                        onClick={() => handleMenuClick('/settings', true)}
                    >
                        <span className={styles.menuText}>Settings</span>
                    </button>

                    {/* Camera - requires auth */}
                    <button
                        className={styles.menuItem}
                        onClick={() => handleMenuClick('/camera', true)}
                    >
                        <span className={styles.menuText}>Camera</span>
                    </button>
                </nav>
            </div>

            {/* Auth Modal */}
            <AuthModal isOpen={showAuthModal} onClose={handleAuthModalClose} />
        </>
    )
}
