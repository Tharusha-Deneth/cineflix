import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// 👇 Firebase Config 👇
const firebaseConfig = {
  apiKey: "AIzaSyAfuAJn5pfVvsj_CHGjQT_PaOY2KzvMbnk",
  authDomain: "cineflix-71ade.firebaseapp.com",
  projectId: "cineflix-71ade",
  storageBucket: "cineflix-71ade.firebasestorage.app",
  messagingSenderId: "703022116674",
  appId: "1:703022116674:web:1ce08f947669eb668a62db"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 🔥 ADSTERRA DIRECT LINK 🔥
const ADSTERRA_DIRECT_LINK = "https://www.profitableratecpmnetwork.com/prw0pm5gz?key=1c776249816d480c305463fd75cb4f5f";

const API_KEY = "3f9d0029783ac3366e5706c0575f7170";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

// 🚀 SMART AD LOGIC (Mobile Return & Desktop Limits) 🚀
const triggerSmartAds = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const lastAdTime = localStorage.getItem('cineflix_last_ad_time');
  const now = new Date().getTime();
  
  // පැය 1ක් (මිලි තත්පර 3600000) යනකම් ආයේ Ads එන්නේ නෑ
  const canShowAd = !lastAdTime || (now - parseInt(lastAdTime)) > 3600000;

  if (canShowAd) {
    localStorage.setItem('cineflix_last_ad_time', now.toString());

    if (isMobile) {
      // Mobile: Open Ad in a new tab silently (doesn't force reload current tab)
      const windowName = 'adWindow' + Math.random();
      window.open(ADSTERRA_DIRECT_LINK, windowName);
    } else {
      // Desktop: Open 2 pop-under tabs securely
      const windowName1 = 'adWindow' + Math.random();
      const windowName2 = 'adWindow' + Math.random();
      
      const pop1 = window.open(ADSTERRA_DIRECT_LINK, windowName1, 'width=800,height=600');
      const pop2 = window.open(ADSTERRA_DIRECT_LINK, windowName2, 'width=800,height=600');

      if (pop1) pop1.blur();
      if (pop2) pop2.blur();
      window.focus();
    }
  }
};

const getInitialState = () => {
  const savedUser = localStorage.getItem('cineflix_current_user');
  const loginTime = localStorage.getItem('cineflix_login_time');
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  if (savedUser && loginTime && (new Date().getTime() - parseInt(loginTime, 10) < SEVEN_DAYS)) {
    return 'home'; 
  }
  return 'splash';
};

export default function App() {
  const [appState, setAppState] = useState(getInitialState());
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cineflix_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [hasAdBlock, setHasAdBlock] = useState(false);

  // 🛡️ ADBLOCK DETECTOR 🛡️
  useEffect(() => {
    const detectAdBlock = () => {
      const adTest = document.createElement('div');
      adTest.innerHTML = '&nbsp;';
      adTest.className = 'adsbox ad-placement doubleclick ad-placeholder';
      adTest.style.position = 'absolute';
      adTest.style.top = '-9999px';
      adTest.style.height = '10px';
      document.body.appendChild(adTest);

      setTimeout(() => {
        const isBlocked = adTest.offsetHeight === 0 || window.getComputedStyle(adTest).display === 'none';
        if (isBlocked) {
          setHasAdBlock(true);
        }
        adTest.remove();
      }, 500);
    };
    detectAdBlock();
  }, []);

  // Splash Screen Timer
  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => setAppState('login'), 7000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  if (hasAdBlock) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0b0b0b', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center', zIndex: 999999 }}>
        <div style={{ backgroundColor: '#181818', padding: '40px', borderRadius: '20px', boxShadow: '0 15px 50px rgba(229,9,20,0.3)', maxWidth: '500px' }}>
          <svg style={{ width: '80px', fill: '#E50914', marginBottom: '20px' }} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontFamily: "'Unbounded', sans-serif", marginBottom: '15px' }}>AdBlock Detected!</h1>
          <p style={{ color: '#b3b3b3', fontSize: '1rem', lineHeight: '1.6', marginBottom: '30px', fontFamily: "'Montserrat', sans-serif" }}>We use ads to keep Cineflix free for everyone. Please <b>disable your AdBlocker</b> or whitelist our site.</p>
          <button onClick={() => window.location.reload()} style={{ backgroundColor: '#E50914', color: '#fff', padding: '15px 30px', borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontFamily: "'Montserrat', sans-serif" }}>I have disabled it, Reload Page</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Unbounded:wght@700;900&family=Bebas+Neue&display=swap');
          html, body, #root { margin: 0 !important; padding: 0 !important; width: 100vw !important; max-width: 100vw !important; overflow-x: hidden !important; font-family: 'Montserrat', sans-serif; background-color: #0b0b0b; color: #ffffff; -webkit-tap-highlight-color: transparent; }
          * { box-sizing: border-box; }
          #netlify-badge, netlify-toolbar, iframe[title*="Netlify"], a[href^="https://www.netlify.com"] { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; width: 0 !important; height: 0 !important; }
        `}
      </style>
      {appState === 'splash' && <SplashScreen />}
      {(appState === 'login' || appState === 'signup') && <AuthScreen appState={appState} setAppState={setAppState} setUser={setUser} />}
      {appState === 'home' && <MovieApp user={user} setAppState={setAppState} setUser={setUser} />}
    </>
  );
}

function SplashScreen() {
  const letters = "CINEFLIX".split("");
  return (
    <div className="splash-container">
      <style>
        {`
          .splash-container { width: 100vw; height: 100vh; background-color: #000; display: flex; justify-content: center; align-items: center; perspective: 1000px; overflow: hidden; }
          .splash-title { display: flex; font-size: clamp(2.5rem, 8vw, 6rem); font-weight: 900; font-family: 'Unbounded', sans-serif; letter-spacing: clamp(4px, 1.5vw, 12px); transform-style: preserve-3d; }
          .cinematic-letter { display: inline-block; opacity: 0; color: #E50914; text-shadow: 0px 4px 15px rgba(229, 9, 20, 0.4); animation: cinematicSequence 6s forwards ease-in-out; }
          @keyframes cinematicSequence { 0% { opacity: 0; transform: translateZ(-300px) scale(0.5); } 15% { opacity: 1; transform: translateZ(0) scale(1); color: #E50914; text-shadow: 0px 4px 15px rgba(229, 9, 20, 0.5); } 30% { color: #E50914; transform: translateZ(0) scale(1); text-shadow: 0px 4px 15px rgba(229, 9, 20, 0.5); } 40% { color: #ffffff; transform: translateZ(50px) scale(1.1); text-shadow: 0 0 20px #ffffff, 0 0 40px #E50914, 0 0 60px #E50914; } 50% { color: #E50914; transform: translateZ(0) scale(1); text-shadow: 0px 4px 15px rgba(229, 9, 20, 0.5); } 70% { opacity: 1; transform: translateY(0) rotate(0deg); filter: blur(0); } 90% { opacity: 0; transform: translateY(150px) rotate(25deg) scale(0.8); filter: blur(12px); } 100% { opacity: 0; transform: translateY(200px); } }
        `}
      </style>
      <div className="splash-title">
        {letters.map((char, index) => <span key={index} className="cinematic-letter" style={{ animationDelay: `${index * 0.15}s` }}>{char}</span>)}
      </div>
    </div>
  );
}

function AuthScreen({ appState, setAppState, setUser }) {
  const isLogin = appState === 'login';
  const [showPass, setShowPass] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const sliderImages = [
    "https://image.tmdb.org/t/p/original/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    "https://image.tmdb.org/t/p/original/gKkl37BQuKTanygYQG1pyYgLVgf.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % sliderImages.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const saveSessionAndNavigate = (userData) => {
    localStorage.setItem('cineflix_current_user', JSON.stringify(userData));
    localStorage.setItem('cineflix_login_time', new Date().getTime().toString());
    setUser(userData);
    setAppState('home');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        saveSessionAndNavigate({ id: userCredential.user.uid, name: userCredential.user.displayName || email.split('@')[0], email: userCredential.user.email });
      } else {
        if (!fullName) { setErrorMsg("Full Name is required"); setLoading(false); return; }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        saveSessionAndNavigate({ id: userCredential.user.uid, name: fullName, email: userCredential.user.email });
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') setErrorMsg('Email is already registered. Please Log In.');
      else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') setErrorMsg('Invalid email or password.');
      else if (error.code === 'auth/weak-password') setErrorMsg('Password should be at least 6 characters.');
      else setErrorMsg(error.message);
    } finally { setLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      saveSessionAndNavigate({ id: result.user.uid, name: result.user.displayName || 'Google User', email: result.user.email });
    } catch (error) {
      setErrorMsg("Sign-in failed or cancelled.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper">
      <style>
        {`
          @import url('https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css');
          .auth-wrapper { background-color: #141414; width: 100vw; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 1rem; background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.95)), url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_large.jpg'); background-size: cover; background-position: center; }
          .login__container { background-color: #181818; box-shadow: 0 15px 50px rgba(0,0,0,0.9); padding: 2.2rem 1.5rem; border-radius: 1.75rem; display: grid; gap: 1.2rem; width: 100%; max-width: 440px; color: #ffffff; animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes slideDown { 0% { opacity: 0; transform: translateY(-40px); } 100% { opacity: 1; transform: translateY(0); } }
          .login__swiper { display: none; }
          .login__data { text-align: center; color: #ffffff; }
          .logo-title { font-family: 'Unbounded', sans-serif; font-size: clamp(1.8rem, 5vw, 2.2rem); font-weight: 900; color: #E50914; letter-spacing: 2px; margin-bottom: 0.25rem; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(229,9,20,0.4); }
          .login__title { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; }
          .login__description { font-size: 0.82rem; color: #b3b3b3; margin-bottom: 1.25rem; }
          .error-alert { background: rgba(229,9,20,0.15); border: 1px solid #E50914; color: #ff6b6b; padding: 10px; border-radius: 6px; font-size: 0.85rem; margin-bottom: 15px; text-align: center; }
          .google-btn-custom { width: 100%; padding: 0.85rem; border-radius: 0.5rem; font-weight: 600; background-color: #ffffff; color: #000000; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 0.95rem; transition: 0.3s; }
          .google-btn-custom:hover { background-color: #f1f1f1; box-shadow: 0 4px 15px rgba(255,255,255,0.2); }
          .login__line { position: relative; display: flex; justify-content: center; text-align: center; font-weight: 600; color: #777; font-size: 0.85rem; margin: 0.8rem 0; }
          .login__line::before, .login__line::after { content: ""; position: absolute; top: 50%; width: 35%; height: 1px; background-color: #333; }
          .login__line::before { right: 0; } .login__line::after { left: 0; }
          .login__box { position: relative; display: flex; align-items: center; margin-bottom: 0.85rem; }
          .login__input { width: 100%; background: #222; border: 1px solid #333; padding: 0.85rem 1rem; border-radius: 0.5rem; color: #fff; font-weight: 600; font-size: 0.95rem; transition: 0.3s; }
          .login__input::placeholder { color: #888; } .login__input:focus { border-color: #E50914; outline: none; background: #2a2a2a; }
          .login__box i { position: absolute; right: 1rem; font-size: 1.2rem; color: #aaa; } .login__eye { cursor: pointer; z-index: 10; }
          .login__forgot { display: block; text-align: right; font-size: 0.82rem; color: #b3b3b3; margin-bottom: 1.1rem; text-decoration: none; } .login__forgot:hover { color: #E50914; text-decoration: underline; }
          .login__button { width: 100%; padding: 0.85rem; border-radius: 0.5rem; font-weight: 600; background-color: #E50914; color: #fff; cursor: pointer; transition: 0.3s; border: none; font-size: 1rem; }
          .login__button:hover { background-color: #c90812; box-shadow: 0 4px 15px rgba(229,9,20,0.5); } .login__button:disabled { opacity: 0.6; cursor: not-allowed; }
          .login__switch { text-align: center; font-size: 0.85rem; color: #b3b3b3; margin-top: 1.1rem; } .login__sign { color: #E50914; font-weight: bold; cursor: pointer; margin-left: 5px; } .login__sign:hover { text-decoration: underline; }
          @media screen and (min-width: 1024px) {
            .login__container { grid-template-columns: 520px 380px; column-gap: 3.5rem; width: 1000px; max-width: 1050px; height: 640px; padding: 1.5rem 3rem 1.5rem 1.5rem; border-radius: 2.5rem; }
            .login__swiper { display: block; position: relative; height: 100%; border-radius: 2rem; overflow: hidden; background-color: #111; clip-path: path("M0 37.8182C0 16.9318 17.9784 0 40.156 0H481.843C504.902 0 523.224 18.2478 521.936 39.9306L486.273 580.294C485.083 600.328 467.487 616 446.18 616H40.156C17.9784 616 0 599.068 0 578.182V37.8182Z"); }
            .login__swiper-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; z-index: 1; transition: opacity 1.2s ease-in-out; } .login__swiper-img.active { opacity: 1; z-index: 2; }
            .slider-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%); z-index: 3; }
            .login__swiper-data { position: absolute; z-index: 10; color: #fff; left: 2.5rem; bottom: 3.5rem; } .login__swiper-subtitle { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; letter-spacing: 2px; text-transform: uppercase; color: #E50914; } .login__swiper-title { font-size: 1.6rem; font-family: "Unbounded", sans-serif; line-height: 1.3; text-shadow: 2px 2px 8px rgba(0,0,0,0.9); }
          }
        `}
      </style>
      <div className="login__container">
        <div className="login__swiper">
          <div className="slider-overlay"></div>
          {sliderImages.map((src, index) => <img key={index} src={src} alt="Backdrop" className={`login__swiper-img ${index === currentSlide ? 'active' : ''}`} />)}
          <div className="login__swiper-data">
            <p className="login__swiper-subtitle">Now Streaming</p><h1 className="login__swiper-title">Unlimited Movies <br /> & TV Shows</h1>
          </div>
        </div>
        <div className="login__area">
          <div className="login__data">
            <h2 className="logo-title">CINEFLIX</h2>
            <h1 className="login__title">{isLogin ? 'Welcome Back 👋' : 'Create Account 🚀'}</h1>
            <p className="login__description">Please enter your details to sign in.</p>
            <button type="button" className="google-btn-custom" onClick={handleGoogleSignIn} disabled={loading}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px' }} />
              {loading ? 'Processing...' : 'Sign in with Google'}
            </button>
          </div>
          <span className="login__line">or</span>
          {errorMsg && <div className="error-alert">{errorMsg}</div>}
          <form className="login__form" onSubmit={handleAuthSubmit}>
            {!isLogin && (
              <div className="login__box">
                <input type="text" placeholder="Full Name" className="login__input" value={fullName} onChange={(e) => setFullName(e.target.value)} required={!isLogin} />
                <i className="ri-user-line"></i>
              </div>
            )}
            <div className="login__box">
              <input type="email" placeholder="Email Address" className="login__input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <i className="ri-mail-line"></i>
            </div>
            <div className="login__box">
              <input type={showPass ? "text" : "password"} placeholder="Password" className="login__input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <i className={`ri-eye${showPass ? '-off' : ''}-line login__eye`} onClick={() => setShowPass(!showPass)}></i>
            </div>
            {isLogin && <a href="#" className="login__forgot">Forgot Password?</a>}
            <button type="submit" className="login__button" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
            </button>
          </form>
          <p className="login__switch">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span className="login__sign" onClick={() => { setAppState(isLogin ? 'signup' : 'login'); setErrorMsg(''); }}>{isLogin ? 'Sign Up' : 'Sign In'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// 3. MAIN MOVIE APP
function MovieApp({ user, setAppState, setUser }) {
  const [activeTab, setActiveTab] = useState('home');
  const [trending, setTrending] = useState([]);
  const [netflixOriginals, setNetflixOriginals] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [bannerMovie, setBannerMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [gridData, setGridData] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [singleTrailerKey, setSingleTrailerKey] = useState("");
  const [singleMovieDetails, setSingleMovieDetails] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  const [playingVideo, setPlayingVideo] = useState(null);
  const [activeServer, setActiveServer] = useState(1);

  const carouselRef = useRef(null);

  // Handle browser 'back' button explicitly so it doesn't reload the app
  useEffect(() => {
    const handlePopState = (e) => {
      // If a video is playing, close video instead of going back
      if (playingVideo) {
        e.preventDefault();
        setPlayingVideo(null);
        window.history.pushState(null, null, window.location.pathname);
      } 
      // If single movie view is open, close it instead of going back
      else if (selectedMovie) {
        e.preventDefault();
        setSelectedMovie(null);
        window.history.pushState(null, null, window.location.pathname);
      }
    };
    
    // Push a dummy state to history so we can catch the back button
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [playingVideo, selectedMovie]);

  useEffect(() => {
    if (activeTab !== 'home') return;
    const fetchHomeData = async () => {
      try {
        const [trendingRes, originalsRes, topRatedRes] = await Promise.all([
          fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`),
          fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`)
        ]);
        const trendingData = await trendingRes.json();
        const originalsData = await originalsRes.json();
        const topRatedData = await topRatedRes.json();
        setTrending(trendingData.results || []);
        setNetflixOriginals(originalsData.results || []);
        setTopRated(topRatedData.results || []);
        if (originalsData.results && originalsData.results.length > 0) {
          const randomMovie = originalsData.results[Math.floor(Math.random() * originalsData.results.length)];
          setBannerMovie(randomMovie);
          if (randomMovie?.id) {
            const videoRes = await fetch(`${BASE_URL}/tv/${randomMovie.id}/videos?api_key=${API_KEY}`);
            const videoData = await videoRes.json();
            const trailer = videoData.results?.find(vid => vid.type === "Trailer" || vid.type === "Teaser");
            if (trailer) setTrailerKey(trailer.key);
          }
        }
      } catch (error) { }
    };
    fetchHomeData();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'search' && searchQuery.length > 0) {
      const fetchSearch = async () => {
        const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${searchQuery}`);
        const data = await res.json();
        setSearchResults((data.results || []).filter(item => item.poster_path));
      };
      const timeoutId = setTimeout(() => fetchSearch(), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, activeTab]);

  useEffect(() => {
    const fetchGridData = async () => {
      let url = "";
      if (activeTab === 'tv') url = `${BASE_URL}/discover/tv?api_key=${API_KEY}`;
      else if (activeTab === 'movies') url = `${BASE_URL}/discover/movie?api_key=${API_KEY}`;
      else if (activeTab === 'trending') url = `${BASE_URL}/trending/all/day?api_key=${API_KEY}`;
      if (url) {
        const res = await fetch(url);
        const data = await res.json();
        setGridData(data.results || []);
      }
    };
    fetchGridData();
  }, [activeTab]);

  const openSingleMovie = async (movie) => {
    const type = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
    setSelectedMovie({ ...movie, media_type: type });
    setSingleTrailerKey("");
    setSingleMovieDetails(null);
    setSimilarMovies([]);
    try {
      const [detailsRes, videoRes, similarRes] = await Promise.all([
        fetch(`${BASE_URL}/${type}/${movie.id}?api_key=${API_KEY}`),
        fetch(`${BASE_URL}/${type}/${movie.id}/videos?api_key=${API_KEY}`),
        fetch(`${BASE_URL}/${type}/${movie.id}/similar?api_key=${API_KEY}`)
      ]);
      const detailsData = await detailsRes.json();
      const videoData = await videoRes.json();
      const similarData = await similarRes.json();
      setSingleMovieDetails(detailsData);
      setSimilarMovies((similarData.results || []).filter(item => item.poster_path));
      const trailer = videoData.results?.find(vid => vid.type === "Trailer") || videoData.results?.[0];
      if (trailer) setSingleTrailerKey(trailer.key);
    } catch (error) { }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.75;
      carouselRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cineflix_current_user');
    localStorage.removeItem('cineflix_login_time');
    setUser(null);
    setAppState('login');
  };

  const getEmbedUrl = (type, id, server) => {
    if (server === 1) return `https://vidsrc.to/embed/${type}/${id}`;
    if (server === 2) return `https://vidsrc.me/embed/${type}?tmdb=${id}`;
    if (server === 3) return `https://embed.su/embed/${type}/${id}`;
    return `https://vidsrc.to/embed/${type}/${id}`;
  };

  const handleWatchClick = (movie) => {
    triggerSmartAds(); 
    setPlayingVideo({ id: movie.id, type: movie.media_type || (movie.first_air_date ? 'tv' : 'movie') }); 
  };

  const handleDownloadClick = (e, movie) => {
    e.preventDefault();
    triggerSmartAds(); 
    window.location.href = `https://dl.vidsrc.vip/movie/${movie.id}`; 
  };

  // 🔥 FULL SCREEN VIDEO LOGIC WITH ORIENTATION LOCK 🔥
  const toggleFullScreen = async () => {
    const elem = document.getElementById("video-player-wrapper");
    if (!elem) return;

    if (!document.fullscreenElement) {
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
        
        // Force Landscape orientation on mobile when entering fullscreen
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile && screen.orientation && screen.orientation.lock) {
          try {
            await screen.orientation.lock("landscape");
          } catch (err) {
            console.log("Orientation lock failed or not supported:", err);
          }
        }
      } catch (err) {
        console.log("Error attempting to enable full-screen mode:", err.message);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      
      // Unlock orientation when exiting fullscreen
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    }
  };

  const closePlayer = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
    setPlayingVideo(null);
  };

  return (
    <div className="app-container">
      <style>
        {`
          .app-container { width: 100vw; min-height: 100vh; position: relative; background-color: #0b0b0b; color: #ffffff; padding-bottom: 70px; }
          .banner-contents { padding: 0 1.25rem 1.5rem 1.25rem; max-width: 600px; z-index: 10; position: relative; display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
          .user-badge { color: #E50914; font-weight: 700; font-size: 0.8rem; margin: 0 0 4px 0 !important; padding: 0 !important; text-transform: uppercase; letter-spacing: 1px; }
          .banner-title { font-size: clamp(1.8rem, 6vw, 3.5rem); font-weight: 800; margin: 0 0 8px 0 !important; padding: 0 !important; text-transform: uppercase; line-height: 1.15; text-shadow: 2px 2px 6px rgba(0,0,0,0.8); }
          .banner-description { font-size: 0.88rem; line-height: 1.4; margin: 0 0 16px 0 !important; padding: 0 !important; color: #d0d0d0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          .banner-buttons { display: flex; gap: 12px; margin: 0 !important; padding: 0 !important;}

          .mobile-header { position: fixed; top: 0; left: 0; width: 100%; height: 60px; background: linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%); display: flex; align-items: center; justify-content: space-between; padding: 0 1.25rem; z-index: 100; }
          .mobile-logo { font-family: 'Unbounded', sans-serif; font-size: 1.3rem; font-weight: 900; color: #E50914; letter-spacing: 1px; }
          .sidebar { display: none; }
          .bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; height: 60px; background-color: rgba(18, 18, 18, 0.95); backdrop-filter: blur(10px); border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-around; align-items: center; z-index: 200; }
          .nav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #888; font-size: 0.7rem; font-weight: 600; cursor: pointer; gap: 3px; transition: 0.2s; }
          .nav-item.active { color: #E50914; } .nav-icon { width: 22px; height: 22px; fill: currentColor; }
          .main-content { width: 100%; position: relative; min-height: 100vh; } .page-content { padding: 70px 1rem 2rem 1rem; }
          .banner { width: 100%; height: 70vh; position: relative; display: flex; align-items: flex-end; overflow: hidden; }
          .banner-bg-wrapper { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; z-index: 1; background-color: #000; }
          .banner-image { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
          .banner-video { width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
          .banner-fadeLeft { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, rgba(11,11,11,0.9) 0%, rgba(11,11,11,0.2) 60%, transparent 100%); z-index: 2; }
          .banner-fadeBottom { position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(180deg, transparent 0%, rgba(11,11,11,0.85) 60%, #0b0b0b 100%); z-index: 2; }
          .banner-button { cursor: pointer; font-weight: bold; font-size: 0.95rem; border-radius: 6px; padding: 8px 22px; border: none; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
          .play-btn { background-color: #E50914; color: #ffffff; } .play-btn:hover { background-color: #c90812; transform: scale(1.03); }
          .rows-container { margin-top: -10px; position: relative; z-index: 20; padding: 0 0 2rem 1.25rem; }
          .row { margin-bottom: 30px; } .row h2 { font-size: 1.15rem; margin-bottom: 12px; font-weight: 700; color: #e5e5e5; }
          .row-posters { display: flex; overflow-y: visible; overflow-x: auto; gap: 18px; scroll-behavior: smooth; padding: 25px 1.25rem 25px 0; -webkit-overflow-scrolling: touch; } .row-posters::-webkit-scrollbar { display: none; }
          
          /* TOUCH ZOOM HOVER & ACTIVE */
          .row-poster { width: clamp(110px, 30vw, 160px); height: clamp(165px, 45vw, 240px); object-fit: cover; border-radius: 10px; cursor: pointer; flex-shrink: 0; box-shadow: 0 6px 15px rgba(0,0,0,0.6); transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.3s ease; }
          .row-poster:hover, .row-poster:active { transform: scale(1.15); z-index: 30; box-shadow: 0 16px 35px rgba(0,0,0,0.95), 0 0 20px rgba(229, 9, 20, 0.5); border: 2px solid #E50914;}
          
          .search-header { display: flex; justify-content: center; align-items: center; margin-top: 20px; margin-bottom: 40px; width: 100%; }
          .search-input-wrapper { position: relative; width: 100%; max-width: 650px; }
          .search-input { width: 100%; padding: 18px 25px 18px 55px; background: rgba(30, 30, 30, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 50px; color: #fff; font-size: 1.1rem; font-weight: 500; outline: none; backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); transition: all 0.3s ease; font-family: 'Montserrat', sans-serif; }
          .search-input::placeholder { color: #888; font-weight: 400; }
          .search-input:focus { border-color: #E50914; background: rgba(40, 40, 40, 0.95); box-shadow: 0 8px 32px rgba(229, 9, 20, 0.25); }
          .search-icon-inside { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 22px; height: 22px; fill: #888; pointer-events: none; transition: fill 0.3s ease; }
          .search-input:focus + .search-icon-inside { fill: #E50914; }

          .showcase-view { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #0b0b0b; z-index: 500; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; justify-content: space-between; animation: fadeIn 0.4s ease-out; }
          .showcase-bg-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
          .showcase-bg-video { width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; opacity: 0.85; }
          .showcase-bg-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.75; }
          .showcase-gradient-left { position: absolute; top: 0; left: 0; width: 65%; height: 100%; background: linear-gradient(90deg, #0b0b0be6 0%, #0b0b0bcc 50%, transparent 100%); z-index: 2; }
          .showcase-gradient-bottom { position: absolute; bottom: 0; left: 0; width: 100%; height: 75%; background: linear-gradient(180deg, transparent 0%, #0b0b0bcc 40%, #0b0b0b 100%); z-index: 2; }
          .showcase-topbar { position: relative; z-index: 10; display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2.5rem; width: 100%; }
          .showcase-logo { font-family: 'Unbounded', sans-serif; font-size: 1.5rem; font-weight: 900; color: #E50914; letter-spacing: 2px; }
          .showcase-close-btn { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.25); border-radius: 50%; width: 44px; height: 44px; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); transition: 0.2s; }
          .showcase-close-btn:hover { background: #E50914; border-color: #E50914; transform: scale(1.1); }
          
          /* FIXED: Showcase perfectly left aligned */
          .showcase-body { position: relative; z-index: 10; padding: 1rem 2.5rem; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; text-align: left; max-width: 650px; }
          .showcase-huge-title { font-family: 'Bebas Neue', 'Unbounded', sans-serif; font-size: clamp(3rem, 9vw, 6rem); line-height: 0.95; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 10px 0 !important; padding: 0 !important; text-shadow: 0 4px 20px rgba(0,0,0,0.9); }
          .showcase-tagline { font-size: clamp(0.9rem, 2vw, 1.25rem); font-weight: 800; letter-spacing: 3px; color: #ffffff; text-transform: uppercase; margin: 0 0 12px 0 !important; padding: 0 !important; }
          .showcase-metadata { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; font-size: 0.88rem; color: #cfcfcf; margin: 0 0 15px 0 !important; padding: 0 !important; font-weight: 600; }
          .stars-rating { color: #E50914; font-size: 1rem; letter-spacing: 2px; }
          .showcase-overview { font-size: 0.95rem; line-height: 1.6; color: #b8b8b8; margin: 0 0 25px 0 !important; padding: 0 !important; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
          .showcase-buttons { display: flex; gap: 14px; margin: 0 0 1.5rem 0 !important; padding: 0 !important; }
          
          .btn-red-play { background-color: #E50914; color: #ffffff; padding: 12px 32px; font-size: 1rem; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.2s; }
          .btn-red-play:hover { background-color: #f40612; transform: scale(1.04); }
          .btn-gray-download { background-color: rgba(255,255,255,0.18); color: #ffffff; padding: 12px 28px; font-size: 1rem; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.2s; text-decoration: none; backdrop-filter: blur(8px); }
          .btn-gray-download:hover { background-color: rgba(255,255,255,0.28); transform: scale(1.04); }
          
          .showcase-bottom-carousel { position: relative; z-index: 10; padding: 1rem 2.5rem 2rem 2.5rem; width: 100%; }
          .showcase-carousel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
          .showcase-carousel-title { font-size: 1.1rem; font-weight: 700; color: #eaeaea; }
          .carousel-arrows { display: flex; gap: 10px; }
          .arrow-btn { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); color: white; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
          .arrow-btn:hover { background: #E50914; border-color: #E50914; }
          .showcase-cards-scroll { display: flex; gap: 16px; overflow-x: auto; overflow-y: visible; scroll-behavior: smooth; padding: 20px 0; -webkit-overflow-scrolling: touch; } .showcase-cards-scroll::-webkit-scrollbar { display: none; }
          .showcase-card { width: clamp(110px, 14vw, 150px); height: clamp(160px, 20vw, 210px); border-radius: 12px; object-fit: cover; flex-shrink: 0; cursor: pointer; border: 2px solid rgba(255,255,255,0.12); box-shadow: 0 8px 20px rgba(0,0,0,0.8); transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), border-color 0.3s ease; }
          .showcase-card:hover { transform: scale(1.25); z-index: 40; border-color: #E50914; box-shadow: 0 16px 35px rgba(0,0,0,0.95), 0 0 20px rgba(229, 9, 20, 0.6); }

          /* 🔥 FIXED: FLOATING PLAYER & SERVER TABS 🔥 */
          .fullscreen-player { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #000; z-index: 9999; }
          
          /* IMPORTANT: Disable pointer events on the iframe wrapper itself to avoid Vidsrc stealing clicks on the edges */
          .player-iframe-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 9998; }
          .player-iframe { width: 100%; height: 100%; border: none; background-color: #000; pointer-events: auto; }
          
          /* Overlay layer specifically to capture back button actions effectively */
          .player-controls-overlay {
            position: absolute; bottom: 20px; right: 20px; z-index: 10000;
            display: flex; align-items: center; gap: 15px;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(10px);
            padding: 8px 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
            transition: opacity 0.3s;
          }
          .player-controls-overlay:hover { opacity: 1; }
          .server-selector { display: flex; gap: 8px; align-items: center; }
          .server-btn { background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 5px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; cursor: pointer; transition: 0.2s; }
          .server-btn.active { background: #E50914; border-color: #E50914; box-shadow: 0 0 10px rgba(229, 9, 20, 0.5); }
          .close-player-btn, .fullscreen-btn { background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 34px; height: 34px; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
          .close-player-btn:hover, .fullscreen-btn:hover { background: #E50914; transform: scale(1.1); }

          /* 🔥 MOBILE SPECIFIC OPTIMIZATIONS 🔥 */
          @media screen and (max-width: 768px) {
            /* Reduce showcase text size */
            .showcase-huge-title { font-size: 1.8rem !important; margin-bottom: 5px !important;}
            .showcase-tagline { font-size: 0.8rem !important; margin-bottom: 5px !important; }
            .showcase-metadata { font-size: 0.75rem !important; gap: 8px !important; margin-bottom: 8px !important; }
            .showcase-overview { font-size: 0.85rem !important; -webkit-line-clamp: 2 !important; margin-bottom: 12px !important; }
            .btn-red-play, .btn-gray-download { padding: 6px 15px !important; font-size: 0.85rem !important; }
            
            /* Move "More Like This" UP to fit on screen */
            .showcase-body { padding: 0.5rem 1.5rem !important; justify-content: flex-start !important; margin-top: 30vh; }
            .showcase-bottom-carousel { padding: 0.5rem 1.5rem 1rem 1.5rem !important; margin-top: -10px; }
            .showcase-carousel-title { font-size: 0.95rem !important; }
            .showcase-card { width: 85px !important; height: 125px !important; }
            
            /* Make controls smaller on mobile */
            .player-controls-overlay { bottom: 10px; right: 10px; padding: 6px 10px; gap: 10px; }
            .server-btn { padding: 4px 8px; font-size: 0.75rem; }
            .close-player-btn, .fullscreen-btn { width: 30px; height: 30px; font-size: 16px; }
          }

          @media screen and (min-width: 900px) {
            .app-container { padding-bottom: 0; } .mobile-header, .bottom-nav { display: none; }
            .sidebar { display: flex; position: fixed; top: 0; left: 0; width: 80px; height: 100vh; background: linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%); flex-direction: column; align-items: center; padding-top: 30px; gap: 40px; z-index: 200; }
            .sidebar .nav-icon { width: 26px; height: 26px; fill: #b3b3b3; cursor: pointer; } .sidebar .nav-icon:hover { fill: white; transform: scale(1.1); } .sidebar .nav-icon.active { fill: white; border-bottom: 2px solid #E50914; padding-bottom: 5px; }
            .main-content { padding-left: 80px; } .page-content { padding: 40px 40px 40px 10px; }
            .banner { height: 85vh; align-items: center; } .banner-fadeLeft { width: 45%; } .banner-fadeBottom { height: 35%; } .banner-contents { margin-left: 20px; padding: 0; } .banner-description { -webkit-line-clamp: 3; font-size: 1.05rem; } .banner-button { font-size: 1.05rem; padding: 10px 28px; } .rows-container { margin-top: -80px; padding-left: 20px; }
          }
        `}
      </style>

      <header className="mobile-header">
        <span className="mobile-logo">CINEFLIX</span>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <svg onClick={() => setActiveTab('search')} style={{ width: '22px', height: '22px', fill: '#fff', cursor: 'pointer' }} viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
          <svg onClick={handleLogout} style={{ width: '22px', height: '22px', fill: '#E50914', cursor: 'pointer' }} viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z" /></svg>
        </div>
      </header>

      <nav className="sidebar">
        <svg onClick={() => setActiveTab('search')} className={`nav-icon ${activeTab === 'search' ? 'active' : ''}`} viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
        <svg onClick={() => setActiveTab('home')} className={`nav-icon ${activeTab === 'home' ? 'active' : ''}`} viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
        <svg onClick={() => setActiveTab('tv')} className={`nav-icon ${activeTab === 'tv' ? 'active' : ''}`} viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" /></svg>
        <svg onClick={() => setActiveTab('movies')} className={`nav-icon ${activeTab === 'movies' ? 'active' : ''}`} viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2z" /></svg>
        <svg onClick={() => setActiveTab('trending')} className={`nav-icon ${activeTab === 'trending' ? 'active' : ''}`} viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" /></svg>
        <div style={{ marginTop: 'auto', marginBottom: '20px' }}><svg onClick={handleLogout} className="nav-icon" title="Logout" style={{ fill: '#E50914' }} viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z" /></svg></div>
      </nav>

      <div className="bottom-nav">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><svg className="nav-icon" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg><span>Home</span></div>
        <div className={`nav-item ${activeTab === 'tv' ? 'active' : ''}`} onClick={() => setActiveTab('tv')}><svg className="nav-icon" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" /></svg><span>TV Shows</span></div>
        <div className={`nav-item ${activeTab === 'movies' ? 'active' : ''}`} onClick={() => setActiveTab('movies')}><svg className="nav-icon" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2z" /></svg><span>Movies</span></div>
        <div className={`nav-item ${activeTab === 'trending' ? 'active' : ''}`} onClick={() => setActiveTab('trending')}><svg className="nav-icon" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" /></svg><span>Trending</span></div>
      </div>

      <main className="main-content">
        {activeTab === 'home' && (
          <>
            <header className="banner">
              <div className="banner-bg-wrapper">
                {trailerKey ? <iframe className="banner-video" src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playlist=${trailerKey}`} frameBorder="0" allow="autoplay" /> : <img className="banner-image" src={`${IMAGE_BASE_URL}${bannerMovie?.backdrop_path}`} alt="Banner" />}
              </div>
              <div className="banner-fadeLeft" />
              <div className="banner-fadeBottom" />
              <div className="banner-contents">
                {user && <div className="user-badge">👋 Welcome, {user.name}</div>}
                <h1 className="banner-title">{bannerMovie?.title || bannerMovie?.name || "MONEY HEIST"}</h1>
                <p className="banner-description">{bannerMovie?.overview}</p>
                <div className="banner-buttons">
                  <button className="banner-button play-btn" onClick={() => openSingleMovie(bannerMovie)}><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg> View Info</button>
                </div>
              </div>
            </header>
            <div className="rows-container">
              <div className="row"><h2>New this week</h2><div className="row-posters">{trending.map(movie => movie.poster_path && <img key={movie.id} onClick={() => openSingleMovie(movie)} className="row-poster" src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.name} />)}</div></div>
              <div className="row"><h2>Netflix Originals</h2><div className="row-posters">{netflixOriginals.map(movie => movie.poster_path && <img key={movie.id} onClick={() => openSingleMovie(movie)} className="row-poster" src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.name} />)}</div></div>
              <div className="row"><h2>Top Rated</h2><div className="row-posters">{topRated.map(movie => movie.poster_path && <img key={movie.id} onClick={() => openSingleMovie(movie)} className="row-poster" src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />)}</div></div>
            </div>
          </>
        )}
        {activeTab === 'search' && (
          <div className="page-content">
            <div className="search-header">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search movies, TV shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <svg className="search-icon-inside" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </div>
            </div>
            <div className="movies-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
              {searchResults.map(movie => movie.poster_path && (
                <img key={movie.id} onClick={() => openSingleMovie(movie)} className="row-poster" src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.name} style={{ width: '100%', height: '200px' }} />
              ))}
            </div>
          </div>
        )}
        {['tv', 'movies', 'trending'].includes(activeTab) && (
          <div className="page-content">
            <h1 style={{ fontSize: '1.6rem', marginBottom: '20px', fontWeight: 'bold' }}>{activeTab === 'tv' ? 'TV Shows' : activeTab === 'movies' ? 'Movies' : 'Trending Now'}</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>{gridData.map(movie => movie.poster_path && <img key={movie.id} onClick={() => openSingleMovie(movie)} className="row-poster" src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.name} style={{ width: '100%', height: '200px' }} />)}</div>
          </div>
        )}
      </main>

      {selectedMovie && (
        <div className="showcase-view">
          <div className="showcase-bg-wrapper">
            {singleTrailerKey ? <iframe className="showcase-bg-video" src={`https://www.youtube.com/embed/${singleTrailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playlist=${singleTrailerKey}`} frameBorder="0" allow="autoplay" /> : <img className="showcase-bg-img" src={`${IMAGE_BASE_URL}${selectedMovie.backdrop_path || selectedMovie.poster_path}`} alt="Backdrop" />}
            <div className="showcase-gradient-left" />
            <div className="showcase-gradient-bottom" />
          </div>
          <div className="showcase-topbar">
            <span className="showcase-logo">CINEFLIX</span>
            <button className="showcase-close-btn" onClick={() => setSelectedMovie(null)}>✕</button>
          </div>
          <div className="showcase-body">
            <h1 className="showcase-huge-title">{selectedMovie.title || selectedMovie.name}</h1>
            {singleMovieDetails?.tagline && <div className="showcase-tagline">{singleMovieDetails.tagline}</div>}
            <div className="showcase-metadata">
              <span className="stars-rating">★★★★★</span>
              <span>{selectedMovie.release_date ? selectedMovie.release_date.split('-')[0] : (selectedMovie.first_air_date ? selectedMovie.first_air_date.split('-')[0] : '2024')}</span>
              <span>{singleMovieDetails?.genres?.map(g => g.name).slice(0, 3).join(', ') || 'Action, Drama'}</span>
              <span>{singleMovieDetails?.runtime ? `${Math.floor(singleMovieDetails.runtime / 60)}h ${singleMovieDetails.runtime % 60}min` : '2h 15min'}</span>
            </div>
            <p className="showcase-overview">{selectedMovie.overview}</p>
            <div className="showcase-buttons">
              <button className="btn-red-play" onClick={() => handleWatchClick(selectedMovie)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg> Play
              </button>
              <a href="#" className="btn-gray-download" onClick={(e) => handleDownloadClick(e, selectedMovie)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg> Download
              </a>
            </div>
          </div>
          <div className="showcase-bottom-carousel">
            <div className="showcase-carousel-header">
              <span className="showcase-carousel-title">More Like This</span>
              <div className="carousel-arrows">
                <button className="arrow-btn" onClick={() => scrollCarousel('left')}>‹</button>
                <button className="arrow-btn" onClick={() => scrollCarousel('right')}>›</button>
              </div>
            </div>
            <div className="showcase-cards-scroll" ref={carouselRef}>
              {(similarMovies.length > 0 ? similarMovies : trending).map((m) => m.poster_path && <img key={m.id} src={`${IMAGE_BASE_URL}${m.poster_path}`} alt={m.title || m.name} className="showcase-card" onClick={() => openSingleMovie(m)} />)}
            </div>
          </div>
        </div>
      )}

      {playingVideo && (
        <div className="fullscreen-player" id="video-player-wrapper">
          {/* 🔥 Vidsrc iframe wrapped to prevent external ad-clicks breaking our app 🔥 */}
          <div className="player-iframe-wrapper">
            <iframe className="player-iframe" src={getEmbedUrl(playingVideo.type, playingVideo.id, activeServer)} allowFullScreen frameBorder="0" />
          </div>

          <div className="player-controls-overlay">
            <div className="server-selector">
              <span style={{ fontSize: '0.85rem', color: '#fff', marginRight: '5px', fontWeight: 'bold' }}>Server:</span>
              <button className={`server-btn ${activeServer === 1 ? 'active' : ''}`} onClick={() => setActiveServer(1)}>1</button>
              <button className={`server-btn ${activeServer === 2 ? 'active' : ''}`} onClick={() => setActiveServer(2)}>2</button>
              <button className={`server-btn ${activeServer === 3 ? 'active' : ''}`} onClick={() => setActiveServer(3)}>3</button>
            </div>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
            
            <button className="fullscreen-btn" onClick={toggleFullScreen} style={{ marginRight: '5px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
            </button>
            
            <button className="close-player-btn" onClick={closePlayer}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}