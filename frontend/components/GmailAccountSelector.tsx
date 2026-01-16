'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './GmailAccountSelector.module.css'

interface GmailAccount {
    email: string
    id: string
    name: string
    picture: string
}

interface GmailAccountSelectorProps {
    isOpen: boolean
    onClose: () => void
    onSelectAccount: (email: string) => void
}

export default function GmailAccountSelector({
    isOpen,
    onClose,
    onSelectAccount
}: GmailAccountSelectorProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Mock Google accounts for local development
    const [accounts] = useState<GmailAccount[]>([
        {
            email: 'john.doe@gmail.com',
            id: '1',
            name: 'John Doe',
            picture: 'https://ui-avatars.com/api/?name=John+Doe&background=3CD4BB&color=fff'
        },
        {
            email: 'jane.smith@gmail.com',
            id: '2',
            name: 'Jane Smith',
            picture: 'https://ui-avatars.com/api/?name=Jane+Smith&background=3CD4BB&color=fff'
        },
        {
            email: 'mike.wilson@gmail.com',
            id: '3',
            name: 'Mike Wilson',
            picture: 'https://ui-avatars.com/api/?name=Mike+Wilson&background=3CD4BB&color=fff'
        },
        {
            email: 'sarah.johnson@gmail.com',
            id: '4',
            name: 'Sarah Johnson',
            picture: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3CD4BB&color=fff'
        },
        {
            email: 'alex.brown@gmail.com',
            id: '5',
            name: 'Alex Brown',
            picture: 'https://ui-avatars.com/api/?name=Alex+Brown&background=3CD4BB&color=fff'
        },
    ])

    // Close popup on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleAccountClick = async (account: GmailAccount) => {
        setIsLoading(true)
        setError(null)

        try {
            // Simulate authentication with backend
            const response = await fetch('http://localhost:5000/auth/google/mock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: account.email,
                    name: account.name,
                    picture: account.picture,
                    google_id: account.id,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                // Store the JWT token and user data
                localStorage.setItem('access_token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))

                // Call the callback
                onSelectAccount(account.email)

                // Show success message briefly
                await new Promise(resolve => setTimeout(resolve, 500))

                // Redirect to home page
                router.push('/home')
                onClose()
            } else {
                setError(data.error || 'Authentication failed')
            }
        } catch (err) {
            console.error('Authentication error:', err)
            setError('Failed to connect to server. Please make sure the backend is running.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose()
        }
    }

    return (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Continue with Gmail</h2>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M13 5L20 12M20 12L13 19M20 12H4"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {isLoading ? (
                    <div className={styles.content}>
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Signing in...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className={styles.content}>
                        <div className={styles.error}>
                            <p>{error}</p>
                            <button onClick={() => setError(null)} className={styles.retryButton}>
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.accountList}>
                        {accounts.map((account) => (
                            <button
                                key={account.id}
                                className={styles.accountButton}
                                onClick={() => handleAccountClick(account)}
                            >
                                {account.email}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
