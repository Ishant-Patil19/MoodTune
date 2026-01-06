'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';

export default function FeedbackPage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    router.push('/app-experience-settings');
  };

  return (
    <div className={styles.container}>
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <button className={styles.closeButton} onClick={handleClosePopup}>
              &times;
            </button>
            <div className={styles.popupText}>
              Thank you for being a part of our journey.
              <span className={styles.popupTextHighlight}>
                You make MoodTune more than just music — you make it an emotion .
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>We'd Love to Hear from You</h1>
          <p className={styles.description}>
            Your mood matters to us — every smile, every beat, every feeling.
            <br />
            Help us make MoodTune even more in tune with your emotions.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.questionBlock}>
            <label className={styles.label}>
              1. How did you feel while using MoodTune today?
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Write in a few words..."
              rows={2}
            />
          </div>

          <div className={styles.questionBlock}>
            <label className={styles.label}>
              2. Did the music match your current mood?
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Tell us how close we got!"
              rows={2}
            />
          </div>

          <div className={styles.questionBlock}>
            <label className={styles.label}>
              3. What would you like us to improve or add?
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Your ideas mean a lot to us."
              rows={2}
            />
          </div>

          <div className={styles.questionBlock}>
            <label className={styles.label}>
              4. Would you recommend MoodTune to your friends or family? Why or why not?
            </label>
            <textarea
              className={styles.textarea}
              placeholder="We'd love to know your reason."
              rows={2}
            />
          </div>

          <div className={styles.questionBlock}>
            <label className={styles.label}>
              5. Any message you'd like to share with our team?
            </label>
            <textarea
              className={styles.textarea}
              placeholder="We read every word with love."
              rows={2}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={() => router.push('/app-experience-settings')}
            >
              Cancel
            </button>
            <button type="submit" className={`${styles.button} ${styles.submitButton}`}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
