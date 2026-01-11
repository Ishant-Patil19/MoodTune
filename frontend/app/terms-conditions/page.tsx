'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import Menu from '../components/Menu'

export default function TermsConditions() {
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
                    <h1 className={styles.title}>Terms & Conditions</h1>
                </header>

                <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                <main className={styles.content}>
                    <p className={styles.introText}>
                        By accessing or using MoodTune, you agree to the following terms:
                    </p>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>User Responsibility:</h2>
                        <p className={styles.sectionText}>
                            You agree to use MoodTune for personal and non-commercial purposes only.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Data Usage:</h2>
                        <p className={styles.sectionText}>
                            MoodTune uses facial emotion recognition and APIs to recommend songs – all in compliance with
                            privacy standards.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Account Security:</h2>
                        <p className={styles.sectionText}>
                            You are responsible for keeping your login information secure.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Third-Party Services:</h2>
                        <p className={styles.sectionText}>
                            MoodTune integrates Spotify and JioSaavn APIs. By using MoodTune, you also agree to their
                            respective policies.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Intellectual Property:</h2>
                        <p className={styles.sectionText}>
                            All logos, content, and features belong to MoodTune. Copying or redistribution without consent is
                            prohibited.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Updates:</h2>
                        <p className={styles.sectionText}>
                            We may update these terms occasionally. Continued use after changes means you accept the revised
                            terms.
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
