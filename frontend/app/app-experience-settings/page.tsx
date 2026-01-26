'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { authAPI, settingsAPI } from '@/lib/api'
import styles from './page.module.css'

export default function AppExperienceSettings() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [addToHome, setAddToHome] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

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
        // Add delay to ensure backend has processed the update
        setTimeout(() => {
          fetchProfile()
        }, 500)
      }
    }

    const handleFocus = () => {
      if (user) {
        // Add delay to ensure backend has processed the update
        setTimeout(() => {
          fetchProfile()
        }, 500)
      }
    }

    window.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [user])

  // Refetch profile when pathname changes (e.g., returning from edit-profile)
  useEffect(() => {
    if (pathname === '/app-experience-settings' && user) {
      // Small delay to ensure navigation is complete
      const timer = setTimeout(() => {
        fetchProfile()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [pathname, user])

  const fetchPreferences = async () => {
    try {
      const prefs = await settingsAPI.getPreferences()
      setAddToHome(prefs.add_to_home_enabled || false)
    } catch (error) {
      console.error('Failed to fetch preferences:', error)
    }
  }

  const fetchProfile = async () => {
    try {
      setProfileLoading(true)
      const profileData = await authAPI.getProfile()
      setProfile(profileData)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setProfileLoading(false)
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

  const handleFeedbackClick = () => {
    window.location.href = 'mailto:support@moodtune.com?subject=Feedback'
  }

  const handleSupportClick = () => {
    window.location.href = 'mailto:support@moodtune.com?subject=Support Request'
  }

  const getDisplayName = () => {
    // Don't show fallback while loading - wait for profile data
    if (profileLoading) return undefined
    if (profile?.first_name) return profile.first_name
    if (profile?.username) return profile.username
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }

  const getUsername = () => {
    // Don't show fallback while loading - wait for profile data
    if (profileLoading) return undefined
    if (profile?.username) return `@${profile.username}`
    if (user?.email) return `@${user.email.split('@')[0]}`
    return '@user'
  }

  const getProfilePicture = () => {
    // Don't show fallback while loading - wait for profile data
    if (profileLoading) return undefined
    if (profile?.profile_picture_url) return profile.profile_picture_url
    // No static fallback - return null or empty string when Spotify is linked
    if (user?.spotifyLinked) {
      return null
    }
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
            {getProfilePicture() ? (
              <Image
                src={getProfilePicture()}
                alt="Profile"
                width={53}
                height={53}
                className={styles.profileIconImage}
                unoptimized
              />
            ) : getProfilePicture() === null || (!profileLoading && profile) ? (
              <div
                style={{
                  width: '53px',
                  height: '53px',
                  borderRadius: '50%',
                  background: '#ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
              >
                {getDisplayName().charAt(0).toUpperCase()}
              </div>
            ) : null}
          </Link>
        </div>
      </header>

      {/* Settings Section */}
      <section className={styles.settingsSection}>
        <div className={styles.settingsContent}>
          <h1 className={styles.settingsTitle}>Settings</h1>
          
          <div className={styles.profileSection}>
            <div className={styles.profileImageContainer}>
              {getProfilePicture() ? (
                <Image
                  src={getProfilePicture()}
                  alt={getDisplayName()}
                  width={331}
                  height={332}
                  className={styles.profileImage}
                  unoptimized
                />
              ) : getProfilePicture() === null || (!profileLoading && profile) ? (
                <div
                  style={{
                    width: '331px',
                    height: '332px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '80px',
                    fontWeight: 'bold'
                  }}
                >
                  {getDisplayName().charAt(0).toUpperCase()}
                </div>
              ) : (
                <div
                  style={{
                    width: '331px',
                    height: '332px',
                    borderRadius: '20px',
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Show loading placeholder instead of initials while loading */}
                </div>
              )}
            </div>
            
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>
                {getDisplayName() !== undefined ? getDisplayName() : ''}
              </h2>
              <p className={styles.profileUsername}>
                {getUsername() !== undefined ? getUsername() : ''}
              </p>
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
        <div className={styles.footerLinks}>
          <Link href="/about-us" className={styles.footerLink}>About Us</Link>
          <span className={styles.footerDivider}>|</span>
          <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
          <span className={styles.footerDivider}>|</span>
          <Link href="/support" className={styles.footerLink}>Support</Link>
          <span className={styles.footerDivider}>|</span>
          <Link href="/terms-conditions" className={styles.footerLink}>Terms & Conditions</Link>
        </div>
        <p className={styles.copyright}>
          Copyright © 2025 MoodTune. All Rights Reserved.
        </p>
      </footer>
    </div>
  )
}

