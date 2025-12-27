'use client';
// Rebuild trigger 1


import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from '@/features/auth/components/SplashScreen';
import LoadingScreen from '@/features/auth/components/LoadingScreen';
import AuthScreen from '@/features/auth/components/AuthScreen';
import OnboardingFlow from '@/features/auth/components/OnboardingFlow';
import LiquidBackground from '@/components/backgrounds/LiquidBackground';
import SpiralBackground from '@/components/backgrounds/SpiralBackground';
import FunZone from '@/features/games/components/FunZone';
import Dock from '@/components/shared/Dock';
import MessagesSectionWrapper from '@/features/chat/components/MessagesSectionWrapper';
import SettingsSection from '@/components/shared/SettingsSection';
import EmotionalCheckIn from '@/features/wellness/components/EmotionalCheckIn';
import Dashboard from '@/components/shared/Dashboard';
import InteractiveGrid from '@/components/backgrounds/InteractiveGrid';
import DynamicInfoBox from '@/components/ui/DynamicInfoBox';
import NeuralRipples from '@/components/shared/NeuralRipples';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import NeuralAudio from '@/components/shared/NeuralAudio';
import NeuralNotifications from '@/components/shared/NeuralNotifications';
import SearchSection from '@/components/shared/SearchSection';
import SoulGuide from '@/features/wellness/components/SoulGuide';
import WellnessSection from '@/features/wellness/components/WellnessSection';
import ScrollProgress from '@/components/ui/ScrollProgress';
import { Conversation, Message, User, Story, Group, Section } from '../types/types';
import { Settings, Gamepad2, RefreshCw } from 'lucide-react';
import { useTheme } from '../components/shared/GradientThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import { useSignals } from '../hooks/useSignals';
import { useAlgorithm } from '../hooks/useAlgorithm';


// Mock Data
const DEFAULT_USER: User = {
  id: 'user-1',
  name: 'You',
  username: 'you',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
  isOnline: true,
  currentEmotion: 'static',
};

const mockUsers: User[] = [
  {
    id: 'user-2',
    name: 'Alex',
    username: 'alex_flow',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    isOnline: true,
    currentEmotion: 'joyful'
  },
  {
    id: 'user-3',
    name: 'Sarah',
    username: 'sarah',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    isOnline: false,
    currentEmotion: 'static'
  },
  {
    id: 'user-4',
    name: 'Mike',
    username: 'mike',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    isOnline: true,
    currentEmotion: 'anxious'
  },
  {
    id: 'user-5',
    name: 'Emma',
    username: 'emma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    isOnline: true,
    currentEmotion: 'loved'
  },
  {
    id: 'user-6',
    name: 'James',
    username: 'james',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    isOnline: false,
    currentEmotion: 'angry'
  },
];

const createMockMessages = (userId: string): Message[] => [
  {
    id: '1',
    senderId: userId,
    content: 'Hey! How are you doing? 👋',
    timestamp: new Date(Date.now() - 3600000),
    isRead: true,
  },
  {
    id: '2',
    senderId: DEFAULT_USER.id,
    content: "I'm doing great! Just working on this new chat app 🚀",
    timestamp: new Date(Date.now() - 3500000),
    isRead: true,
  },
  {
    id: '3',
    senderId: userId,
    content: 'That sounds awesome! What features are you adding?',
    timestamp: new Date(Date.now() - 3400000),
    isRead: true,
  },
  {
    id: '4',
    senderId: DEFAULT_USER.id,
    content: 'Emoji support, real-time messaging, and a sleek dark mode design! 😎✨',
    timestamp: new Date(Date.now() - 3300000),
    isRead: true,
    reactions: [
      { emoji: '🔥', userId: 'user-2' },
      { emoji: '❤️', userId: 'user-3' }
    ],
  },
  {
    id: '5',
    senderId: userId,
    content: "Love it! Can't wait to try it out! 🎉",
    timestamp: new Date(Date.now() - 1800000),
    isRead: true,
  },
];

const initialConversations: Conversation[] = mockUsers.map((user, index) => ({
  id: `conv-${user.id}`,
  participant: user,
  messages: createMockMessages(user.id),
  lastMessage: createMockMessages(user.id)[createMockMessages(user.id).length - 1],
  unreadCount: index === 0 ? 0 : Math.floor(Math.random() * 3),
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
  const { state: emotionalState, decision: algoDecision } = useAlgorithm(currentUserId);

  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [showFunZone, setShowFunZone] = useState(false);
  const { theme } = useTheme();
  const [showHeader, setShowHeader] = useState(true);
  const [hasNewGames, setHasNewGames] = useState(true);
  const lastScrollY = useRef(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullProgress, setPullProgress] = useState(0);
  const dashboardRef = useRef<HTMLDivElement>(null);

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

  // Messages state
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(conversations[0]?.id || null);
  const [stories, setStories] = useState<Story[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  // Feed State
  const [feedPosts, setFeedPosts] = useState(INITIAL_POSTS);
  const [newPostContent, setNewPostContent] = useState('');

  const handleAuthSuccess = (userData: { id: string; name: string; email?: string; phone?: string; avatar: string; authMethod: 'google' | 'phone' | 'email' }) => {
    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      avatar: userData.avatar,
      authMethod: userData.authMethod,
      onboardingComplete: false,
      createdAt: new Date()
    });
  };

  const handleOnboardingComplete = (data: { name: string; moodBaseline: string; intent: string[] }) => {
    completeOnboarding(data);
    setShowOnboarding(false);
  };

  const getBreadcrumbs = () => {
    const items = [];
    if (activeSection === 'messages') {
      items.push({ label: 'Messages', href: '#messages' });
      items.push({ label: 'Chat', href: '#chat' });
    } else if (activeSection === 'settings') {
      items.push({ label: 'Settings', href: '#settings' });
      items.push({ label: 'System', href: '#system' });
    } else if (activeSection === 'home') {
      items.push({ label: 'Check-In', href: '#checkin' });
    } else if (activeSection === 'dashboard') {
      items.push({ label: 'Dashboard', href: '#dashboard' });
      items.push({ label: 'My Mood', href: '#my-mood' });
    } else if (activeSection === 'search') {
      items.push({ label: 'Search', href: '#search' });
    } else if (activeSection === 'guide') {
      items.push({ label: 'Soul Guide', href: '#guide' });
    }
    return items;
  };


  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;

    if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowHeader(true);
      }
      lastScrollY.current = currentScrollY;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (dashboardRef.current?.scrollTop === 0) {
      setPullStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY === 0 || isRefreshing) return;
    const touchY = e.touches[0].clientY;
    const pullDistance = touchY - pullStartY;

    if (pullDistance > 0 && dashboardRef.current?.scrollTop === 0) {
      setPullProgress(Math.min(pullDistance * 0.4, 120));
    }
  };

  const handleTouchEnd = () => {
    if (pullProgress > 60) {
      setIsRefreshing(true);
      setPullProgress(60);
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
    <div className="relative w-full h-full overflow-hidden">
      <NeuralRipples />


      {/* 1. Splash Screen - Always First */}
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* 2. Loading Screen - Show while checking auth OR if explicitly loading */}
      {!showSplash && (authLoading || showLoading) && (
        <LoadingScreen message={authLoading ? "Connecting to Neural Core..." : "Loading Experience..."} />
      )}

      {/* 3. Auth Screen - Show if ready and no user */}
      {!showSplash && !authLoading && !showLoading && !user && (
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      )}

      {/* 4. Main App - Show if ready and has user */}
      {!showSplash && !authLoading && !showLoading && user && (
        <>
          {/* Onboarding Overlay */}
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
          ) : (
            <InteractiveGrid />
          )}

          {/* Modals */}
          <AnimatePresence>
            {showFunZone && <FunZone onClose={() => setShowFunZone(false)} />}
          </AnimatePresence>

          <div className="flex flex-col h-screen overflow-hidden relative">
            {/* Minimal Header - Hidden in Home for immersion */}
            {/* Premium Header - Neural Update */}
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
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
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

                  {/* Desktop Center Dynamic Info Box */}
                  <div className="hidden lg:flex items-center pointer-events-auto relative z-10">
                    <DynamicInfoBox />
                  </div>

                  <div className="flex items-center gap-3 pointer-events-auto relative z-10">
                    <button
                      onClick={() => {
                        setShowFunZone(true);
                        setHasNewGames(false);
                      }}
                      className="group relative h-12 px-6 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition-all overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-3">
                        <Gamepad2 className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-all duration-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300">Playzone</span>
                      </div>
                      {hasNewGames && (
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
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

            {/* Main Section Content */}
            <main className="flex-1 relative flex flex-col overflow-hidden">
              <NeuralNotifications />
              <NeuralAudio
                emotion={activeSection === 'home' ? 'joyful' : (algoDecision?.scrollSpeed === 'slow' ? 'calm' : 'calm')}
                intensity={algoDecision?.notificationIntensity === 'minimal' ? 0.1 : 0.3}
              />

              {/* Global Neural Texture Overlay */}
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
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                    mass: 0.5
                  }}
                  className="flex-1 flex flex-col will-change-transform overflow-hidden"
                >
                  {activeSection === 'home' && (
                    <div
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
                        className="flex flex-col h-full overflow-y-auto custom-scrollbar scroll-smooth relative pt-24"
                        onScroll={handleScroll}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      >
                        {/* Refresh Indicator */}
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

            {/* Premium Dock Navigation */}
            <Dock
              activeSection={activeSection}
              onSectionChange={(section) => {
                setActiveSection(section);
                setShowHeader(true);
              }}
            // Add 'wellness' to Dock navigation if not present
            />
          </div>

        </>
      )
      }
    </div >
  );
}
