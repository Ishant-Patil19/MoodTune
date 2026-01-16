'use client'

import { useState } from 'react'
import Link from 'next/link'
import SideMenu from '@/components/SideMenu'
import styles from './page.module.css'

export default function PrivacyPolicy() {
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
                <h1 className={styles.title}>Privacy Policy</h1>

                {/* Introduction */}
                <p className={styles.introText}>
                    At MoodTune, your privacy is our top priority.
                </p>

                {/* Information We Collect */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Information We Collect</h2>
                    <ul className={styles.bulletList}>
                        <li>Basic details like name and email (when you sign up).</li>
                        <li>Facial data (only analyzed temporarily to detect emotion – never stored or shared).</li>
                        <li>Listening preferences and liked songs (to improve your experience).</li>
                    </ul>
                </div>

                {/* How We Use Your Information */}
                <div className={styles.section2}>
                    <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
                    <ul className={styles.bulletList}>
                        <li>To personalize music recommendations.</li>
                        <li>To provide a seamless user experience.</li>
                        <li>To improve our product through feedback and analytics.</li>
                    </ul>
                </div>

                {/* Data Protection */}
                <div className={styles.section3}>
                    <h2 className={styles.sectionTitle}>Data Protection</h2>
                    <ul className={styles.bulletList}>
                        <li>We do not store your facial recognition data.</li>
                        <li>We never sell, share, or misuse your personal information.</li>
                        <li>Secure authentication is handled through trusted APIs (e.g., Spotify, JioSaavn).</li>
                    </ul>
                </div>

                {/* Your Rights */}
                <div className={styles.section4}>
                    <h2 className={styles.sectionTitle}>Your Rights</h2>
                    <ul className={styles.bulletList}>
                        <li>You can delete your account and data anytime.</li>
                        <li>You can withdraw permission for emotion detection whenever you wish.</li>
                    </ul>
                </div>

                {/* Contact */}
                <div className={styles.contactSection}>
                    <p className={styles.contactText}>
                        If you have any privacy concerns, reach out to us at:<br />
                        <a href="mailto:support@moodtune.com" className={styles.emailLink}>📧 support@moodtune.com</a>
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
