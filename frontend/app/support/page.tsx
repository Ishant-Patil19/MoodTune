'use client'

import { useState } from 'react'
import Link from 'next/link'
import SideMenu from '@/components/SideMenu'
import styles from './page.module.css'

export default function Support() {
    const [menuOpen, setMenuOpen] = useState(false)

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
                <h1 className={styles.title}>Support</h1>

                {/* Introduction */}
                <p className={styles.introText}>
                    Need help or want to share feedback?<br />
                    We'd love to hear from you!
                </p>

                {/* Contact Us Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Contact Us</h2>
                    <p className={styles.sectionText}>
                        <strong>Email:</strong> support@moodtune.com<br />
                        <strong>Feedback Form:</strong> Available in Settings → "Share Your Feelings"<br />
                        <strong>Website:</strong> <a href="http://www.moodtune.com" className={styles.link}>www.moodtune.com</a>
                    </p>
                </div>

                {/* Common Support Topics */}
                <div className={styles.section2}>
                    <h2 className={styles.sectionTitle}>Common Support Topics</h2>
                    <p className={styles.topicsList}>
                        Trouble logging in<br />
                        Emotion detection not working<br />
                        Playlist or song recommendations<br />
                        Privacy and permission issues
                    </p>
                </div>

                {/* Response Time */}
                <div className={styles.section3}>
                    <h2 className={styles.sectionTitle}>Response Time:</h2>
                    <p className={styles.sectionText}>
                        We aim to respond within 24-48 hours during weekdays.
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
