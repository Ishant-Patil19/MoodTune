'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SideMenu from '@/components/SideMenu'
import styles from './page.module.css'

export default function AboutUs() {
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
        <h1 className={styles.title}>About MoodTune</h1>

        {/* Introduction Paragraph */}
        <p className={styles.introText}>
          MoodTune is an emotion-based music recommendation web app designed to understand how you feel and help you find the perfect song for your mood.
          We believe music is more than just sound — it's a reflection of emotions, memories, and connection.
        </p>

        {/* Mission Statement */}
        <p className={styles.missionText}>
          <strong>Our mission is simple:</strong><br />
          "To make people feel understood through the power of music."
        </p>

        {/* What We Do Section */}
        <div className={styles.whatWeDoSection}>
          <h2 className={styles.whatWeDoTitle}>What We Do</h2>
          <ul className={styles.whatWeDoList}>
            <li>Detect emotions using facial expressions (with user permission).</li>
            <li>Curate songs that match or uplift your mood.</li>
            <li>Create a simple, ad-free, and accessible experience for everyone — from music lovers to those who just want comfort through songs.</li>
          </ul>
        </div>

        {/* Our Vision */}
        <p className={styles.visionText}>
          <strong>Our Vision</strong><br />
          To build a platform that connects emotions with melodies — where every mood finds its tune.
        </p>

        {/* Our Team */}
        <p className={styles.teamIntroText}>
          <strong>Our Team</strong><br />
          MoodTune is built by a passionate group of students and creators who believe in using technology to make life a little more musical and meaningful.
        </p>

        {/* Team Members */}
        <div className={styles.teamSection}>
          {/* Vertical Line */}
          <div className={styles.verticalLine}></div>

          <div className={styles.teamMember}>
            <div className={styles.teamMemberCircle}>
              <Image
                src="/images/team-member-1.png"
                alt="Ishant Patil"
                width={157}
                height={155}
                className={styles.teamMemberImage}
                unoptimized
              />
            </div>
            <p className={styles.teamMemberName}>Ishant Patil<br />Developer<br /></p>
          </div>

          <div className={styles.teamMember}>
            <div className={styles.teamMemberCircle}>
              <Image
                src="/images/team-member-2.png"
                alt="Rajshree D"
                width={157}
                height={155}
                className={styles.teamMemberImage}
                unoptimized
              />
            </div>
            <p className={styles.teamMemberNameRight}>Rajshree D<br />BA & Designer<br /></p>
          </div>

          <div className={styles.teamMember}>
            <div className={styles.teamMemberCircle}>
              <Image
                src="/images/team-member-3.png"
                alt="Mukul Raj"
                width={157}
                height={155}
                className={styles.teamMemberImage}
                unoptimized
              />
            </div>
            <p className={styles.teamMemberName}>Mukul Raj<br />Developer<br /></p>
          </div>

          <div className={styles.teamMember}>
            <div className={styles.teamMemberCircle}>
              <Image
                src="/images/team-member-4.png"
                alt="Yagyani Tiwari"
                width={157}
                height={155}
                className={styles.teamMemberImage}
                unoptimized
              />
            </div>
            <p className={styles.teamMemberNameRight}>Yagyani Tiwari<br />Team Lead & Product Owner<br /></p>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.copyright}>
              Copyright © 2025 MoodTune - Your emotional Uplift. All Rights Reserved.
            </p>
            <div className={styles.footerLinks}>
              <Link href="/about-us" className={styles.footerLink}>About Us</Link>
              <Link href="/support" className={styles.footerLink}>Support</Link>
              <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
              <Link href="/terms-conditions" className={styles.footerLink}>Terms & Conditions</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

