'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import ShareModal from '@/components/ShareModal'
import CircularCarousel from '@/components/CircularCarousel'
import styles from './page.module.css'
import { recommendedSongs, artists, industrySongs, playlists } from '@/lib/mockData'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const audioPlayerRef = useRef<HTMLDivElement>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [currentArtistPage, setCurrentArtistPage] = useState(0)
  const [currentIndustryPage, setCurrentIndustryPage] = useState(0)
  const [currentPlaylistPage, setCurrentPlaylistPage] = useState(0)
  const [currentPlayingSong, setCurrentPlayingSong] = useState<any>(null)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const artistsPerPage = 4
  const songsPerPage = 4
  const playlistsPerPage = 4

  const totalArtistPages = Math.ceil(artists.length / artistsPerPage)
  const totalIndustryPages = Math.ceil(industrySongs.length / songsPerPage)
  const totalPlaylistPages = Math.ceil(playlists.length / playlistsPerPage)

  // Convert recommendedSongs to the format expected by CircularCarousel
  const carouselSongs = recommendedSongs.map(song => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    imageUrl: song.image,
    subtitle: song.movie || song.album
  }))

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
    }
  }, [isAuthenticated, authLoading, router])

  // Scroll to audio player when a song starts playing
  const scrollToPlayer = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }

  const handleNextArtists = () => {
    setCurrentArtistPage((prev) => (prev + 1) % totalArtistPages)
  }

  const handlePrevArtists = () => {
    setCurrentArtistPage((prev) => (prev - 1 + totalArtistPages) % totalArtistPages)
  }

  const handleNextIndustry = () => {
    setCurrentIndustryPage((prev) => (prev + 1) % totalIndustryPages)
  }

  const handlePrevIndustry = () => {
    setCurrentIndustryPage((prev) => (prev - 1 + totalIndustryPages) % totalIndustryPages)
  }

  const handleNextPlaylists = () => {
    setCurrentPlaylistPage((prev) => (prev + 1) % totalPlaylistPages)
  }

  const handlePrevPlaylists = () => {
    setCurrentPlaylistPage((prev) => (prev - 1 + totalPlaylistPages) % totalPlaylistPages)
  }

  const currentArtists = artists.slice(
    currentArtistPage * artistsPerPage,
    (currentArtistPage + 1) * artistsPerPage
  )
  const currentIndustrySongs = industrySongs.slice(
    currentIndustryPage * songsPerPage,
    (currentIndustryPage + 1) * songsPerPage
  )
  const currentPlaylists = playlists.slice(
    currentPlaylistPage * playlistsPerPage,
    (currentPlaylistPage + 1) * playlistsPerPage
  )

  // Handle song playback without login
  const handlePlaySong = (song: any) => {
    console.log('Playing song:', song)
    // Find the index of the clicked song in carouselSongs
    const songIndex = carouselSongs.findIndex(s => s.id === song.id)
    setCurrentSongIndex(songIndex !== -1 ? songIndex : 0)
    setCurrentPlayingSong(song)
    setIsPlaying(true)

    // Scroll to player after a short delay to ensure it's rendered
    setTimeout(() => {
      scrollToPlayer()
    }, 100)
  }

  // Handle next song
  const handleNextSong = () => {
    const nextIndex = (currentSongIndex + 1) % carouselSongs.length
    setCurrentSongIndex(nextIndex)
    setCurrentPlayingSong(carouselSongs[nextIndex])
    setIsPlaying(true)
  }

  // Handle previous song
  const handlePrevSong = () => {
    const prevIndex = (currentSongIndex - 1 + carouselSongs.length) % carouselSongs.length
    setCurrentSongIndex(prevIndex)
    setCurrentPlayingSong(carouselSongs[prevIndex])
    setIsPlaying(true)
  }

  const handlePauseResume = () => {
    setIsPlaying(!isPlaying)
  }

  const handleStopSong = () => {
    setCurrentPlayingSong(null)
    setIsPlaying(false)
  }

  return (
    <div className={`${styles.container} ${currentPlayingSong ? styles.withPlayer : ''}`}>
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
            <div className={styles.searchBar} onClick={() => setIsAuthModalOpen(true)}>
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

          <div className={styles.cameraIcon} onClick={() => setIsAuthModalOpen(true)}>
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
        {/* Recommended Songs Section - Using CircularCarousel */}
        <CircularCarousel
          songs={carouselSongs}
          onSongClick={handlePlaySong}
          title="Recommended Songs"
        />

        {/* Artist List Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Artist List</h2>
          </div>
          <div className={styles.artistList}>
            {currentArtists.map((artist) => (
              <div key={artist.id} className={styles.artistCard} onClick={() => setIsAuthModalOpen(true)}>
                <div className={styles.artistImage}>
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    width={226}
                    height={217}
                    className={styles.artistImg}
                    unoptimized
                  />
                </div>
                <p className={styles.artistName}>{artist.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Industry Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Industry</h2>
            <div className={styles.navButtons}>
              <button className={styles.navButton} onClick={handlePrevIndustry} aria-label="Previous songs">
                ‹
              </button>
              <button className={styles.navButton} onClick={handleNextIndustry} aria-label="Next songs">
                ›
              </button>
            </div>
          </div>
          <div className={styles.songGrid}>
            {currentIndustrySongs.map((song) => (
              <div key={song.id} className={styles.songCard} onClick={() => setIsAuthModalOpen(true)}>
                <Image
                  src={song.image}
                  alt={song.title}
                  width={252}
                  height={199}
                  className={styles.songImage}
                  unoptimized
                />
                <p className={styles.songInfo}>
                  Song: {song.title}<br />
                  Singer: {song.artist}<br />
                  {song.movie || song.album}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Playlists Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Playlists</h2>
          </div>
          <div className={styles.playlistGrid}>
            {currentPlaylists.map((playlist) => (
              <div key={playlist.id} className={styles.playlistCard} onClick={() => setIsAuthModalOpen(true)}>
                <Image
                  src={playlist.image}
                  alt={playlist.name}
                  width={252}
                  height={202}
                  className={styles.playlistImage}
                  unoptimized
                />
                <p className={styles.playlistName}>{playlist.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Audio Player - Shows when a song is selected */}
      {currentPlayingSong && (
        <div ref={audioPlayerRef} className={styles.audioPlayer}>
          <div className={styles.playerContent}>
            {/* Song Info */}
            <div className={styles.songInfo}>
              <div className={styles.songThumbnail}>
                {currentPlayingSong.imageUrl && (
                  <Image
                    src={currentPlayingSong.imageUrl}
                    alt={currentPlayingSong.title}
                    width={70}
                    height={70}
                    className={styles.thumbnailImage}
                    unoptimized
                  />
                )}
              </div>
              <div className={styles.songDetails}>
                <h3 className={styles.playerSongTitle}>{currentPlayingSong.title}</h3>
                <p className={styles.playerSongArtist}>{currentPlayingSong.artist}</p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className={styles.playerControls}>
              <button
                className={styles.controlButton}
                onClick={handlePrevSong}
                aria-label="Previous song"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              <button
                className={styles.playPauseButton}
                onClick={handlePauseResume}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button
                className={styles.controlButton}
                onClick={handleNextSong}
                aria-label="Next song"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 18h2V6h-2zm-11-6l8.5-6v12z" />
                </svg>
              </button>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button
                className={styles.actionButton}
                onClick={() => setIsAuthModalOpen(true)}
                aria-label="Like song"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button
                className={styles.actionButton}
                onClick={() => setIsAuthModalOpen(true)}
                aria-label="Add to playlist"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
                </svg>
              </button>
              <button
                className={styles.actionButton}
                onClick={() => setIsShareModalOpen(true)}
                aria-label="Share song"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                </svg>
              </button>
            </div>

            {/* Demo Mode Message and Close Button */}
            <div className={styles.demoMessageContainer}>
              <div className={styles.demoMessage}>
                <span>🎵 Demo Mode - Login with Spotify for full playback</span>
              </div>
              <button className={styles.closeButton} onClick={handleStopSong} aria-label="Close player">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        songTitle={currentPlayingSong?.title}
        songArtist={currentPlayingSong?.artist}
      />
    </div>
  )
}

