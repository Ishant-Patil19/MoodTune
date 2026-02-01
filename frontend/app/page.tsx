'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { publicAPI } from '@/lib/api'
import HorizontalCarousel from '@/components/HorizontalCarousel'
import styles from './page.module.css'

interface Song {
  id: string
  title: string
  subtitle?: string
  artist?: string
  album?: string
  imageUrl?: string
  spotifyId?: string
  spotifyUri?: string
  spotifyUrl?: string
  url?: string
  source?: string
}

interface Playlist {
  id: string
  title: string
  subtitle?: string
  imageUrl?: string
  spotifyId?: string
  url?: string
  genre?: string
}

interface Artist {
  id: string
  title: string
  subtitle?: string
  imageUrl?: string
  spotifyId?: string
}

// Helper function to truncate long text
const truncateText = (text: string, maxLength: number = 30): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([])
  const [industrySongs, setIndustrySongs] = useState<Song[]>([])
  const [featuredPlaylists, setFeaturedPlaylists] = useState<Playlist[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)

  useEffect(() => {
    // Check for Spotify callback code in URL
    const urlParams = new URLSearchParams(window.location.search)
    const spotifyCode = urlParams.get('spotify_code')
    
    if (spotifyCode) {
      // If authenticated, redirect to home page with the code
      if (isAuthenticated) {
        router.push(`/home?spotify_code=${spotifyCode}`)
        return
      } else {
        // If not authenticated, store code and redirect to login
        // After login, redirect to home with code
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('spotify_code', spotifyCode)
        }
        router.push('/login')
        return
      }
    }
    
    // If authenticated and no callback, redirect to home
    if (isAuthenticated && !authLoading) {
      router.push('/home')
      return
    }

    // Fetch public content only if not authenticated
    if (!isAuthenticated && !authLoading) {
      fetchPublicContent()
    }
  }, [isAuthenticated, authLoading, router])

  const fetchPublicContent = async () => {
    try {
      setLoading(true)
      // Use 'Global' for more diverse content, or rotate between languages
      const languages = ['English', 'Global', 'Hindi']
      const language = languages[Math.floor(Math.random() * languages.length)]
      
      // Fetch trending songs first
      const songs = await publicAPI.getTrendingSongs(language).catch((e) => {
        console.error('Error fetching trending songs:', e)
        return []
      })
      
      // Extract IDs from trending songs to exclude from industry songs
      const trendingSongIds = songs
        .slice(0, 10)
        .map((song: { id?: string; spotifyId?: string; spotifyUri?: string; url?: string }) => song.id || song.spotifyId || song.spotifyUri || song.url)
        .filter((id: string | undefined): id is string => !!id && !id.toString().startsWith('default-'))
      
      // Fetch other content in parallel, but industry songs with exclude parameter
      const [industrySongsData, playlists, artistsData] = await Promise.all([
        publicAPI.getIndustrySongs(language, trendingSongIds).catch((e) => {
          console.error('Error fetching industry songs:', e)
          return []
        }),
        publicAPI.getFeaturedPlaylists(language).catch((e) => {
          console.error('Error fetching featured playlists:', e)
          return []
        }),
        publicAPI.getArtists(language).catch((e) => {
          console.error('Error fetching artists:', e)
          return []
        })
      ])
      
      console.log('Fetched public content:', {
        songs: songs.length,
        industrySongs: industrySongsData.length,
        playlists: playlists.length,
        artists: artistsData.length,
        language,
        excludedIds: trendingSongIds.length
      })
      
      // Limit to 10 items per section (2 for playlists) for faster loading
      // Don't shuffle - keep in popularity order from backend
      setTrendingSongs(songs.slice(0, 10)) // Limit to 10 most popular songs
      setIndustrySongs(industrySongsData.slice(0, 10)) // Limit to 10 industry songs (different from trending)
      setFeaturedPlaylists(playlists.slice(0, 2)) // Limit to 2 most popular playlists
      setArtists(artistsData.slice(0, 10)) // Limit to 10 most popular artists
    } catch (error) {
      console.error('Error fetching public content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSongClick = (song: Song) => {
    if (!isAuthenticated) {
      setSelectedSong(song)
      setShowLoginPrompt(true)
    } else {
      // If authenticated, redirect to home page (which has full functionality)
      router.push('/home')
    }
  }

  const handlePlaylistClick = (playlist: Playlist) => {
    if (!isAuthenticated) {
      setSelectedSong(null)
      setShowLoginPrompt(true)
    } else {
      router.push('/home')
    }
  }

  const handleArtistClick = (artist: Artist) => {
    if (!isAuthenticated) {
      setSelectedSong(null)
      setShowLoginPrompt(true)
    } else {
      router.push('/home')
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logoContainer}>
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
          
          <div
            className={styles.cameraIcon}
            role="button"
            tabIndex={0}
            onClick={() => {
              setSelectedSong(null)
              setShowLoginPrompt(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelectedSong(null)
                setShowLoginPrompt(true)
              }
            }}
            style={{ cursor: 'pointer' }}
            aria-label="Detect emotion (login required)"
          >
            <Image
              src="/images/camera-icon.png"
              alt="Camera"
              width={65}
              height={65}
              unoptimized
            />
          </div>
          
          <Link href="/signup" className={styles.signupButton}>
            Signup
          </Link>
          <Link href="/login" className={styles.loginButton}>
            Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Recommended Songs Section */}
        {loading ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Recommended Songs - Most Heard Today</h2>
            <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
              Loading songs...
            </div>
          </section>
        ) : trendingSongs.length > 0 ? (
          <HorizontalCarousel
            title="Recommended Songs - Most Heard Today"
            items={trendingSongs.map((song, index) => ({
              ...song,
              id: song.id || song.spotifyUri || song.url || `song-${index}`,
              title: song.title,
              subtitle: song.subtitle || song.artist || 'Unknown Artist',
              imageUrl: song.imageUrl ?? undefined
            }))}
            onItemClick={(item) => {
              handleSongClick(item as Song)
            }}
            itemWidth={252}
            itemHeight={199}
          />
        ) : (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Recommended Songs - Most Heard Today</h2>
            <div style={{ padding: '1.5rem', color: 'white', opacity: 0.9 }}>
              No recommendations available right now. Please try again in a moment.
            </div>
          </section>
        )}

        {/* Artist List Section */}
        {loading ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Artist List</h2>
            <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
              Loading artists...
            </div>
          </section>
        ) : artists.length > 0 ? (
          <HorizontalCarousel
            title="Artist List"
            items={artists.map((artist) => ({
              ...artist,
              imageUrl: artist.imageUrl ?? undefined
            }))}
            onItemClick={(item) => {
              handleArtistClick(item as Artist)
            }}
            itemWidth={226}
            itemHeight={217}
            circularImages={true}
          />
        ) : (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Artist List</h2>
            <div style={{ padding: '1.5rem', color: 'white', opacity: 0.9 }}>
              No artists available right now. Please try again in a moment.
            </div>
          </section>
        )}

        {/* Industry Section */}
        {loading ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Industry</h2>
            <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
              Loading industry songs...
            </div>
          </section>
        ) : industrySongs.length > 0 ? (
          <HorizontalCarousel
            title="Industry"
            items={industrySongs.map((song, index) => ({
              ...song,
              id: song.id || song.spotifyUri || song.url || `industry-song-${index}`,
              subtitle: song.subtitle || song.artist || 'Unknown Artist',
              imageUrl: song.imageUrl ?? undefined
            }))}
            onItemClick={(item) => {
              handleSongClick(item as Song)
            }}
            itemWidth={252}
            itemHeight={199}
          />
        ) : (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Industry</h2>
            <div style={{ padding: '1.5rem', color: 'white', opacity: 0.9 }}>
              No industry songs available right now. Please try again in a moment.
            </div>
          </section>
        )}

        {/* Playlists Section */}
        {loading ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Playlists</h2>
            <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
              Loading playlists...
            </div>
          </section>
        ) : featuredPlaylists.length > 0 ? (
          <HorizontalCarousel
            title="Playlists"
            items={featuredPlaylists.map((playlist) => ({
              ...playlist,
              imageUrl: playlist.imageUrl ?? undefined
            }))}
            onItemClick={(item) => {
              handlePlaylistClick(item as Playlist)
            }}
            itemWidth={252}
            itemHeight={202}
          />
        ) : (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Playlists</h2>
            <div style={{ padding: '1.5rem', color: 'white', opacity: 0.9 }}>
              No playlists available right now. Please try again in a moment.
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          Copyright © 2025 MoodTune. All Rights Reserved.
        </p>
      </footer>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '15px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎵</div>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem', color: '#333' }}>
              Login to Play Music
            </h2>
            {selectedSong && (
              <p style={{ marginBottom: '1rem', color: '#666', fontSize: '1rem' }}>
                You're trying to play: <strong>{truncateText(selectedSong.title, 40)}</strong> by {truncateText(selectedSong.artist || selectedSong.subtitle || 'Unknown Artist', 30)}
              </p>
            )}
            <p style={{ marginBottom: '2rem', color: '#666', fontSize: '1rem' }}>
              {selectedSong 
                ? 'Please login or sign up to listen to this song and get personalized music recommendations!'
                : 'Want to detect emotion? Please login or sign up.'
              }
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link
                href="/login"
                onClick={() => setShowLoginPrompt(false)}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setShowLoginPrompt(false)}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  background: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Sign Up
              </Link>
              <button
                onClick={() => {
                  setShowLoginPrompt(false)
                  setSelectedSong(null)
                }}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

