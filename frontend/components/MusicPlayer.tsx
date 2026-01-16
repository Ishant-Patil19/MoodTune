'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './MusicPlayer.module.css'

interface Song {
  id?: string
  title: string
  artist: string
  album?: string
  spotifyUri?: string
  spotifyId?: string
  url?: string
  imageUrl?: string
  source: string
}

interface MusicPlayerProps {
  song: Song | null
  isVisible: boolean
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  queue?: Song[]
}

export default function MusicPlayer({
  song,
  isVisible,
  onClose,
  onNext,
  onPrevious,
  queue = []
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [progress, setProgress] = useState(0)
  const playerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle song changes
  useEffect(() => {
    if (song) {
      setIsPlaying(true)
      setProgress(0)
      // Reset progress tracking
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      // Simulate progress (in real implementation, this would come from the player)
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current)
            }
            return 100
          }
          return prev + 0.5
        })
      }, 1000)
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [song])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  if (!isVisible || !song) return null

  // Get embed URL based on source
  const getEmbedUrl = () => {
    if (song.source === 'Spotify' || song.spotifyUri || song.spotifyId) {
      // Extract track ID from URI if needed
      let trackId = null
      if (song.spotifyUri && song.spotifyUri.startsWith('spotify:track:')) {
        trackId = song.spotifyUri.replace('spotify:track:', '')
      } else if (song.spotifyId) {
        // If it's an album ID, we can't embed a specific track, so we'll use the album
        if (song.spotifyUri && song.spotifyUri.startsWith('spotify:album:')) {
          const albumId = song.spotifyUri.replace('spotify:album:', '')
          return `https://open.spotify.com/embed/album/${albumId}?utm_source=generator&theme=0`
        }
        // Try to use spotifyId as track ID
        trackId = song.spotifyId
      }

      if (trackId) {
        return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`
      } else if (song.spotifyId) {
        // Fallback to album embed
        return `https://open.spotify.com/embed/album/${song.spotifyId}?utm_source=generator&theme=0`
      }
    } else if (song.source === 'JioSaavn' && song.url) {
      // For JioSaavn, we'll use an iframe with the song page
      // Note: JioSaavn doesn't have a direct embed API, so we'll use the web player
      return song.url
    }
    return null
  }

  const embedUrl = getEmbedUrl()

  return (
    <div
      ref={playerRef}
      className={`${styles.musicPlayer} ${isMinimized ? styles.minimized : ''}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        width: '100%',
        maxWidth: '100vw'
      }}
    >
      {/* Progress Bar at the top */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Song Info on the left */}
      <div className={styles.playerHeader}>
        <div className={styles.playerInfo}>
          {song.imageUrl && (
            <Image
              src={song.imageUrl}
              alt={song.title}
              width={60}
              height={60}
              className={styles.albumArt}
              unoptimized
            />
          )}
          <div className={styles.songInfo}>
            <div className={styles.songTitle}>{song.title}</div>
            <div className={styles.songArtist}>{song.artist}</div>
          </div>
        </div>
      </div>

      {/* Player Controls in the center */}
      {!isMinimized && (
        <div className={styles.playerControls}>
          <button
            onClick={onPrevious}
            className={styles.controlButton}
            disabled={!onPrevious}
            aria-label="Previous"
          >
            ⏮
          </button>
          <button
            onClick={togglePlayPause}
            className={styles.playButton}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={onNext}
            className={styles.controlButton}
            disabled={!onNext}
            aria-label="Next"
          >
            ⏭
          </button>
        </div>
      )}

      {/* Hidden iframe for actual playback */}
      {!isMinimized && embedUrl && embedUrl.includes('spotify.com') && (
        <div style={{ display: 'none' }}>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            width="0"
            height="0"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}

      {/* Close button on the right */}
      <div className={styles.headerControls}>
        <button
          onClick={onClose}
          className={styles.controlButton}
          aria-label="Close"
          style={{
            fontSize: '24px',
            width: '36px',
            height: '36px'
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

