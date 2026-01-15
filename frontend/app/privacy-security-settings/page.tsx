'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { authAPI, settingsAPI } from '@/lib/api'
import styles from './page.module.css'

export default function PrivacySecuritySettings() {
  const { user, refreshUser, logout, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [cameraAccess, setCameraAccess] = useState(true)
  const [clearHistory, setClearHistory] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
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
      setCameraAccess(prefs.camera_access_enabled !== false)
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

  const handleCameraAccessChange = async (enabled: boolean) => {
    setCameraAccess(enabled)
    try {
      await settingsAPI.updatePreferences({ camera_access_enabled: enabled })
    } catch (error: any) {
      console.error('Failed to update camera access:', error)
      alert(error.message || 'Failed to update camera access')
      // Revert on error
      const prefs = await settingsAPI.getPreferences()
      setCameraAccess(prefs.camera_access_enabled !== false)
    }
  }

  const handleClearHistory = async () => {
    setIsClearing(true)
    try {
      await settingsAPI.clearHistory()
      alert('Listening history cleared successfully!')
      setShowClearHistoryModal(false)
      setClearHistory(false)
    } catch (error: any) {
      console.error('Error clearing history:', error)
      alert(error.message || 'Failed to clear history. Please try again.')
    } finally {
      setIsClearing(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await settingsAPI.deleteAccount()
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      // Logout user
      logout()
      
      // Close the modal
      setShowDeleteModal(false)
      
      // Redirect to sign-up page
      router.push('/signup')
    } catch (error: any) {
      console.error('Error deleting account:', error)
      alert(error.message || 'Failed to delete account. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
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

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false)
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
            <Link href="/privacy-security-settings" className={styles.navTabActive}>
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
          {/* Camera Access Card */}
          <div className={styles.settingCard}>
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Camera Access</span>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={cameraAccess}
                  onChange={(e) => handleCameraAccessChange(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>

          {/* Clear listening History Card */}
          <div className={styles.settingCard}>
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Clear listening History</span>
              <button
                className={styles.changeButton}
                onClick={() => setShowClearHistoryModal(true)}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Delete Account Card */}
          <div className={styles.settingCard} onClick={() => setShowDeleteModal(true)}>
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Delete Account</span>
            </div>
          </div>

          {/* Log Out Card */}
          <button className={styles.settingCardLogOut} onClick={() => setShowLogoutModal(true)}>
            <div className={styles.settingItem}>
              <span className={styles.settingLabelLogOut}>Log Out</span>
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          Copyright © 2025 MoodTune - Your emotional Uplift. All Rights Reserved.
        </p>
      </footer>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={handleCloseDeleteModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleCloseDeleteModal}>
              <svg width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="19" cy="20" r="19" fill="rgba(193, 229, 255, 0.5)"/>
                <path d="M14.35 14.35L23.65 23.65M23.65 14.35L14.35 23.65" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <p className={styles.modalText}>
              We'll miss having you here.<br />
              Are you sure you want to leave MoodTune so soon
            </p>

            <div className={styles.modalButtons}>
              <button className={styles.laterButton} onClick={handleCloseDeleteModal}>
                Later
              </button>
              <button 
                className={styles.deleteButton} 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                style={{ opacity: isDeleting ? 0.6 : 1, cursor: isDeleting ? 'not-allowed' : 'pointer' }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Out Modal */}
      {showLogoutModal && (
        <div className={styles.modalOverlay} onClick={handleCloseLogoutModal}>
          <div className={styles.modalContentLogout} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButtonLogout} onClick={handleCloseLogoutModal}>
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="19" cy="19" r="19" fill="rgba(193, 229, 255, 0.5)"/>
                <path d="M14.35 14.35L23.65 23.65M23.65 14.35L14.35 23.65" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <p className={styles.modalTextLogout}>
              Everything okay<br />
              Do you want to leave MoodTune now
            </p>

            <div className={styles.modalButtonsLogout}>
              <button className={styles.laterButtonLogout} onClick={handleCloseLogoutModal}>
                Later
              </button>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear History Modal */}
      {showClearHistoryModal && (
        <div 
          className={styles.modalOverlay} 
          onClick={() => {
            setShowClearHistoryModal(false)
          }}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton}
              onClick={() => setShowClearHistoryModal(false)}
            >
              <svg width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="19" cy="20" r="19" fill="rgba(193, 229, 255, 0.5)"/>
                <path d="M14.35 14.35L23.65 23.65M23.65 14.35L14.35 23.65" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <p className={styles.modalText}>
              Are you sure you want to clear your listening history?<br />
              This action cannot be undone.
            </p>

            <div className={styles.modalButtons}>
              <button 
                className={styles.laterButton} 
                onClick={() => setShowClearHistoryModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.deleteButton} 
                onClick={handleClearHistory}
                disabled={isClearing}
                style={{ opacity: isClearing ? 0.6 : 1, cursor: isClearing ? 'not-allowed' : 'pointer' }}
              >
                {isClearing ? 'Clearing...' : 'Clear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

