import cv2
from fer import FER
import numpy as np
import requests

# --- CONFIGURATION ---
BASE_URL = "http://127.0.0.1:5000"
detector = FER(mtcnn=True)

# --- Emotion and lighting parameters ---
MENTAL_WELLBEING_TRIGGERS = ["sad", "depressed", "angry", "stressed", "fear", "anxious"]
LOW_LIGHT_THRESHOLD = 45      # below this → too dark
HIGH_LIGHT_THRESHOLD = 180    # above this → too bright

def get_jwt_token():
    """Prompt for user credentials and retrieve JWT token from backend."""
    email = input("Enter your registered email: ").strip()
    password = input("Enter your password: ").strip()
    res = requests.post(f"{BASE_URL}/login", json={"email": email, "password": password})

    if res.status_code == 200:
        print("✅ Login successful! JWT token acquired.")
        return res.json().get("token")
    print("❌ Invalid credentials or login failed.")
    return None


# --- Lighting Detection ---
def check_lighting(frame):
    """Detect low or high light based on average brightness."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    brightness = np.mean(gray)
    print(f"💡 Current brightness: {brightness:.2f}")  # debug print

    if brightness < LOW_LIGHT_THRESHOLD:
        return "low"
    elif brightness > HIGH_LIGHT_THRESHOLD:
        return "high"
    else:
        return "normal"


# --- Song Recommendation Handlers ---
def recommend_on_low_light(jwt_token, reason="low"):
    """Fallback: Recommend supportive songs when lighting is poor."""
    if reason == "low":
        print("\n💡 We need a little more light to scan your face accurately 😊.")
    else:
        print("\n☀️ It seems too bright! Please reduce the light for better accuracy 😎.")
    
    print("Here are some songs to keep your mood positive ❤️.")
    headers = {"Authorization": f"Bearer {jwt_token}"} if jwt_token else {}

    try:
        res = requests.get(f"{BASE_URL}/api/recommendations?emotion=calm", headers=headers)
        if res.status_code == 200:
            songs = res.json()
            if isinstance(songs, dict) and "available_languages" in songs:
                # handle case where backend asks for language
                lang = "English"
                res = requests.get(f"{BASE_URL}/api/recommendations?emotion=calm&language={lang}", headers=headers)
                songs = res.json()

            print("\n🎵 Recommended Songs (Lighting Fallback):")
            for s in songs:
                title = s.get("title", "Unknown")
                artist = s.get("artist", "Unknown")
                source = s.get("source", "Unknown")
                uri = s.get("spotifyUri") or s.get("url", "N/A")
                print(f"- {title} by {artist} [{source}] → {uri}")
        else:
            print("⚠️ Could not fetch fallback recommendations.")
    except Exception as e:
        print("❌ Error fetching fallback songs:", e)


def send_to_backend(emotion, jwt_token):
    payload = {"emotion": emotion}
    headers = {"Authorization": f"Bearer {jwt_token}"} if jwt_token else {}

    wellbeing_enabled = False
    if emotion.lower() in MENTAL_WELLBEING_TRIGGERS:
        choice = input(f"\n💚 You seem {emotion}. Would you like to activate Mental Well-being Mode? (y/n): ").strip().lower()
        wellbeing_enabled = (choice == "y")

    try:
        # Step 1: Log emotion
        res = requests.post(f"{BASE_URL}/log_emotion", json=payload, headers=headers)
        res.raise_for_status()
        print("✅ Emotion logged successfully.")

        # Step 2: Get recommendations
        reco_url = f"{BASE_URL}/api/recommendations"
        if wellbeing_enabled:
            reco_url += "?wellbeing=true"
        reco_res = requests.get(reco_url, headers=headers)
        reco_res.raise_for_status()
        data = reco_res.json()

        # Step 3: Handle language selection
        if isinstance(data, dict) and "available_languages" in data:
            print("\n🌐 Please select a song language:")
            for i, lang in enumerate(data["available_languages"], 1):
                print(f"{i}. {lang}")
            choice = int(input("\nEnter the number for your preferred language: ").strip())
            selected_language = data["available_languages"][choice - 1]
            final_reco_url = (
                f"{reco_url}&language={selected_language}"
                if wellbeing_enabled else
                f"{reco_url}?language={selected_language}"
            )
            final_res = requests.get(final_reco_url, headers=headers)
            final_res.raise_for_status()
            songs = final_res.json()
        else:
            songs = data

        # Step 4: Display results
        print("\n🎵 Recommended Songs:")
        if not songs:
            print("No songs found. Try another emotion or language.")
        for song in songs:
            title = song.get("title")
            artist = song.get("artist")
            source = song.get("source", "Unknown")
            uri = song.get("spotifyUri") or song.get("url", "N/A")
            print(f"- {title} by {artist} [{source}] → {uri}")

    except requests.exceptions.HTTPError as http_err:
        print("❌ HTTP error:", http_err)
        if http_err.response is not None:
            print(http_err.response.text)
    except Exception as e:
        print("❌ Unexpected error:", str(e))


# --- Capture Mode ---
def capture_mode(jwt_token):
    cap = cv2.VideoCapture(0)
    print("📸 Press 'c' to capture image and detect emotion. Press 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Webcam not detected.")
            break

        cv2.imshow("📷 Capture Mode", frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord('q'):
            break
        elif key == ord('c'):
            lighting = check_lighting(frame)
            if lighting in ["low", "high"]:
                recommend_on_low_light(jwt_token, reason=lighting)
                continue

            print("🔍 Detecting emotion...")
            emotion, score = detector.top_emotion(frame)
            if emotion:
                print(f"🧠 Detected Emotion: {emotion} (Confidence: {score:.2f})")
                send_to_backend(emotion, jwt_token)
            else:
                print("😐 No clear emotion detected.")

    cap.release()
    cv2.destroyAllWindows()


# --- Live Mode ---
def live_mode(jwt_token):
    cap = cv2.VideoCapture(0)
    print("🎥 Live detection started. Press 'q' to quit.")

    prev_emotion = None
    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Webcam not detected.")
            break

        lighting = check_lighting(frame)
        if lighting in ["low", "high"]:
            message = "Low light detected — please increase brightness ☀️" if lighting == "low" else \
                      "Too bright — reduce light for accurate detection 😎"
            cv2.putText(frame, message, (20, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
            cv2.imshow("🎥 Live Emotion Detection", frame)
            recommend_on_low_light(jwt_token, reason=lighting)
            if cv2.waitKey(2000) & 0xFF == ord('q'):
                break
            continue

        emotions = detector.detect_emotions(frame)
        if emotions:
            for face in emotions:
                (x, y, w, h) = face["box"]
                roi = frame[y:y+h, x:x+w]
                top_emotion, score = detector.top_emotion(roi)
                if top_emotion:
                    label = f"{top_emotion} ({score:.2f})"
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                    cv2.putText(frame, label, (x, y - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                    if top_emotion != prev_emotion:
                        prev_emotion = top_emotion
                        print(f"🧠 Emotion: {top_emotion} (Confidence: {score:.2f})")
                        send_to_backend(top_emotion, jwt_token)

        cv2.imshow("🎥 Live Emotion Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


# --- Main ---
def main():
    print("🎵 Mood-Based Music Selector")
    print("1️⃣  Press '1' to Capture Image and Detect Emotion")
    print("2️⃣  Press '2' for Live Video Emotion Detection")
    print("❌  Press 'q' to Exit")

    jwt_token = get_jwt_token()
    if not jwt_token:
        print("❌ Cannot proceed without login.")
        return

    choice = input("Enter your choice (1/2/q): ").strip()
    if choice == '1':
        capture_mode(jwt_token)
    elif choice == '2':
        live_mode(jwt_token)
    else:
        print("👋 Exiting.")


if __name__ == "__main__":
    main()
