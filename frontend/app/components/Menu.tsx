'use client'

import React from 'react'
import Link from 'next/link'
import styles from './Menu.module.css'

interface MenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Menu({ isOpen, onClose }: MenuProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.menuContainer}>
                <button onClick={onClose} className={styles.closeButton}>
                    <div className={styles.closeIcon}>×</div>
                </button>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navItem} onClick={onClose}>
                        Home
                    </Link>
                    <Link href="#" className={styles.navItem} onClick={onClose}>
                        Profile
                    </Link>
                    <Link href="#" className={styles.navItem} onClick={onClose}>
                        Library
                    </Link>
                    <Link href="#" className={styles.navItem} onClick={onClose}>
                        Settings
                    </Link>
                    <Link href="#" className={styles.navItem} onClick={onClose}>
                        Camera
                    </Link>
                </nav>
            </div>
        </div>
    )
}
