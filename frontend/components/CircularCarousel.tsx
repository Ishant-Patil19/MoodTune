'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './CircularCarousel.module.css'

interface CarouselSong {
    id: string | number
    title: string
    subtitle?: string
    artist?: string
    imageUrl?: string
    [key: string]: any
}

interface CircularCarouselProps {
    songs: CarouselSong[]
    onSongClick?: (song: CarouselSong) => void
    title?: string
}

export default function CircularCarousel({
    songs,
    onSongClick,
    title = 'Recommended Songs'
}: CircularCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!songs || songs.length === 0) {
        return (
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{title}</h2>
                <div className={styles.emptyState}>No songs available</div>
            </section>
        )
    }

    // Get 7 visible songs in circular order
    const getVisibleSongs = () => {
        const total = songs.length
        const positions = []

        // We want to show 7 songs: -3, -2, -1, 0 (center), 1, 2, 3
        for (let i = -3; i <= 3; i++) {
            const index = (currentIndex + i + total) % total
            positions.push({
                song: songs[index],
                position: i
            })
        }

        return positions
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % songs.length)
    }

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length)
    }

    const visibleSongs = getVisibleSongs()
    const centerSong = songs[currentIndex]

    return (
        <section className={styles.section}>
            <div className={styles.headerContainer}>
                <h2 className={styles.sectionTitle}>{title}</h2>

                {/* Navigation Arrows in top-right */}
                {songs.length > 1 && (
                    <div className={styles.navControls}>
                        <button
                            className={styles.navButton}
                            onClick={handlePrevious}
                            aria-label="Previous song"
                        >
                            ‹
                        </button>
                        <button
                            className={styles.navButton}
                            onClick={handleNext}
                            aria-label="Next song"
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.carouselContainer}>
                {visibleSongs.map(({ song, position }, index) => {
                    const isCenter = position === 0

                    return (
                        <div
                            key={`${song.id}-${position}`}
                            className={`${styles.songCard} ${styles[`position${position}`]}`}
                            onClick={() => !isCenter && onSongClick?.(song)}
                        >
                            <div className={styles.songImageContainer}>
                                {song.imageUrl ? (
                                    <Image
                                        src={song.imageUrl}
                                        alt={song.title}
                                        width={400}
                                        height={320}
                                        className={styles.songImage}
                                        unoptimized
                                    />
                                ) : (
                                    <div className={styles.placeholderImage}>
                                        <Image
                                            src="/images/play-icon.png"
                                            alt="Play"
                                            width={60}
                                            height={60}
                                            unoptimized
                                        />
                                    </div>
                                )}

                                {/* Show details only for center card */}
                                {isCenter && (
                                    <div className={styles.centerOverlay}>
                                        <div className={styles.centerSongDetails}>
                                            <div className={styles.centerSongInfo}>
                                                <p className={styles.centerSongText}>
                                                    <span className={styles.songLabel}>Song:</span> {song.title}
                                                </p>
                                                <p className={styles.centerSongText}>
                                                    <span className={styles.songLabel}>Singer:</span> {song.artist || 'Unknown Artist'}
                                                </p>
                                                <p className={styles.centerSongText}>
                                                    <span className={styles.songLabel}>
                                                        {song.subtitle?.includes('Movie') || song.subtitle?.toLowerCase().includes('gadar') ? 'Movie:' : 'Album:'}
                                                    </span> {song.subtitle || 'Unknown'}
                                                </p>
                                            </div>
                                            <button
                                                className={styles.playButton}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onSongClick?.(song)
                                                }}
                                                aria-label="Play song"
                                            >
                                                <Image
                                                    src="/images/play-icon-home.svg"
                                                    alt="Play"
                                                    width={30}
                                                    height={30}
                                                    unoptimized
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
