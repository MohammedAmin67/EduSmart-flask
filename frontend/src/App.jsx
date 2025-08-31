import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ProgressOverview from './components/dashboard/ProgressOverview';
import ContinueLearning from './components/dashboard/ContinueLearning';
import AnalyticsCharts from './components/analytics/AnalyticsCharts';
import LessonPlayer from './components/learning/LessonPlayer';
import QuizSystem from './components/learning/QuizSystem';
import Profile from './components/profile/Profile';
import AchievementGallery from './components/profile/AchievementGallery';
import CourseGrid from './components/courses/CourseGrid';
import HomePage from './components/home/HomePage';
import SettingsPanel from './components/settings/SettingsPanel';
import SignUpPage from './components/Auth/SignUpPage';
import LoginPage from './components/Auth/LoginPage';
import toast, { Toaster } from 'react-hot-toast';
import { UserProvider, useUser } from './components/context/UserContext';

// Dark mode context
export const DarkModeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
});

function AppRoutes({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, selectedCourseId, setSelectedCourseId }) {
  const navigate = useNavigate();
  const { user, setUser } = useUser(); // Use context for login state

  // Animation wrapper for main dashboard area
  const AnimatedMain = ({ children }) => (
    <div className="max-w-7xl mx-auto animate-fadeInUp">{children}</div>
  );

  const handleLearningTabClick = () => {
    if (selectedCourseId) {
      setActiveTab('learning');
    } else {
      setActiveTab('courses');
      toast.error("Please select a course to continue")
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AnimatedMain>
            <ProgressOverview />
            <ContinueLearning setActiveTab={setActiveTab} />
          </AnimatedMain>
        );
      case 'learning':
        if (!selectedCourseId) {
          return (
            <AnimatedMain>
              <div className="text-center text-lg py-10">
                Please select a course first from <span className="underline cursor-pointer" onClick={() => setActiveTab('courses')}>My Courses</span>.
              </div>
            </AnimatedMain>
          );
        }
        return (
          <AnimatedMain>
            <LessonPlayer selectedCourseId={selectedCourseId} />
            <QuizSystem selectedCourseId={selectedCourseId} />
            <div className="mt-6 flex justify-center">
              <button
                className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl px-6 py-3 rounded-lg transition-all duration-200"
                onClick={() => setActiveTab('courses')}
              >
                Back to My Courses
              </button>
            </div>
          </AnimatedMain>
        );
      case 'courses':
        return (
          <AnimatedMain>
            <CourseGrid
              setActiveTab={setActiveTab}
              onSelectCourse={(id) => {
                setSelectedCourseId(id);
                setActiveTab('learning');
              }}
            />
          </AnimatedMain>
        );
      case 'analytics':
        return <AnimatedMain><AnalyticsCharts /></AnimatedMain>;
      case 'achievements':
        return <AnimatedMain><AchievementGallery /></AnimatedMain>;
      case 'profile':
        return <AnimatedMain><Profile /></AnimatedMain>;
      case 'settings':
        return (
          <AnimatedMain>
            <SettingsPanel />
          </AnimatedMain>
        );
      default:
        return <AnimatedMain><ProgressOverview /></AnimatedMain>;
    }
  };

  // ---- Auth Handlers (context driven) ----
  const handleLogin = (userObj) => {
    setUser(userObj);
    // localStorage handled in UserContext
    navigate('/dashboard');
  };

  const handleSignUp = (userObj) => {
    setUser(userObj);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/signup"
        element={
          <SignUpPage
            isLoggedIn={!!user}
            onBack={() => navigate(-1)}
            onSignUp={handleSignUp}
          />
        }
      />
      <Route
        path="/login"
        element={
          <LoginPage
            isLoggedIn={!!user}
            onBack={() => navigate(-1)}
            onLogin={handleLogin}
            onGoToSignUp={() => navigate('/signup')}
          />
        }
      />
      <Route
        path="/dashboard/*"
        element={
          !!user ? (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 animate-fadeIn transition-colors">
              <div className="flex">
                <Sidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  onLearningTabClick={handleLearningTabClick} 
                />
                <div className="flex-1">
                  <Header 
                    onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
                    setActiveTab={setActiveTab}
                  />
                  <main className="p-4 lg:p-8 pt-[72px]">{renderContent()}</main>
                </div>
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Central dark mode state (init from localStorage or system)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/dashboard/profile')) setActiveTab('profile');
    else if (location.pathname.startsWith('/dashboard/analytics')) setActiveTab('analytics');
    else if (location.pathname.startsWith('/dashboard/courses')) setActiveTab('courses');
    else if (location.pathname.startsWith('/dashboard/learning')) setActiveTab('learning');
    else if (location.pathname.startsWith('/dashboard/achievements')) setActiveTab('achievements');
    else if (location.pathname.startsWith('/dashboard/settings')) setActiveTab('settings');
    else setActiveTab('dashboard');
  }, [location.pathname]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'rounded-2xl shadow-xl border border-white/30 dark:border-white/10 px-4 py-3 font-semibold text-base',
          style: {
            background: 'linear-gradient(90deg, #e0e7ff 0%, #fff1f2 100%)',
            color: '#312e81',
            boxShadow: '0 6px 32px 0 rgba(59, 130, 246, 0.13)',
            borderRadius: '1rem',
          },
          success: {
            style: {
              background: 'linear-gradient(90deg, #d1fae5 0%, #a7f3d0 100%)',
              color: '#059669',
            },
            iconTheme: {
              primary: '#059669',
              secondary: '#bbf7d0',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(90deg, #fee2e2 0%, #fca5a5 100%)',
              color: '#b91c1c',
            },
            iconTheme: {
              primary: '#b91c1c',
              secondary: '#fee2e2',
            },
          },
        }}
      />
      <UserProvider>
        <AppRoutes
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedCourseId={selectedCourseId}
          setSelectedCourseId={setSelectedCourseId}
        />
      </UserProvider>
    </DarkModeContext.Provider>
  );
}

export default App;