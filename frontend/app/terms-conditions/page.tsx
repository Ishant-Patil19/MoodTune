'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SideMenu from '@/components/SideMenu'
import styles from './page.module.css'

export default function TermsConditions() {
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
                <h1 className={styles.title}>Terms & Conditions</h1>

                {/* Last Updated */}
                <p className={styles.lastUpdated}>Last Updated: January 2025</p>

                {/* Introduction */}
                <p className={styles.introText}>
                    Welcome to MoodTune. By accessing or using our service, you agree to be bound by these Terms and Conditions. Please read them carefully.
                </p>

                {/* Section 1 */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
                    <p className={styles.sectionText}>
                        By creating an account or using MoodTune, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
                    </p>
                </div>

                {/* Section 2 */}
                <div className={styles.section2}>
                    <h2 className={styles.sectionTitle}>2. Use of Service</h2>
                    <p className={styles.sectionText}>
                        <strong>Eligibility:</strong> You must be at least 13 years old to use MoodTune. If you are under 18, you must have parental consent.<br /><br />

                        <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.<br /><br />

                        <strong>Acceptable Use:</strong> You agree not to misuse the service, including but not limited to: attempting to access unauthorized areas, interfering with the service's operation, or using the service for illegal purposes.
                    </p>
                </div>

                {/* Section 3 */}
                <div className={styles.section3}>
                    <h2 className={styles.sectionTitle}>3. Camera and Emotion Detection</h2>
                    <p className={styles.sectionText}>
                        MoodTune's emotion detection feature requires camera access. By granting camera permission, you consent to real-time facial expression analysis. No images or video are stored. You can disable this feature at any time in your settings.
                    </p>
                </div>

                {/* Section 4 */}
                <div className={styles.section4}>
                    <h2 className={styles.sectionTitle}>4. Spotify Integration</h2>
                    <p className={styles.sectionText}>
                        MoodTune integrates with Spotify for music playback. You must have a valid Spotify account to access full playback features. Your use of Spotify is subject to Spotify's Terms of Service.
                    </p>
                </div>

                {/* Section 5 */}
                <div className={styles.section5}>
                    <h2 className={styles.sectionTitle}>5. Intellectual Property</h2>
                    <p className={styles.sectionText}>
                        All content, features, and functionality of MoodTune are owned by MoodTune and are protected by copyright, trademark, and other intellectual property laws. Music content is provided by Spotify and is subject to their licensing agreements.
                    </p>
                </div>

                {/* Section 6 */}
                <div className={styles.section6}>
                    <h2 className={styles.sectionTitle}>6. Limitation of Liability</h2>
                    <p className={styles.sectionText}>
                        MoodTune is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to direct, indirect, incidental, or consequential damages.
                    </p>
                </div>

                {/* Section 7 */}
                <div className={styles.section7}>
                    <h2 className={styles.sectionTitle}>7. Termination</h2>
                    <p className={styles.sectionText}>
                        We reserve the right to suspend or terminate your account at any time for violation of these Terms. You may delete your account at any time through the settings page.
                    </p>
                </div>

                {/* Section 8 */}
                <div className={styles.section8}>
                    <h2 className={styles.sectionTitle}>8. Changes to Terms</h2>
                    <p className={styles.sectionText}>
                        We may update these Terms from time to time. We will notify you of any significant changes. Your continued use of MoodTune after changes are posted constitutes acceptance of the updated Terms.
                    </p>
                </div>

                {/* Section 9 */}
                <div className={styles.section9}>
                    <h2 className={styles.sectionTitle}>9. Contact Information</h2>
                    <p className={styles.sectionText}>
                        If you have any questions about these Terms and Conditions, please contact us at legal@moodtune.com
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
