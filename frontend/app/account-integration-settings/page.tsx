'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { spotifyAPI, authAPI, settingsAPI } from '@/lib/api'
import { useRouter, usePathname } from 'next/navigation'
import styles from './page.module.css'

export default function AccountIntegrationSettings() {
  const { user, refreshUser, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [spotifyLinked, setSpotifyLinked] = useState(false)
  const [googleLinked, setGoogleLinked] = useState(false)
  const [isLinking, setIsLinking] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (user) {
      setSpotifyLinked(user.spotifyLinked)
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
    if (pathname === '/account-integration-settings' && user) {
      // Small delay to ensure navigation is complete
      const timer = setTimeout(() => {
        fetchProfile()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [pathname, user])

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

  useEffect(() => {
    // Check for Spotify callback code in URL
    const urlParams = new URLSearchParams(window.location.search)
    const spotifyCode = urlParams.get('spotify_code')
    
    if (spotifyCode) {
      handleSpotifyCallback(spotifyCode)
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const handleSpotifyCallback = async (code: string) => {
    try {
      setIsLinking(true)
      await spotifyAPI.completeCallback(code)
      await refreshUser()
      alert('Spotify account linked successfully!')
    } catch (error: any) {
      console.error('Spotify linking error:', error)
      alert(error.message || 'Failed to link Spotify account')
    } finally {
      setIsLinking(false)
    }
  }

  const handleSpotifyLink = async () => {
    if (spotifyLinked) {
      // Unlink Spotify
      try {
        await settingsAPI.unlinkSpotify()
        await refreshUser()
        setSpotifyLinked(false)
        alert('Spotify account unlinked successfully')
      } catch (error: any) {
        console.error('Failed to unlink Spotify:', error)
        alert(error.message || 'Failed to unlink Spotify account')
      }
      return
    }

    try {
      setIsLinking(true)
      const { url } = await spotifyAPI.getLoginUrl()
      // Open Spotify OAuth in the same window
      window.location.href = url
    } catch (error: any) {
      console.error('Failed to get Spotify login URL:', error)
      alert(error.message || 'Failed to initiate Spotify linking')
      setIsLinking(false)
    }
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
            <Link href="/account-integration-settings" className={styles.navTabActive}>
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
          {/* Spotify Account Card */}
          <div className={styles.settingCard}>
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>
                {spotifyLinked ? 'Unlink Spotify Account' : 'Link Spotify Account'}
              </span>
              {isLinking ? (
                <span>Linking...</span>
              ) : (
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={spotifyLinked}
                    onChange={handleSpotifyLink}
                />
                <span className={styles.toggleSlider}></span>
              </label>
              )}
            </div>
            {spotifyLinked && user?.spotifyUser && (
              <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f0f0f0', borderRadius: '5px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Connected as: <strong>{user.spotifyUser.name}</strong>
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#666' }}>
                  {user.spotifyUser.email}
                </p>
              </div>
            )}
          </div>

          {/* Unlink Google Account Card */}
          <div className={styles.settingCard}>
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Unlink Google Account</span>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={googleLinked}
                  onChange={(e) => setGoogleLinked(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
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

