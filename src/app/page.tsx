'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Gamepad2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/shared/GradientThemeProvider';
import { useSignals } from '@/hooks/useSignals';
// import { useAlgorithm } from '@/lib/algorithm';

type Section = 'home' | 'dashboard' | 'messages' | 'social' | 'search' | 'guide' | 'settings' | 'games' | 'music';
import Dock from '@/components/shared/Dock';
import Dashboard from '@/components/shared/Dashboard';
import MessagesSectionWrapper from '@/features/chat/components/MessagesSectionWrapper';
import SocialFeed from '@/features/social/components/SocialFeed';
import SearchSection from '@/components/shared/SearchSection';
import SoulGuide from '@/features/wellness/components/SoulGuide';
import SettingsSection from '@/components/shared/SettingsSection';
import FunZone from '@/features/games/components/FunZone';
import LoadingScreen from '@/features/auth/components/LoadingScreen';
import SplashScreen from '@/features/auth/components/SplashScreen';
import AuthScreen from '@/features/auth/components/AuthScreen';
import OnboardingFlow from '@/features/auth/components/OnboardingFlow';
import LiquidBackground from '@/components/backgrounds/LiquidBackground';
import SpiralBackground from '@/components/backgrounds/SpiralBackground';
import LightBackground from '@/components/backgrounds/LightBackground';
import RetroBackground from '@/components/backgrounds/RetroBackground';
import RetroMinimalBackground from '@/components/backgrounds/RetroMinimalBackground';
import RetroCoupleBackground from '@/components/backgrounds/RetroCoupleBackground';
import InteractiveGrid from '@/components/backgrounds/InteractiveGrid';
import EmotionalCheckIn from '@/features/wellness/components/EmotionalCheckIn';
import ScrollProgress from '@/components/ui/ScrollProgress';
import NeuralNotifications from '@/components/shared/NeuralNotifications';
import DynamicInfoBox from '@/components/ui/DynamicInfoBox';
import { Conversation, Message, User, Story, Group } from '@/types/types';

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

const initialConversations: Conversation[] = mockUsers.map((user, index) => ({
  id: `conv-${user.id}`,
  participant: user,
  messages: createMockMessages(user.id),
  lastMessage: createMockMessages(user.id)[1],
  unreadCount: index === 0 ? 0 : 1,
}));

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

  const currentUserId = user?.id || 'user-1';
  const { trackConnection } = useSignals(currentUserId);
  // const { state: emotionalState, decision: algoDecision } = useAlgorithm(currentUserId);

  const [activeSection, setActiveSection] = useState<Section>('dashboard');
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

  const [feedPosts, setFeedPosts] = useState(INITIAL_POSTS);

  // Handle splash screen timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleAuthSuccess = () => {
    // Auth success handled by context
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
      setShowDock(true);
    }
    lastScrollY.current = currentScrollY;
  };

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-purple-500/30">

      {/* 1. Splash Screen */}
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* 2. Loading Screen */}
      {!showSplash && (authLoading || showLoading) && (
        <LoadingScreen message={authLoading ? "Connecting to Neural Core..." : "Loading Experience..."} />
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
          {theme === 'liquid' ? (
            <LiquidBackground />
          ) : theme === 'spiral' ? (
            <SpiralBackground />
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

          <AnimatePresence>
            {showFunZone && <FunZone onClose={() => setShowFunZone(false)} />}
          </AnimatePresence>

          <div className="flex flex-col h-screen overflow-hidden relative">

            {/* Header */}
            <AnimatePresence>
              {showHeader && (
                <motion.header
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                  className="fixed top-0 left-0 right-0 z-[100] h-24 px-8 flex items-center justify-between pointer-events-none"
                >
                  <div className="absolute inset-0 glass-premium opacity-90 border-b border-white/5 pointer-events-auto" />
                  <div className="noise-overlay opacity-[0.02] pointer-events-none" />

                  <div className="flex items-center gap-6 pointer-events-auto relative z-10">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-black italic text-white uppercase tracking-tighter">Neural Core</h1>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[8px] text-white/20 font-black uppercase tracking-[0.4em]">Section:</span>
                        <motion.span
                          key={activeSection}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[8px] text-white/40 font-black uppercase tracking-[0.4em] glitch-text-sm"
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
                    <button
                      onClick={() => {
                        setShowFunZone(true);
                        setHasNewGames(false);
                      }}
                      className="group relative h-12 px-6 flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-white/10 text-white transition-all overflow-hidden hover:border-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                    >
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-3">
                        <Gamepad2 className="w-5 h-5 text-fuchsia-300 group-hover:text-white transition-colors duration-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors duration-300">Playzone</span>
                      </div>
                      {hasNewGames && (
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                      )}
                    </button>

                    <button
                      onClick={() => setActiveSection('settings')}
                      className="group relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition-all"
                    >
                      <Settings className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-all group-hover:rotate-90 duration-500" />
                    </button>
                  </div>
                </motion.header>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 relative flex flex-col overflow-hidden">
              <NeuralNotifications />
              <div className="fixed inset-0 pointer-events-none z-[300] opacity-[0.03] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
              </div>

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
                    <div
                      data-scrollable="true"
                      className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar relative"
                      onScroll={handleScroll}
                    >
                      <EmotionalCheckIn />
                    </div>
                  )}

                  {activeSection === 'dashboard' && (
                    <>
                      <ScrollProgress color="rgb(168, 85, 247)" position="right" thickness={3} />
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
                          <div className="w-10 h-10 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-xl mt-4">
                            <RefreshCw
                              className={`w-5 h-5 text-white ${isRefreshing ? 'animate-spin' : ''}`}
                              style={{ transform: `rotate(${pullProgress * 3}deg)` }}
                            />
                          </div>
                        </div>

                        <motion.div animate={{ y: pullProgress > 0 ? pullProgress * 0.3 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                          <Dashboard onSectionChange={(section) => setActiveSection(section)} />
                        </motion.div>
                      </div>
                    </>
                  )}

                  {activeSection === 'messages' && (
                    <MessagesSectionWrapper onScroll={handleScroll} />
                  )}

                  {activeSection === 'social' && (
                    <SocialFeed onScroll={handleScroll} />
                  )}

                  {activeSection === 'search' && (
                    <>
                      <ScrollProgress color="rgb(236, 72, 153)" position="right" thickness={3} />
                      <SearchSection feedPosts={feedPosts} onScroll={handleScroll} />
                    </>
                  )}

                  {activeSection === 'guide' && <SoulGuide />}

                  {activeSection === 'settings' && <SettingsSection onScroll={handleScroll} />}
                </motion.div>
              </AnimatePresence>
            </main>

            <Dock
              activeSection={activeSection}
              showDock={showDock}
              onSectionChange={(section) => {
                if (section === 'games') {
                  setShowFunZone(true);
                } else {
                  setActiveSection(section);
                  setShowHeader(true);
                  setShowDock(true); // Always show dock when changing sections
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
