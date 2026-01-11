'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import Menu from '../components/Menu'

export default function Support() {
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
                    <h1 className={styles.title}>Support</h1>
                </header>

                <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                <main className={styles.content}>
                    <p className={styles.introText}>
                        Need help or want to share feedback?<br />
                        We’d love to hear from you!
                    </p>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Contact Us</h2>
                        <p className={styles.sectionText}>
                            Email: support@moodtune.com<br />
                            Feedback Form: Available in Settings → “Share Your Feelings”<br />
                            Website: <a href="http://www.moodtune.com" className={styles.link}>www.moodtune.com</a>
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Common Support Topics</h2>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Trouble logging in</li>
                            <li className={styles.listItem}>Emotion detection not working</li>
                            <li className={styles.listItem}>Playlist or song recommendations</li>
                            <li className={styles.listItem}>Privacy and permission issues</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Response Time:</h2>
                        <p className={styles.sectionText}>
                            We aim to respond within 24-48 hours during weekdays.
                        </p>
                    </section>
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
