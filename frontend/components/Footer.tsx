import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.copyright}>
          Copyright © {currentYear} MoodTune. All Rights Reserved.
        </p>
        <nav className={styles.footerNav}>
          <Link href="/support" className={styles.footerLink}>
            Support
          </Link>
          <Link href="/about-us" className={styles.footerLink}>
            About Us
          </Link>
          <Link href="/privacy-policy" className={styles.footerLink}>
            Privacy Policy
          </Link>
          <Link href="/terms-conditions" className={styles.footerLink}>
            Terms & Conditions
          </Link>
        </nav>
      </div>
    </footer>
  )
}
