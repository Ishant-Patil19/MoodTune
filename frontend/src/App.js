import React, { useState, useEffect } from 'react';
import { Music, Camera, Search, Heart, ExternalLink, Sparkles, LogIn, UserPlus, LogOut, Music2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:5000';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const api = {
  register: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  logEmotion: async (emotion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/log_emotion`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ emotion })
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        const data = await response.json();
        throw new Error(data.error || 'Failed to log emotion');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  
  getRecommendations: async (emotion, language, wellbeing = false) => {
    const params = new URLSearchParams();
    if (emotion) params.append('emotion', emotion);
    if (language) params.append('language', language);
    if (wellbeing) params.append('wellbeing', 'true');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations?${params}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        const data = await response.json();
        throw new Error(data.error || 'Failed to get recommendations');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  
  searchSongs: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&type=track`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        const data = await response.json();
        throw new Error(data.error || 'Search failed');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getUserInfo: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/me`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        const data = await response.json();
        throw new Error(data.error || 'Failed to get user info');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  connectSpotify: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/spotify/login-url`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        const data = await response.json();
        throw new Error(data.error || 'Failed to get Spotify login URL');
      }
      const data = await response.json();
      // Redirect to Spotify OAuth page
      window.location.href = data.url;
    } catch (error) {
      console.error('Error connecting to Spotify:', error);
      throw error;
    }
  },

  detectEmotion: async (imageData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/detect-emotion`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ image: imageData })
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        const data = await response.json();
        throw new Error(data.error || 'Failed to detect emotion');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};

export default function MoodMusicApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('login');
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [spotifyLinked, setSpotifyLinked] = useState(false);
  const [spotifyUser, setSpotifyUser] = useState(null);
  const [videoRef, setVideoRef] = useState(null);
  const [stream, setStream] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedEmotionFromCamera, setDetectedEmotionFromCamera] = useState(null);
  const [detectionConfidence, setDetectionConfidence] = useState(null);

  const languages = ['Hindi', 'English', 'Bengali', 'Marathi', 'Telugu', 'Tamil'];
  const emotions = ['happy', 'sad', 'angry', 'neutral', 'surprise', 'fear'];

  // Check if user is already logged in and fetch user info
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
      setCurrentView('home');
      fetchUserInfo();
    }
  }, []);

  // Check for Spotify callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spotifyCode = urlParams.get('spotify_code');
    if (spotifyCode && isAuthenticated) {
      // Handle Spotify callback - complete the connection
      completeSpotifyConnection(spotifyCode);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isAuthenticated]);

  const completeSpotifyConnection = async (code) => {
    try {
      const response = await fetch(`${API_BASE_URL}/spotify/callback/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (response.ok) {
        setError('');
        // Refresh user info to get updated Spotify status
        await fetchUserInfo();
      } else {
        setError(data.error || 'Failed to connect Spotify');
      }
    } catch (err) {
      setError('Failed to connect Spotify. Please try again.');
      console.error('Spotify connection error:', err);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const userInfo = await api.getUserInfo();
      setSpotifyLinked(userInfo.spotifyLinked || false);
      setSpotifyUser(userInfo.spotifyUser);
    } catch (err) {
      console.error('Failed to fetch user info:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(loginEmail, loginPassword);
      localStorage.setItem('authToken', data.token);
      setIsAuthenticated(true);
      setCurrentView('home');
      setLoginEmail('');
      setLoginPassword('');
      fetchUserInfo();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.register(registerEmail, registerPassword);
      // After registration, automatically log in
      const data = await api.login(registerEmail, registerPassword);
      localStorage.setItem('authToken', data.token);
      setIsAuthenticated(true);
      setCurrentView('home');
      setRegisterEmail('');
      setRegisterPassword('');
      setShowRegister(false);
      fetchUserInfo();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setCurrentView('login');
    setDetectedEmotion(null);
    setSelectedLanguage('');
    setRecommendations([]);
  };

  useEffect(() => {
    if (detectedEmotion && selectedLanguage && isAuthenticated) {
      fetchRecommendations();
    }
  }, [detectedEmotion, selectedLanguage]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getRecommendations(detectedEmotion, selectedLanguage);
      
      if (Array.isArray(data)) {
        setRecommendations(data);
        setCurrentView('recommendations');
      } else if (data.message && data.available_languages) {
        // Backend is asking for language selection
        setCurrentView('language');
      }
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Authentication')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmotionSelect = async (emotion) => {
    setDetectedEmotion(emotion);
    setError('');
    try {
      await api.logEmotion(emotion);
      
      if (selectedLanguage) {
        fetchRecommendations();
      } else {
        setCurrentView('language');
      }
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Authentication')) {
        handleLogout();
      }
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const results = await api.searchSongs(searchQuery);
      setRecommendations(results);
      setCurrentView('recommendations');
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Authentication')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' 
        } 
      });
      setStream(mediaStream);
      if (videoRef) {
        videoRef.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Failed to access camera: ' + err.message);
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef) {
      videoRef.srcObject = null;
    }
    setIsDetecting(false);
    setDetectedEmotionFromCamera(null);
    setDetectionConfidence(null);
  };

  const captureAndDetect = async () => {
    if (!videoRef || !stream) return;
    
    setIsDetecting(true);
    setError('');
    
    try {
      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.videoWidth;
      canvas.height = videoRef.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef, 0, 0);
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Detect emotion
      const result = await api.detectEmotion(imageData);
      
      if (result.emotion) {
        setDetectedEmotionFromCamera(result.emotion);
        setDetectionConfidence(result.confidence);
        
        // Log emotion and proceed
        await api.logEmotion(result.emotion);
        setDetectedEmotion(result.emotion);
        
        // Stop camera and show language selection or recommendations
        stopCamera();
        if (selectedLanguage) {
          fetchRecommendations();
        } else {
          setCurrentView('language');
        }
      } else {
        setError(result.message || 'No emotion detected. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to detect emotion');
      if (err.message.includes('Authentication')) {
        handleLogout();
      }
    } finally {
      setIsDetecting(false);
    }
  };

  // Start camera when camera view is opened
  useEffect(() => {
    if (currentView === 'camera' && !stream) {
      startCamera();
    }
    
    // Cleanup when leaving camera view
    return () => {
      if (currentView !== 'camera') {
        stopCamera();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Login/Register View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Music className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">MoodMusic</h1>
          </div>
          
          {!showRegister ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="Enter your password"
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <p className="mt-4 text-center text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setShowRegister(true);
                    setError('');
                  }}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="Enter your password (min 6 characters)"
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
              <p className="mt-4 text-center text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setShowRegister(false);
                    setError('');
                  }}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Main App View (after authentication)
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
            <Music className="w-8 h-8" />
            <span className="text-2xl font-bold">MoodMusic</span>
          </div>
          <div className="flex gap-4 items-center">
            <button onClick={() => setCurrentView('home')} className="px-4 py-2 rounded-lg hover:bg-white/20 transition">
              Home
            </button>
            <button onClick={() => setCurrentView('search')} className="px-4 py-2 rounded-lg hover:bg-white/20 transition">
              Search
            </button>
            {spotifyLinked ? (
              <div className="px-4 py-2 rounded-lg bg-green-500/30 flex items-center gap-2">
                <Music2 className="w-4 h-4" />
                <span className="text-sm">Spotify Connected</span>
              </div>
            ) : (
              <button 
                onClick={async () => {
                  try {
                    await api.connectSpotify();
                  } catch (err) {
                    setError(err.message || 'Failed to connect Spotify');
                  }
                }} 
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition flex items-center gap-2"
              >
                <Music2 className="w-4 h-4" />
                Connect Spotify
              </button>
            )}
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg hover:bg-white/20 transition flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {error && (
        <div className="container mx-auto px-4 pt-4">
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {currentView === 'home' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              Music for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Mood</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover songs that match your emotions. Select how you're feeling and get personalized recommendations.
            </p>

            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">How are you feeling today?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {emotions.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => handleEmotionSelect(emotion)}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all transform hover:scale-105"
                  >
                    <div className="text-4xl mb-2">
                      {emotion === 'happy' && '😊'}
                      {emotion === 'sad' && '😢'}
                      {emotion === 'angry' && '😠'}
                      {emotion === 'neutral' && '😐'}
                      {emotion === 'surprise' && '😲'}
                      {emotion === 'fear' && '😨'}
                    </div>
                    <span className="text-lg font-medium capitalize text-gray-700">{emotion}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setCurrentView('camera')}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105"
              >
                <Camera className="w-5 h-5" />
                Detect Emotion via Camera
              </button>
              <button
                onClick={() => setCurrentView('search')}
                className="flex items-center gap-2 px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition"
              >
                <Search className="w-5 h-5" />
                Search Songs
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'language' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Your Language</h2>
            <p className="text-gray-600 mb-6">Choose your preferred language for music recommendations</p>
            
            <div className="text-center mb-6 p-4 bg-purple-100 rounded-lg">
              <span className="text-lg text-gray-700">Your mood: </span>
              <span className="text-2xl font-bold text-purple-600 capitalize">{detectedEmotion}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className="p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all font-medium text-lg"
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('home')}
              className="mt-6 w-full py-3 text-gray-600 hover:text-gray-800 transition"
            >
              ← Back to emotions
            </button>
          </div>
        </div>
      )}

      {currentView === 'camera' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <Camera className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Emotion Detection</h2>
              <p className="text-gray-600">
                Position your face in front of the camera and click "Detect Emotion"
              </p>
            </div>
            
            <div className="mb-6 relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              {stream ? (
                <video
                  ref={(el) => {
                    setVideoRef(el);
                    if (el && stream) {
                      el.srcObject = stream;
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center text-gray-400">
                    <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <p>Camera not started</p>
                  </div>
                </div>
              )}
              
              {detectedEmotionFromCamera && (
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-lg">
                  <div className="font-bold text-lg capitalize">{detectedEmotionFromCamera}</div>
                  {detectionConfidence && (
                    <div className="text-sm opacity-90">Confidence: {(detectionConfidence * 100).toFixed(0)}%</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              {!stream ? (
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Start Camera
                </button>
              ) : (
                <>
                  <button
                    onClick={captureAndDetect}
                    disabled={isDetecting}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 font-semibold"
                  >
                    {isDetecting ? 'Detecting...' : 'Detect Emotion'}
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                  >
                    Stop Camera
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  stopCamera();
                  setCurrentView('home');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'search' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 pt-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Search Songs</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for songs, artists, or albums..."
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Search Results</h3>
                <div className="space-y-4">
                  {recommendations.map((song, idx) => (
                    <div key={idx} className="p-4 border-2 border-gray-100 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800">{song.title}</h4>
                          <p className="text-gray-600">{song.artist}</p>
                          {song.album && <p className="text-sm text-gray-500 mt-1">Album: {song.album}</p>}
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {song.source || 'JioSaavn'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {song.url && (
                            <a href={song.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                          {song.spotifyUri && (
                            <a href={song.spotifyUri} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                          <button className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === 'recommendations' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 pt-20">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="animate-spin w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Finding perfect songs for you...</p>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Songs for {detectedEmotion} mood</h3>
                  {selectedLanguage && (
                    <span className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full font-medium">
                      {selectedLanguage}
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  {recommendations.map((song, idx) => (
                    <div key={idx} className="p-4 border-2 border-gray-100 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800">{song.title}</h4>
                          <p className="text-gray-600">{song.artist}</p>
                          {song.album && <p className="text-sm text-gray-500 mt-1">Album: {song.album}</p>}
                          <div className="flex gap-2 mt-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {song.source || 'JioSaavn'}
                            </span>
                            {song.language && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded">
                                {song.language}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {song.url && (
                            <a href={song.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                          {song.spotifyUri && (
                            <a href={song.spotifyUri} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                          <button className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setDetectedEmotion(null);
                    setSelectedLanguage('');
                    setRecommendations([]);
                  }}
                  className="mt-6 w-full py-3 text-purple-600 hover:text-purple-800 font-medium transition"
                >
                  ← Start Over
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                <p className="text-gray-600">No recommendations yet. Select an emotion to get started!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
