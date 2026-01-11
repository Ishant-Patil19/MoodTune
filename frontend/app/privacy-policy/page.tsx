'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import Menu from '../components/Menu'

export default function PrivacyPolicy() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className={styles.container}>
            <div className={styles.pageCard}>
                <header className={styles.header}>
                    <div className={styles.hamburger} onClick={() => setIsMenuOpen(true)}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <h1 className={styles.title}>Privacy Policy</h1>
                </header>

                <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                <main className={styles.content}>
                    <p className={styles.introText}>
                        At MoodTune, your privacy is our top priority.
                    </p>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Information We Collect</h2>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Basic details like name and email (when you sign up).</li>
                            <li className={styles.listItem}>Facial data (only analyzed temporarily to detect emotion – never stored or shared).</li>
                            <li className={styles.listItem}>Listening preferences and liked songs (to improve your experience).</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>To personalize music recommendations.</li>
                            <li className={styles.listItem}>To provide a seamless user experience.</li>
                            <li className={styles.listItem}>To improve our product through feedback and analytics.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Data Protection</h2>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>We do not store your facial recognition data.</li>
                            <li className={styles.listItem}>We never sell, share, or misuse your personal information.</li>
                            <li className={styles.listItem}>Secure authentication is handled through trusted APIs (e.g., Spotify, JioSaavn).</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Your Rights</h2>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>You can delete your account and data anytime.</li>
                            <li className={styles.listItem}>You can withdraw permission for emotion detection whenever you wish.</li>
                        </ul>
                    </section>

                    <div className={styles.contactSection}>
                        <p className={styles.contactText}>If you have any privacy concerns, reach out to us at:</p>
                        <a href="mailto:support@moodtune.com" className={styles.contactLink}>
                            ✉️ support@moodtune.com
                        </a>
                    </div>
                </main>

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
