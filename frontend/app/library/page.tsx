'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import SideMenu from '@/components/SideMenu'
import styles from './page.module.css'

export default function Library() {
    const [menuOpen, setMenuOpen] = useState(false)
    const { user } = useAuth()

    return (
        <div className={styles.container}>
            {/* Side Menu */}
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

            {/* Main Content Rectangle */}
            <div className={styles.contentRectangle}>
                {/* Hamburger Menu Icon */}
                <button
                    className={styles.hamburgerMenu}
                    onClick={() => setMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 7.5H26M4 15H26M4 22.5H26" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Title */}
                <h1 className={styles.title}>Library</h1>

                {/* Introduction */}
                <p className={styles.introText}>
                    Your music library - Coming Soon!
                </p>

                <div className={styles.content}>
                    <p className={styles.message}>
                        This page is under development. Here you'll be able to view and manage your saved songs, playlists, and favorite tracks.
                    </p>
                </div>

                {/* Footer */}
                <footer className={styles.footer}>
                    <div className={styles.footerContent}>
                        <p className={styles.copyright}>
                            Copyright © 2025 MoodTune - Your emotional Uplift. All Rights Reserved.
                        </p>
                        <div className={styles.footerLinks}>
                            <Link href="/support" className={styles.footerLink}>Support</Link>
                            <Link href="/about-us" className={styles.footerLink}>About Us</Link>
                            <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
                            <Link href="/terms-conditions" className={styles.footerLink}>Terms & Conditions</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
