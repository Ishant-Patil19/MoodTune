'use client'

import React from 'react'
import Link from 'next/link'
import styles from './page.module.css'

export default function PrivacyPolicy() {
    return (
        <div className={styles.container}>
            <div className={styles.pageCard}>
                <header className={styles.header}>
                    <Link href="/home" className={styles.backToHomeButton}>Back to Home</Link>
                    <h1 className={styles.title}>Privacy Policy</h1>
                </header>

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
            </div>
        </div>
    )
}
