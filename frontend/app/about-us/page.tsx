'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import Menu from '../components/Menu'

export default function AboutUs() {
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
                    <h1 className={styles.title}>About MoodTune</h1>
                </header>

                <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                <main className={styles.content}>
                    <p className={styles.introText}>
                        MoodTune is an emotion-based music recommendation web app designed to understand how you
                        feel and help you find the perfect song for your mood.
                        <br />
                        We believe music is more than just sound – it's a reflection of emotions, memories, and connection.
                    </p>

                    <section>
                        <h2 className={styles.sectionTitle}>Our mission is simple:</h2>
                        <p className={styles.missionText}>
                            “To make people feel understood through the power of music.”
                        </p>
                    </section>

                    <section>
                        <h2 className={styles.sectionTitle}>What We Do</h2>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Detect emotions using facial expressions (with user permission).</li>
                            <li className={styles.listItem}>Curate songs that match or uplift your mood.</li>
                            <li className={styles.listItem}>Create a simple, ad-free, and accessible experience for everyone – from music lovers to those who just want comfort through songs.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className={styles.sectionTitle}>Our Vision</h2>
                        <p className={styles.visionText}>
                            To build a platform that connects emotions with melodies – where every mood finds its tune.
                        </p>
                    </section>

                    <section>
                        <h2 className={styles.sectionTitle}>Our Team</h2>
                        <p className={styles.teamText}>
                            MoodTune is built by a passionate group of students and creators who believe in using technology
                            to make life a little more musical and meaningful.
                        </p>

                        <div className={styles.teamGrid}>
                            <div className={styles.teamColumn}>
                                {/* Left Column: Ishant, Mukul */}

                                {/* Ishant */}
                                <div className={`${styles.teamMember} ${styles.teamMemberLeft}`}>
                                    <div className={styles.memberImageContainer}>
                                        <Image
                                            src="/images/logo.png"
                                            alt="Ishant"
                                            width={80}
                                            height={80}
                                            className={styles.memberImage}
                                            unoptimized
                                        />
                                    </div>
                                    <div className={styles.memberInfo}>
                                        <span className={styles.memberName}>Ishant Patil</span>
                                        <span className={styles.memberRole}>Developer</span>
                                    </div>
                                </div>

                                {/* Mukul */}
                                <div className={`${styles.teamMember} ${styles.teamMemberLeft}`}>
                                    <div className={styles.memberImageContainer}>
                                        <Image
                                            src="/images/logo.png"
                                            alt="Mukul"
                                            width={80}
                                            height={80}
                                            className={styles.memberImage}
                                            unoptimized
                                        />
                                    </div>
                                    <div className={styles.memberInfo}>
                                        <span className={styles.memberName}>Mukul Raj</span>
                                        <span className={styles.memberRole}>Developer</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.divider}></div>

                            <div className={styles.teamColumn}>
                                {/* Right Column: Rajshree, Yagyani */}

                                {/* Rajshree */}
                                <div className={`${styles.teamMember} ${styles.teamMemberRight}`}>
                                    <div className={styles.memberInfo}>
                                        <span className={styles.memberName}>Rajshree D</span>
                                        <span className={styles.memberRole}>BA & Designer</span>
                                    </div>
                                    <div className={styles.memberImageContainer}>
                                        <Image
                                            src="/images/logo.png"
                                            alt="Rajshree"
                                            width={80}
                                            height={80}
                                            className={styles.memberImage}
                                            unoptimized
                                        />
                                    </div>
                                </div>

                                {/* Yagyani */}
                                <div className={`${styles.teamMember} ${styles.teamMemberRight}`}>
                                    <div className={styles.memberInfo}>
                                        <span className={styles.memberName}>Yagyani Tiwari</span>
                                        <span className={styles.memberRole}>Team Lead & Product Owner</span>
                                    </div>
                                    <div className={styles.memberImageContainer}>
                                        <Image
                                            src="/images/logo.png"
                                            alt="Yagyani"
                                            width={80}
                                            height={80}
                                            className={styles.memberImage}
                                            unoptimized
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                </main>

                <footer className={styles.footer}>
                    <div className={styles.footerContent}>
                        <p className={styles.copyright}>
                            Copyright © 2025 MoodTune. Your emotional Uplift. All Rights Reserved.
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
