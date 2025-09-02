import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, BookOpen, FileText, Headphones, Sparkles } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import ProgressBar from '../shared/ProgressBar';
import { lessonsByCourse, courses } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const LevelUpCharacter = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        key="levelup"
        initial={{ scale: 0.7, opacity: 0, y: 60 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.7, opacity: 0, y: 60 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="flex flex-col items-center justify-center my-6 levelup-character"
      >
        <Sparkles size={56} className="text-yellow-400 mb-2 animate-glow" />
        <div className="rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 w-24 h-24 flex items-center justify-center">
          <Play size={42} className="text-white animate-bounce" />
        </div>
        <div className="mt-3 text-2xl font-bold text-yellow-600 drop-shadow">Level Up!</div>
        <div className="text-sm text-gray-700 dark:text-gray-300">Congratulations! You advanced a level!</div>
      </motion.div>
    )}
  </AnimatePresence>
);

const LessonPlayer = ({ selectedCourseId }) => {
  // Remove useParams and ignore URL param
  const effectiveCourseId = selectedCourseId;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const [activeContent, setActiveContent] = useState('video');
  const handleSetActiveContent = (val) => {
    setActiveContent(val);
  };

  // For audio controls:
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioTime, setAudioTime] = useState(0);

  const course = courses.find(c => c.id === effectiveCourseId) || courses[0];
  const lesson = lessonsByCourse?.[course.id]?.[0];

  const contentTypes = [
    { id: 'video', label: 'Video Lesson', icon: Play },
    { id: 'audio', label: 'Audio Version', icon: Headphones },
    { id: 'text', label: 'Reading Material', icon: FileText }
  ];

  // --- Video controls ---
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && lesson) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= lesson.duration * 60) {
            clearInterval(interval);
            setIsPlaying(false);
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 2400);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setActiveContent('video');
    setAudioPlaying(false);
    setAudioTime(0);
    setIsPlaying(false);
    setCurrentTime(0);
  }, [effectiveCourseId]);

  // --- Audio controls (simulate playback and mute) ---
  useEffect(() => {
    let interval;
    if (audioPlaying && !audioMuted) {
      interval = setInterval(() => {
        setAudioTime(prev => {
          if (prev >= lesson.duration * 60) {
            setAudioPlaying(false);
            clearInterval(interval);
            return lesson.duration * 60;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [audioPlaying, audioMuted, lesson]);

  const handleAudioPlayPause = () => {
    setAudioPlaying(val => !val);
  };
  const handleAudioMute = () => {
    setAudioMuted(val => !val);
  };

  if (!lesson) {
    return (
      <Card className="p-6 text-center bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          No lessons found for this course.
        </div>
      </Card>
    );
  }

  // --- Content Views ---
  const VideoView = (
    <Card padding="none" className="overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-blue-950">
      <div className="relative bg-gray-900 aspect-video flex items-center justify-center min-h-[180px] sm:min-h-0">
        {/* Video Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
          <div className="text-white text-center px-3">
            <Play size={40} className="mx-auto mb-2 sm:mb-4 opacity-50" />
            <div className="text-base sm:text-lg font-medium">Video Content</div>
            <div className="text-xs sm:text-sm opacity-75">Play your video</div>
          </div>
        </div>
        {/* Play/Pause Overlay */}
        <button
          onClick={togglePlayback}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity z-10"
        >
          <div className="bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 rounded-full p-3 sm:p-4 hover:bg-opacity-100 transition-all">
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </div>
        </button>
        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 sm:p-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white text-xs sm:text-base">
            <button onClick={togglePlayback}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <div className="flex-1">
              <ProgressBar 
                progress={currentTime} 
                max={lesson.duration * 60} 
                color="white"
                className="bg-white bg-opacity-20"
              />
            </div>
            <span>
              {formatTime(currentTime)} / {formatTime(lesson.duration * 60)}
            </span>
            <button className="hover:text-blue-400">
              <Volume2 size={16} />
            </button>
            <button className="hover:text-blue-400">
              <Maximize size={16} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  // --- Audio View ---
  const AudioView = (
    <Card className="bg-gradient-to-br from-blue-100 via-purple-100 to-white dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 flex flex-col items-center py-12">
      <div className="flex flex-col items-center">
        <Headphones size={48} className="text-blue-600 dark:text-blue-200 mb-2" />
        <div className="text-lg font-semibold text-gray-900 dark:text-yellow-100 mb-2">Audio Version</div>
        <div className="w-full max-w-lg">
          {/* Dummy waveform bar */}
          <div className="h-12 w-full bg-gradient-to-r from-blue-200 via-blue-400 to-indigo-400 rounded-full shadow-inner flex items-center justify-center mb-3">
            <span className="text-xs text-blue-800 dark:text-white-200 opacity-70 px-3">[Waveform Visualization]</span>
          </div>
          {/* Audio controls */}
          <div className="flex items-center justify-center gap-5 mt-2">
            <button
              className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all"
              onClick={handleAudioPlayPause}
              aria-label={audioPlaying ? "Pause audio" : "Play audio"}
            >
              {audioPlaying ? (
                <Pause size={24} className="text-blue-600 dark:text-blue-200" />
              ) : (
                <Play size={24} className="text-blue-600 dark:text-blue-200" />
              )}
            </button>
            <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              {formatTime(audioTime)} / {formatTime(lesson.duration * 60)}
            </span>
            <button
              className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all"
              onClick={handleAudioMute}
              aria-label={audioMuted ? "Unmute audio" : "Mute audio"}
            >
              {audioMuted ? (
                <VolumeX size={20} className="text-blue-400 dark:text-blue-200" />
              ) : (
                <Volume2 size={20} className="text-blue-400 dark:text-blue-200" />
              )}
            </button>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">Audio lessons coming soon!</div>
      </div>
    </Card>
  );

  // Reading Material View (themed)
  const ReadingView = (
    <Card className="bg-gradient-to-br from-yellow-50 via-pink-50 to-white dark:from-gray-900 dark:via-yellow-900 dark:to-gray-900 flex flex-col items-center py-8 px-4">
      <div className="flex flex-col items-start w-full max-w-2xl">
        <FileText size={36} className="text-pink-600 dark:text-yellow-300 mb-2" />
        <div className="text-lg font-semibold text-gray-900 dark:text-yellow-100 mb-2">Reading Material</div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-inner p-4 w-full text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
          {lesson.content.transcript}
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">Enjoy a readable version of the lesson!</div>
    </Card>
  );

  // Choose which content to render
  let contentSection = VideoView;
  if (activeContent === 'audio') contentSection = AudioView;
  if (activeContent === 'text') contentSection = ReadingView;

  return (
    <div className="space-y-4 sm:space-y-6 transition-colors duration-500">
      {/* Animated Level-Up Character */}
      <LevelUpCharacter show={showLevelUp} />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">{lesson.description}</p>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">Duration: {lesson.duration} min</div>
          <div className="text-xs sm:text-sm text-blue-600 dark:text-yellow-300 font-medium">+{lesson.xpReward} XP</div>
        </div>
      </div>

      {/* Content Type Selector */}
      <div className="flex flex-wrap gap-2 overflow-x-auto">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          const active = activeContent === type.id;
          return (
            <button
              key={type.id}
              onClick={() => handleSetActiveContent(type.id)}
              className={`flex items-center space-x-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors text-xs sm:text-base font-medium ${
                active 
                  ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 shadow'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={16} />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Section */}
      {contentSection}

      {/* Key Points */}
      <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-blue-950">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <BookOpen className="mr-2" size={18} />
          Key Learning Points
        </h3>
        <ul className="space-y-2">
          {lesson.content.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-2 sm:mr-3 mt-0.5">
                {index + 1}
              </div>
              <span className="text-gray-700 dark:text-gray-200 text-sm sm:text-base">{point}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Transcript Toggle */}
      <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-blue-950">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Transcript</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTranscript(!showTranscript)}
          >
            {showTranscript ? 'Hide' : 'Show'} Transcript
          </Button>
        </div>
        {showTranscript && (
          <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-sm sm:text-base">
              {lesson.content.transcript}
            </p>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <Button variant="outline" className="w-full sm:w-auto mb-2 sm:mb-0">
          Previous Lesson
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            Take Notes
          </Button>
          <Button className="w-full sm:w-auto">
            Mark Complete & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;