'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authAPI } from '@/lib/api'
import styles from './page.module.css'

export default function EditProfile() {
  const router = useRouter()
  const { refreshUser, isAuthenticated, loading: authLoading } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [bio, setBio] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile()
    }
  }, [isAuthenticated])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const profile = await authAPI.getProfile()
      setFirstName(profile.first_name || '')
      setUsername(profile.username || '')
      setEmail(profile.email || '')
      setPhoneNumber(profile.phone_number || '')
      setBio(profile.bio || '')
      setProfilePictureUrl(profile.profile_picture_url || null)
      if (profile.profile_picture_url) {
        setPreviewUrl(profile.profile_picture_url)
      }
    } catch (error: any) {
      console.error('Failed to fetch profile:', error)
      setError(error.message || 'Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      setSelectedFile(file)
      setError('')
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Upload profile picture first if a new one was selected
      if (selectedFile) {
        // Convert file to base64
        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.onerror = reject
          reader.readAsDataURL(selectedFile)
        })

        try {
          await authAPI.uploadProfilePicture(base64Image)
          setProfilePictureUrl(base64Image)
          setSelectedFile(null)
        } catch (error: any) {
          console.error('Failed to upload profile picture:', error)
          setError(error.message || 'Failed to upload profile picture')
          setIsLoading(false)
          return
        }
      }

      // Update profile data
      await authAPI.updateProfile({
        first_name: firstName.trim() || undefined,
        username: username.trim() || undefined,
        phone_number: phoneNumber.trim() || undefined,
        bio: bio.trim() || undefined,
      })

      // Refresh user data
      await refreshUser()

      // Navigate back
      router.back()
    } catch (error: any) {
      console.error('Failed to save profile:', error)
      setError(error.message || 'Failed to save profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (authLoading || isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: 'white'
        }}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        {/* Back to Home Button */}
        <Link href="/home" className={styles.backButton}>
          <span style={{ marginRight: '8px', fontSize: '20px' }}>←</span>
          Back to Home
        </Link>
        {/* Profile Image */}
        <div className={styles.profileImageContainer}>
          <div 
            onClick={handleImageClick}
            style={{ 
              cursor: 'pointer', 
              position: 'relative',
              width: '270px',
              height: '269px',
              borderRadius: '50%',
              overflow: 'hidden'
            }}
          >
            <Image
              src={previewUrl || profilePictureUrl || '/images/profile-edit-image-453fd6.png'}
              alt="Profile"
              width={270}
              height={269}
              className={styles.profileImage}
              unoptimized
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              textAlign: 'center',
              padding: '8px',
              fontSize: '14px'
            }}>
              Click to change
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            background: '#fee',
            color: '#c33',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className={styles.formContainer}>
          {/* First Name */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>First Name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Username */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="Enter your email"
              value={email}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          {/* Phone Number */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Phone Number</label>
            <input
              type="tel"
              className={styles.input}
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Bio */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Bio</label>
            <textarea
              className={styles.textarea}
              placeholder="Tell us about yourself"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <button 
            className={styles.cancelButton} 
            onClick={handleCancel}
            disabled={isLoading}
          >
            CANCEL
          </button>
          <button 
            className={styles.saveButton} 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'SAVING...' : 'SAVE'}
          </button>
        </div>
      </div>
    </div>
  )
}
