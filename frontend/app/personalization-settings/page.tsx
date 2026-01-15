'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { authAPI, settingsAPI } from '@/lib/api'
import styles from './page.module.css'

export default function PersonalizationSettings() {
  const { user, refreshUser, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('English')
  const [showThemeDropdown, setShowThemeDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  const themes = ['Light', 'Dark']
  const languages = ['Hindi', 'English', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Global']

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchPreferences()
      fetchProfile()
    }
  }, [user])

  // Refetch profile when page becomes visible (e.g., when returning from edit profile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchProfile()
      }
    }

    const handleFocus = () => {
      if (user) {
        fetchProfile()
      }
    }

    window.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [user])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Check if click is outside both dropdowns
      if (!target.closest(`.${styles.settingValue}`)) {
        setShowThemeDropdown(false)
        setShowLanguageDropdown(false)
      }
    }

    if (showThemeDropdown || showLanguageDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showThemeDropdown, showLanguageDropdown])

  const fetchPreferences = async () => {
    try {
      const prefs = await settingsAPI.getPreferences()
      setTheme(prefs.theme || 'light')
      setLanguage(prefs.language || 'English')
    } catch (error) {
      console.error('Failed to fetch preferences:', error)
    }
  }

  const fetchProfile = async () => {
    try {
      const profileData = await authAPI.getProfile()
      setProfile(profileData)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const handleThemeChange = async (newTheme: string) => {
    const themeValue = newTheme.toLowerCase()
    setTheme(newTheme)
    setShowThemeDropdown(false)
    try {
      await settingsAPI.updatePreferences({ theme: themeValue })
      // Apply theme to document
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', themeValue)
      }
    } catch (error: any) {
      console.error('Failed to update theme:', error)
      alert(error.message || 'Failed to update theme')
      // Revert on error
      const prefs = await settingsAPI.getPreferences()
      setTheme(prefs.theme === 'dark' ? 'Dark' : 'Light')
    }
  }

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage)
    setShowLanguageDropdown(false)
    try {
      await settingsAPI.updatePreferences({ language: newLanguage })
    } catch (error: any) {
      console.error('Failed to update language:', error)
      alert(error.message || 'Failed to update language')
      // Revert on error
      const prefs = await settingsAPI.getPreferences()
      setLanguage(prefs.language || 'English')
    }
  }

  const handlePasswordChange = async () => {
    setPasswordError('')
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      await settingsAPI.changePassword(currentPassword, newPassword)
      alert('Password changed successfully!')
      setShowPasswordModal(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordError('')
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const getDisplayName = () => {
    if (profile?.first_name) return profile.first_name
    if (profile?.username) return profile.username
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }

  const getUsername = () => {
    if (profile?.username) return `@${profile.username}`
    if (user?.email) return `@${user.email.split('@')[0]}`
    return '@user'
  }

  const getProfilePicture = () => {
    if (profile?.profile_picture_url) return profile.profile_picture_url
    return '/images/profile-emily.png'
  }

  const getBio = () => {
    if (profile?.bio) return profile.bio
    return 'No bio yet. Click Edit to add one!'
  }

  if (authLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/home" className={styles.logoContainer}>
            <Image
              src="/images/logo.png"
              alt="MoodTune Logo"
              width={77}
              height={77}
              className={styles.logo}
              unoptimized
              priority
            />
          </Link>
          
          {/* Back to Home Button */}
          <Link href="/home" className={styles.backButton}>
            <span style={{ marginRight: '8px', fontSize: '18px' }}>←</span>
            Back to Home
          </Link>
          
          <div className={styles.searchContainer}>
            <div className={styles.searchBar}>
              <Image
                src="/images/search-icon.png"
                alt="Search"
                width={51}
                height={30}
                className={styles.searchIcon}
                unoptimized
              />
              <span className={styles.searchText}>Search</span>
            </div>
          </div>
          
          <div className={styles.cameraIcon}>
            <Image
              src="/images/camera-icon-home.svg"
              alt="Camera"
              width={58}
              height={53}
              unoptimized
            />
          </div>
          
          <Link href="/personalization-settings" className={styles.settingsIcon}>
            <Image
              src="/images/settings-icon.svg"
              alt="Settings"
              width={65}
              height={65}
              unoptimized
            />
          </Link>
          
          <Link href="/edit-profile" className={styles.profileIcon}>
            <Image
              src={getProfilePicture()}
              alt="Profile"
              width={53}
              height={53}
              className={styles.profileIconImage}
              unoptimized
            />
          </Link>
        </div>
      </header>

      {/* Settings Section */}
      <section className={styles.settingsSection}>
        <div className={styles.settingsContent}>
          <h1 className={styles.settingsTitle}>Settings</h1>
          
          <div className={styles.profileSection}>
            <div className={styles.profileImageContainer}>
              <Image
                src={getProfilePicture()}
                alt={getDisplayName()}
                width={331}
                height={332}
                className={styles.profileImage}
                unoptimized
              />
            </div>
            
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{getDisplayName()}</h2>
              <p className={styles.profileUsername}>{getUsername()}</p>
              <p className={styles.profileBio}>
                {getBio()}
              </p>
            </div>
            
            <Link href="/edit-profile" className={styles.editButton}>
              Edit
            </Link>
          </div>

          {/* Navigation Tabs */}
          <nav className={styles.navTabs}>
            <Link href="/personalization-settings" className={styles.navTabActive}>
              Personalization
            </Link>
            <Link href="/privacy-security-settings" className={styles.navTab}>
              Privacy & Security
            </Link>
            <Link href="/account-integration-settings" className={styles.navTab}>
              Account & Integration
            </Link>
            <Link href="/app-experience-settings" className={styles.navTab}>
              App Experience
            </Link>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.settingsContainer}>
          {/* Theme Card */}
          <div className={`${styles.settingCard} ${showThemeDropdown ? styles.dropdownOpen : ''}`}>
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Theme</span>
              <div 
                className={styles.settingValue}
                style={{ position: 'relative' }}
              >
                <span className={styles.settingText}>{theme}</span>
                <Image
                  src="/images/arrow-dropdown.svg"
                  alt="Dropdown"
                  width={58}
                  height={58}
                  className={styles.dropdownIcon}
                  unoptimized
                  onClick={() => {
                    setShowThemeDropdown(!showThemeDropdown)
                    setShowLanguageDropdown(false)
                  }}
                  style={{ cursor: 'pointer' }}
                />
                {showThemeDropdown && (
                  <div className={styles.dropdownMenu}>
                    {themes.map((t) => (
                      <div
                        key={t}
                        className={styles.dropdownItem}
                        onClick={() => handleThemeChange(t)}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Language Card */}
          <div className={`${styles.settingCard} ${showLanguageDropdown ? styles.dropdownOpen : ''}`}>
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Language</span>
              <div 
                className={styles.settingValue}
                style={{ position: 'relative' }}
              >
                <span className={styles.settingText}>{language}</span>
                <Image
                  src="/images/arrow-dropdown.svg"
                  alt="Dropdown"
                  width={58}
                  height={58}
                  className={styles.dropdownIcon}
                  unoptimized
                  onClick={() => {
                    setShowLanguageDropdown(!showLanguageDropdown)
                    setShowThemeDropdown(false)
                  }}
                  style={{ cursor: 'pointer' }}
                />
                {showLanguageDropdown && (
                  <div className={styles.dropdownMenu}>
                    {languages.map((lang) => (
                      <div
                        key={lang}
                        className={styles.dropdownItem}
                        onClick={() => handleLanguageChange(lang)}
                      >
                        {lang}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className={styles.settingCard}>
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Change Password</span>
              <button 
                className={styles.changeButton}
                onClick={() => setShowPasswordModal(true)}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          Copyright © 2025 MoodTune - Your emotional Uplift. All Rights Reserved.
        </p>
      </footer>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div 
          className={styles.modalOverlay} 
          onClick={() => {
            setShowPasswordModal(false)
            setPasswordError('')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
          }}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton}
              onClick={() => {
                setShowPasswordModal(false)
                setPasswordError('')
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
              }}
            >
              <svg width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="19" cy="20" r="19" fill="rgba(193, 229, 255, 0.5)"/>
                <path d="M14.35 14.35L23.65 23.65M23.65 14.35L14.35 23.65" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <h2 style={{ marginBottom: '1rem', color: '#333' }}>Change Password</h2>

            {passwordError && (
              <div style={{ 
                padding: '0.75rem', 
                background: '#fee', 
                color: '#c33', 
                borderRadius: '5px', 
                marginBottom: '1rem' 
              }}>
                {passwordError}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordError('')
                  setCurrentPassword('')
                  setNewPassword('')
                  setConfirmPassword('')
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
