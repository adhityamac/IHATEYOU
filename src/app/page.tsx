'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Gamepad2, RefreshCw, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/shared/GradientThemeProvider';
import { useThemeMode } from '@/contexts/ThemeModeContext';
import { useSignals } from '@/hooks/useSignals';
import { Section } from '@/types/types';
import Dock from '@/components/shared/Dock';
import Dashboard from '@/components/shared/Dashboard';
import MessagesSectionWrapper from '@/features/chat/components/MessagesSectionWrapper';
import SoulGuide from '@/features/wellness/components/SoulGuide';

import SettingsSection from '@/components/shared/SettingsSection';
import FunZone from '@/features/games/components/FunZone';
import RetroMusicPlayer from '@/features/games/components/RetroMusicPlayer';
import LoadingScreen from '@/features/auth/components/LoadingScreen';
import SplashScreen from '@/features/auth/components/SplashScreen';
import WelcomeScreen from '@/features/auth/components/WelcomeScreen';
import AuthScreen from '@/features/auth/components/AuthScreen';
import OnboardingFlow from '@/features/auth/components/OnboardingFlow';
import LiquidBackground from '@/components/backgrounds/LiquidBackground';
import Photobooth from '@/features/camera/components/Photobooth';
import LightBackground from '@/components/backgrounds/LightBackground';
import RetroBackground from '@/components/backgrounds/RetroBackground';
import RetroMinimalBackground from '@/components/backgrounds/RetroMinimalBackground';
import RetroCoupleBackground from '@/components/backgrounds/RetroCoupleBackground';

import InteractiveGrid from '@/components/backgrounds/InteractiveGrid';
import EmotionalCheckIn from '@/features/wellness/components/EmotionalCheckIn';
import ScrollProgress from '@/components/ui/ScrollProgress';
import NeuralNotifications from '@/components/shared/NeuralNotifications';
import DynamicInfoBox from '@/components/ui/DynamicInfoBox';
import { Conversation, Message, User } from '@/types/types';

import PlayButton from '@/components/ui/PlayButton';
// import DayNightToggle from '@/components/ui/DayNightToggle';

// Mock Data
const mockUsers: User[] = [
  {
    id: 'user-2',
    name: 'Luna',
    username: 'Luna',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    isOnline: true
  },
  {
    id: 'user-3',
    name: 'Ghost',
    username: 'Ghost',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ghost',
    isOnline: false
  },
];

const createMockMessages = (userId: string): Message[] => [
  {
    id: 'm1',
    senderId: userId,
    content: 'Have you felt the shift in the digital wind?',
    timestamp: new Date(Date.now() - 3600000),
    isRead: true,
    size: 'small',
    reactions: []
  },
  {
    id: 'm2',
    senderId: 'user-1',
    content: 'Every day. It resonates.',
    timestamp: new Date(Date.now() - 1800000),
    isRead: true,
    size: 'small',
    reactions: []
  },
];



const INITIAL_POSTS = [
  { id: 1, user: 'You', content: 'Just synced my neural core. Feeling balanced. 💎', time: '1m', color: 'from-rose-500 to-orange-500', echoes: 42, replies: 3 },
  { id: 2, user: 'Luna', content: 'The silence here is loud today. 🌌', time: '5m', color: 'from-purple-500 to-blue-500', echoes: 124, replies: 12 },
  { id: 3, user: 'Ghost', content: 'Echoes of a digital past. Who else still feels it?', time: '15m', color: 'from-pink-500 to-rose-500', echoes: 89, replies: 5 },
  { id: 4, user: 'VoidWalker', content: 'Scanning the frequency... resonance detected at 42Hz.', time: '1h', color: 'from-cyan-500 to-emerald-500', echoes: 432, replies: 45 }
];

export default function Home() {
  const { user, loading: authLoading, setUser, completeOnboarding } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { mode } = useThemeMode();
  const isRetro = mode === 'retro-soul';

  // const { state: emotionalState, decision: algoDecision } = useAlgorithm(currentUserId);

  const [activeSection, setActiveSection] = useState<Section>('home');
  const [showFunZone, setShowFunZone] = useState(false);
  const { theme } = useTheme();
  const [showHeader, setShowHeader] = useState(true);
  const [showDock, setShowDock] = useState(true);
  const [hasNewGames, setHasNewGames] = useState(true);
  const lastScrollY = useRef(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullProgress, setPullProgress] = useState(0);
  const dashboardRef = useRef<HTMLDivElement>(null);


  // Debug: Log theme changes to console
  useEffect(() => {
    console.log('🎨 Current Active Theme:', theme);
  }, [theme]);

  const [feedPosts] = useState(INITIAL_POSTS);

  // No auto-dismiss for Welcome Screen
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowSplash(false);
  //   }, 2000);
  //   return () => clearTimeout(timer);
  // }, []);

  // Handle loading screen
  useEffect(() => {
    if (!authLoading && showLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [authLoading, showLoading]);

  // Check if user needs onboarding
  useEffect(() => {
    if (user && !user.onboardingComplete && !showSplash && !showLoading) {
      setShowOnboarding(true);
    }
  }, [user, showSplash, showLoading]);

  const handleAuthSuccess = (userData: any) => {
    // Manually update context if not handled by Firebase listener (e.g. Ghost Mode)
    if (userData.authMethod === 'ghost') {
      setUser(userData);
    }
  };

  const handleOnboardingComplete = async (data: any) => {
    await completeOnboarding(data);
    setShowOnboarding(false);
  };

  // Intelligent Header & Dock Hide/Show
  const handleScroll = (e: any) => {
    const currentScrollY = e.target.scrollTop || window.scrollY || 0;

    // Smooth threshold logic
    if (Math.abs(currentScrollY - lastScrollY.current) < 10) return;

    if (currentScrollY > lastScrollY.current && currentScrollY > 20) {
      setShowHeader(false); // Scrolling down - hide UI
      setShowDock(false);
    } else if (currentScrollY < lastScrollY.current || currentScrollY < 20) {
      setShowHeader(true);  // Scrolling up - show UI
      // In Camera mode, strictly keep dock hidden unless hovered (handled by Dock component)
      // or force user to scroll up?
      // Actually, better to just let hover handle it in camera mode.
      if (activeSection === 'camera') {
        setShowDock(false);
      } else {
        setShowDock(true);
      }
    }
    lastScrollY.current = currentScrollY;
  };

  // Auto-hide Dock when entering Camera mode
  useEffect(() => {
    if (activeSection === 'camera') {
      setShowDock(false);
      setShowHeader(false); // Immersive mode
    } else {
      setShowDock(true);
      setShowHeader(true);
    }
  }, [activeSection]);

  // Pull to Refresh Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (dashboardRef.current?.scrollTop === 0) {
      setPullStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY > 0) {
      const pull = e.touches[0].clientY - pullStartY;
      if (pull > 0) {
        setPullProgress(Math.min(pull * 0.5, 100));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullProgress > 60) {
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
        setPullProgress(0);
      }, 1500);
    } else {
      setPullProgress(0);
    }
    setPullStartY(0);
  };

  return (
    <div className={`min-h-screen text-white relative overflow-hidden font-sans selection:bg-purple-500/30 ${isRetro ? 'bg-[#422006] font-vt323' : 'bg-black'}`}>

      {/* Global Theme Toggle */}
      <div className="fixed top-0 right-4 z-[200]">
        {/* <DayNightToggle /> */}
      </div>

      {/* 1. Welcome Screen */}
      <AnimatePresence>
        {showSplash && <WelcomeScreen onEnter={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* 2. Loading Screen */}
      {!showSplash && (authLoading || showLoading) && (
        <LoadingScreen message={authLoading ? "Accessing Core..." : "Loading Experience..."} />
      )}

      {/* 3. Auth Screen */}
      {!showSplash && !authLoading && !showLoading && !user && (
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      )}

      {/* 4. Main App */}
      {!showSplash && !authLoading && !showLoading && user && (
        <>
          <AnimatePresence>
            {showOnboarding && (
              <OnboardingFlow onComplete={handleOnboardingComplete} userName={user.name} />
            )}
          </AnimatePresence>

          {/* Dynamic Background */}
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 -z-10"
            >
              {theme === 'liquid' ? (
                <LiquidBackground />
              ) : theme === 'light' ? (
                <LightBackground />
              ) : theme === 'retro' ? (
                <RetroBackground />
              ) : theme === 'retro-minimal' ? (
                <RetroMinimalBackground />
              ) : theme === 'retro-couple' ? (
                <RetroCoupleBackground />
              ) : (
                <InteractiveGrid />
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {showFunZone && <FunZone onClose={() => setShowFunZone(false)} />}
          </AnimatePresence>

          <div className={`transition-all duration-500 h-screen w-full ${isRetro ? 'p-4 md:p-8 bg-[#422006]' : ''}`}>
            <div className={`flex flex-col h-full overflow-hidden relative transition-all duration-500 ${isRetro
              ? 'bg-[#fef9c3] rounded-2xl border-8 border-[#854d0e] shadow-[inset_0_0_40px_rgba(66,32,6,0.1)]'
              : ''
              }`}>

              {/* Header */}
              <AnimatePresence>
                {showHeader && (
                  <motion.header
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                    className={`fixed top-0 left-0 right-0 z-[100] h-24 px-8 flex items-center justify-between pointer-events-none ${isRetro ? 'top-4 md:top-8 left-4 right-4 md:left-8 md:right-8 w-auto rounded-t-xl bg-[#fef9c3] border-b-4 border-[#eab308]' : ''
                      }`}
                  >
                    {!isRetro && (
                      <>
                        <div className="absolute inset-0 glass-premium opacity-90 border-b border-white/5 pointer-events-auto" />
                        <div className="noise-overlay opacity-[0.02] pointer-events-none" />
                      </>
                    )}

                    <div className="flex items-center gap-6 pointer-events-auto relative z-10">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h1 className={`text-xl font-black uppercase tracking-tighter ${isRetro ? 'text-[#422006] italic' : 'italic text-white'}`}>
                            Neural Core
                          </h1>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`text-[8px] font-black uppercase tracking-[0.4em] ${isRetro ? 'text-[#854d0e]' : 'text-white/20'}`}>Section:</span>
                          <motion.span
                            key={activeSection}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-[8px] font-black uppercase tracking-[0.4em] glitch-text-sm ${isRetro ? 'text-[#422006]' : 'text-white/40'}`}
                          >
                            {activeSection}
                          </motion.span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:flex items-center pointer-events-auto relative z-10">
                      <DynamicInfoBox />
                    </div>

                    <div className="flex items-center gap-3 pointer-events-auto relative z-10">
                      <PlayButton
                        onClick={() => {
                          setShowFunZone(true);
                          setHasNewGames(false);
                        }}
                      />



                      <button
                        aria-label="Settings"
                        onClick={() => setActiveSection('settings')}
                        className={`group relative w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${isRetro
                          ? 'bg-[#eab308] border-[#422006] hover:bg-[#fde047]'
                          : 'bg-white/5 border-white/10 text-white'
                          }`}
                      >
                        <Settings className={`w-4 h-4 opacity-50 group-hover:opacity-100 transition-all group-hover:rotate-90 duration-500 ${isRetro ? 'text-[#422006]' : ''}`} />
                      </button>
                    </div>
                  </motion.header>
                )}
              </AnimatePresence>

              {/* Main Content */}
              <main className="flex-1 relative flex flex-col overflow-hidden">
                {/* Global Overlays */}
                {!isRetro && (
                  <>
                    <NeuralNotifications />
                    <div className="fixed inset-0 pointer-events-none z-[300] opacity-[0.03] overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50" />
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
                    </div>
                  </>
                )}

                {/* RETRO SPECIFIC OVERLAY */}
                {isRetro && (
                  <div className="absolute inset-0 pointer-events-none z-[300] overflow-hidden opacity-10">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(66,32,6,0)_50%,rgba(66,32,6,0.25)_50%)] bg-[length:100%_4px]" />
                  </div>
                )}

                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 0.5 }}
                    className="flex-1 flex flex-col will-change-transform overflow-hidden"
                  >
                    {activeSection === 'home' && (
                      <>
                        <ScrollProgress color={isRetro ? '#422006' : "rgb(168, 85, 247)"} position="right" thickness={3} />
                        <div
                          ref={dashboardRef}
                          data-scrollable="true"
                          className="flex flex-col h-full overflow-y-auto custom-scrollbar scroll-smooth relative pt-24"
                          onScroll={handleScroll}
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          <div
                            className="absolute top-20 left-0 right-0 flex justify-center pointer-events-none z-20"
                            style={{ transform: `translateY(${pullProgress - 50}px)` }}
                          >
                            <div className={`w-10 h-10 backdrop-blur-xl rounded-full flex items-center justify-center border shadow-xl mt-4 ${isRetro ? 'bg-[#eab308] border-[#422006]' : 'bg-black/50 border-white/10'}`}>
                              <RefreshCw
                                className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''} ${isRetro ? 'text-[#422006]' : 'text-white'}`}
                                style={{ transform: `rotate(${pullProgress * 3}deg)` }}
                              />
                            </div>
                          </div>

                          <motion.div animate={{ y: pullProgress > 0 ? pullProgress * 0.3 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                            <EmotionalCheckIn />
                            <Dashboard onSectionChange={(section) => setActiveSection(section)} />
                          </motion.div>
                        </div>
                      </>
                    )}

                    {activeSection === 'messages' && (
                      <MessagesSectionWrapper onScroll={handleScroll} />
                    )}

                    {activeSection === 'guide' && <SoulGuide />}

                    {activeSection === 'camera' && <Photobooth />}

                    {activeSection === 'music' && (
                      <div className="flex-1 relative flex items-center justify-center bg-black/80 backdrop-blur-xl">
                        <RetroMusicPlayer onClose={() => setActiveSection('home')} />
                      </div>
                    )}

                    {activeSection === 'settings' && <SettingsSection onScroll={handleScroll} />}
                  </motion.div>
                </AnimatePresence>
              </main>

              <Dock
                activeSection={activeSection}
                showDock={showDock}
                onSectionChange={(section) => {
                  setActiveSection(section);
                  setShowHeader(true);
                  setShowDock(true);
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
