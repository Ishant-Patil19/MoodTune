'use client'

import React from 'react'
import Link from 'next/link'
import styles from './page.module.css'

export default function Support() {
    return (
        <div className={styles.container}>
            <div className={styles.pageCard}>
                <header className={styles.header}>
                    <Link href="/home" className={styles.backToHomeButton}>Back to Home</Link>
                    <h1 className={styles.title}>Support</h1>
                </header>

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
            </div>
        </div>
    )
}
