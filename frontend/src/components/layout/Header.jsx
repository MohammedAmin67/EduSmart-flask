import React, { useState, useEffect, useContext, useRef } from 'react';
import { Search, Bell, Menu, Sun, Moon, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import Avatar from '../shared/Avatar';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../../App';
import { useUser } from '../context/UserContext';
import useLogout from '../../hooks/useLogout';
import { courses } from '../../data/mockData';

const AnimatedLogo = () => (
  <motion.div
    initial={{ scale: 0.8, rotate: -10, opacity: 0.4 }}
    animate={{ scale: 1, rotate: 0, opacity: 1 }}
    whileHover={{
      scale: 1.12,
      rotate: 7,
      boxShadow: '0px 0px 28px 8px #6366f1',
      transition: { type: 'spring', stiffness: 220 }
    }}
    transition={{ type: 'spring', stiffness: 220, damping: 14 }}
    className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-blue-400 to-green-400 flex items-center justify-center shadow-xl"
  >
    <motion.span
      className="block"
      animate={{
        scale: [1, 1.11, 1],
        rotate: [0, 8, -8, 0],
        filter: [
          "drop-shadow(0 0 0px #6366f1)", "drop-shadow(0 0 9px #6366f1)", "drop-shadow(0 0 0px #6366f1)"
        ]
      }}
      transition={{
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }}
    >
      <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
        <path d="M3 6.75C3 5.23122 4.23122 4 5.75 4H18.25C19.7688 4 21 5.23122 21 6.75V17.25C21 18.7688 19.7688 20 18.25 20H5.75C4.23122 20 3 18.7688 3 17.25V6.75Z" fill="url(#a)" />
        <path d="M7 8H17M7 12H13" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="a" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
    </motion.span>
  </motion.div>
);

const Star = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const Header = ({ onMenuToggle, setActiveTab, setSelectedCourseId }) => {
  const controls = useAnimation();
  const navigate = useNavigate(); 
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { user, setUser } = useUser();
  const logout = useLogout(setUser);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const dropdownRef = useRef();
  const avatarButtonRef = useRef();
  const searchInputRef = useRef();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Filtered course suggestions
  const filteredCourses = searchTerm
    ? courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        avatarButtonRef.current && !avatarButtonRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
        setIsMobileSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!showSuggestions || filteredCourses.length === 0) {
      setHighlightedIdx(-1);
      return;
    }
    const listener = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIdx(idx => Math.min(idx + 1, filteredCourses.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIdx(idx => Math.max(idx - 1, 0));
      } else if (e.key === "Enter" && highlightedIdx >= 0) {
        handleSelectCourse(filteredCourses[highlightedIdx]);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
    // eslint-disable-next-line
  }, [showSuggestions, filteredCourses, highlightedIdx]);

  // -----------Make search click set selectedCourseId globally -----------
  const handleSelectCourse = (course) => {
    setSearchTerm('');
    setShowSuggestions(false);
    setHighlightedIdx(-1);

    if (setSelectedCourseId) setSelectedCourseId(course.id);
    if (setActiveTab) setActiveTab('learning');
    // navigate(`/dashboard/learning/${course.id}`);
  };

  const BG_DARK = "rgba(24,31,42,1)";
  const BG_LIGHT = "rgba(255,255,255,1)";

  useEffect(() => {
    const handleScroll = () => {
      controls.start({
        boxShadow: window.scrollY > 8
          ? "0 2px 24px 0 rgba(59,130,246,0.15)"
          : "0 0px 0px 0 rgba(0,0,0,0)",
        backgroundColor: darkMode ? BG_DARK : BG_LIGHT,
        transition: { duration: 0.3 }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls, darkMode]);

  if (!user) {
    return (
      <header className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-200 shadow w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <AnimatedLogo />
          </div>
          <span className="italic text-gray-400">Loading...</span>
        </div>
      </header>
    );
  }

  return (
    <motion.header
      className="border-b border-blue-100/10 px-2 sm:px-4 py-2 sm:py-3 fixed rounded-s-md top-0 z-40 w-full transition-shadow backdrop-blur-lg duration-500"
      animate={controls}
      initial={{
        boxShadow: "0 0px 0px 0 rgba(0,0,0,0)",
        backgroundColor: darkMode ? BG_DARK : BG_LIGHT,
      }}
      style={{ WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <motion.button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-blue-100/60 dark:hover:bg-blue-900/30 transition"
            whileTap={{ scale: 0.94 }}
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </motion.button>
          <div className="flex items-center space-x-2">
            <AnimatedLogo />
          </div>
          {/* Responsive search: show icon on small screens, full bar on md+ */}
          <motion.div
            className="hidden md:flex items-center space-x-2 ml-3 sm:ml-5 relative"
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative w-36 sm:w-48 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
              <input
                type="text"
                ref={searchInputRef}
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                placeholder="Search courses, lessons..."
                className="pl-10 pr-4 py-2 border border-blue-200 dark:border-blue-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent w-full bg-white/90 dark:bg-gray-800 dark:text-gray-100 transition-colors"
              />
              {showSuggestions && filteredCourses.length > 0 && (
                <ul className="absolute left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                  {filteredCourses.map((course, idx) => (
                    <li
                      key={course.id}
                      className={`cursor-pointer px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-800 transition rounded ${
                        highlightedIdx === idx ? 'bg-blue-100 dark:bg-blue-800' : ''
                      }`}
                      onMouseDown={() => handleSelectCourse(course)}
                    >
                      {course.title}
                    </li>
                  ))}
                </ul>
              )}
              {showSuggestions && searchTerm && filteredCourses.length === 0 && (
                <div className="absolute left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 rounded-xl shadow-lg px-4 py-2 text-gray-500 dark:text-gray-300">
                  No courses found.
                </div>
              )}
            </div>
          </motion.div>
          <motion.div className="flex md:hidden items-center ml-2 relative">
            <button
              className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
              onClick={() => {
                setIsMobileSearchOpen(true);
                setShowSuggestions(true);
                setTimeout(() => {
                  if (searchInputRef.current) searchInputRef.current.focus();
                }, 100);
              }}
              aria-label="Open search"
            >
              <Search size={22} className="text-blue-500" />
            </button>
            {(isMobileSearchOpen || searchTerm) && (
              // --- FIXED: limit width and position so it fits between logo+avatar on small screens ---
              <div
                className="absolute left-0 top-full mt-2"
                style={{
                  width: 'calc(100vw - 120px)', // 120px as an estimate for avatar/menu/logo
                  maxWidth: '320px',
                  minWidth: '180px',
                  right: 0,
                  zIndex: 99,
                }}
              >
                <input
                  type="text"
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => { setShowSuggestions(false); setIsMobileSearchOpen(false); }, 100)}
                  placeholder="Search courses..."
                  className="pl-3 pr-3 py-2 border border-blue-200 dark:border-blue-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent w-full bg-white/90 dark:bg-gray-800 dark:text-gray-100 transition-colors"
                  style={{ width: '100%' }}
                />
                {showSuggestions && filteredCourses.length > 0 && (
                  <ul className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 rounded-xl shadow-lg max-h-52 overflow-y-auto z-50">
                    {filteredCourses.map((course, idx) => (
                      <li
                        key={course.id}
                        className={`cursor-pointer px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-800 transition rounded ${
                          highlightedIdx === idx ? 'bg-blue-100 dark:bg-blue-800' : ''
                        }`}
                        onMouseDown={() => handleSelectCourse(course)}
                      >
                        {course.title}
                      </li>
                    ))}
                  </ul>
                )}
                {showSuggestions && searchTerm && filteredCourses.length === 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 rounded-xl shadow-lg px-4 py-2 text-gray-500 dark:text-gray-300 z-50">
                    No courses found.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
        <div className="flex items-center gap-3 sm:gap-3 pr-3">
          <motion.div
            className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-700 px-2 sm:px-3 py-1 rounded-lg shadow font-semibold"
            initial={{ y: -13, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.45 }}
          >
            <Star className="text-yellow-400 drop-shadow" size={16} />
            <span className="font-semibold text-blue-700 dark:text-yellow-200 text-sm">{user?.totalXP ?? 0} XP</span>
          </motion.div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-500"
            aria-label="Toggle dark mode"
            style={{ marginRight: '0.1rem' }}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <motion.div
            className="relative flex items-center space-x-2 sm:space-x-3"
            initial={{ x: 18, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.23, duration: 0.5 }}
          >
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center ml-1 cursor-pointer"
              onClick={() => setDropdownOpen(v => !v)}
              tabIndex={0}
              role="button"
              aria-label="Open user menu"
              ref={avatarButtonRef}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setDropdownOpen(v => !v); }}
            >
              <Avatar user={user} size="sm" className="w-9 h-9 sm:w-10 rounded-full sm:h-10 object-cover border-2 border-blue-300 shadow hover:ring-2 hover:ring-blue-400 transition" />
            </div>
            <div className="hidden sm:flex flex-col justify-center min-w-0 pl-3 select-none">
              <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name ?? "User"}</span>
              <span className="text-xs text-blue-500 dark:text-blue-300 font-medium truncate">Level {user?.level ?? 0}</span>
            </div>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                ref={dropdownRef}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 12px)',
                  zIndex: 999
                }}
                className="w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg animate-fadeIn"
              >
                <button
                  className="flex items-center w-full px-4 py-3 text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                  onClick={() => { setDropdownOpen(false); setActiveTab && setActiveTab('profile'); }}
                >
                  <User className="mr-2" size={18} /> Profile
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                  onClick={() => { setDropdownOpen(false); setActiveTab && setActiveTab('settings'); }}
                >
                  <SettingsIcon className="mr-2" size={18} /> Settings
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 text-pink-600 dark:text-pink-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                  onClick={() => { setDropdownOpen(false); logout(); }}
                >
                  <LogOut className="mr-2" size={18} /> Log Out
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;