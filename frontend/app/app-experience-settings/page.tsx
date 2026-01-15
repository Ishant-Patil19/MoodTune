'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { authAPI, settingsAPI } from '@/lib/api'
import styles from './page.module.css'

export default function AppExperienceSettings() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [addToHome, setAddToHome] = useState(false)
  const [notification, setNotification] = useState(false)
  const [profile, setProfile] = useState<any>(null)

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

  const fetchPreferences = async () => {
    try {
      const prefs = await settingsAPI.getPreferences()
      setAddToHome(prefs.add_to_home_enabled || false)
      setNotification(prefs.notifications_enabled !== false)
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

  const handleAddToHomeChange = async (enabled: boolean) => {
    setAddToHome(enabled)
    try {
      await settingsAPI.updatePreferences({ add_to_home_enabled: enabled })
      if (enabled) {
        // Show instructions for adding to home screen
        alert('To add MoodTune to your home screen:\n\nOn iOS: Tap the Share button and select "Add to Home Screen"\nOn Android: Tap the menu and select "Add to Home Screen"')
      }
    } catch (error: any) {
      console.error('Failed to update add to home:', error)
      alert(error.message || 'Failed to update setting')
      // Revert on error
      const prefs = await settingsAPI.getPreferences()
      setAddToHome(prefs.add_to_home_enabled || false)
    }
  }

  const handleNotificationChange = async (enabled: boolean) => {
    setNotification(enabled)
    try {
      await settingsAPI.updatePreferences({ notifications_enabled: enabled })
      if (enabled) {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
          await Notification.requestPermission()
        }
      }
    } catch (error: any) {
      console.error('Failed to update notifications:', error)
      alert(error.message || 'Failed to update setting')
      // Revert on error
      const prefs = await settingsAPI.getPreferences()
      setNotification(prefs.notifications_enabled !== false)
    }
  }

  const handleFeedbackClick = () => {
    window.location.href = 'mailto:support@moodtune.com?subject=Feedback'
  }

  const handleSupportClick = () => {
    window.location.href = 'mailto:support@moodtune.com?subject=Support Request'
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
            <Link href="/personalization-settings" className={styles.navTab}>
              Personalization
            </Link>
            <Link href="/privacy-security-settings" className={styles.navTab}>
              Privacy & Security
            </Link>
            <Link href="/account-integration-settings" className={styles.navTab}>
              Account & Integration
            </Link>
            <Link href="/app-experience-settings" className={styles.navTabActive}>
              App Experience
            </Link>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.settingsContainer}>
          {/* Add to Home Card */}
          <div className={styles.settingCard}>
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Add to Home</span>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={addToHome}
                  onChange={(e) => handleAddToHomeChange(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>

          {/* Notification Card */}
          <div className={styles.settingCard}>
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Notification</span>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={notification}
                  onChange={(e) => handleNotificationChange(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>

          {/* Feedback and Support Card */}
          <div className={styles.settingCard} style={{ cursor: 'pointer' }}>
            <div className={styles.settingItem}>
              <span 
                className={styles.settingLabel}
                onClick={handleFeedbackClick}
                style={{ cursor: 'pointer' }}
              >
                Feedback
              </span>
              <span 
                className={styles.settingLabelRight}
                onClick={handleSupportClick}
                style={{ cursor: 'pointer' }}
              >
                Support
              </span>
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
    </div>
  )
}

