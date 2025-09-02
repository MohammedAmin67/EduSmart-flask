import React, { useState } from 'react';
import { Clock, BookOpen, User, ArrowRight, Eye, X } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import ProgressBar from '../shared/ProgressBar';
import { courses } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const teaserVariants = {
  initial: { opacity: 0, scale: 0.94, y: 40 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', duration: 0.7 } },
  exit: { opacity: 0, scale: 0.96, y: -20, transition: { duration: 0.4 } },
};

const teasers = [
  {
    id: 'nodejs',
    color: 'bg-orange-500',
    title: 'Node.js Fundamentals',
    description: 'Based on your JavaScript progress',
  },
  {
    id: 'css-advanced',
    color: 'bg-pink-500',
    title: 'CSS Advanced Techniques',
    description: 'Continue your web development journey',
  }
];

const CourseGrid = ({ setActiveTab, onSelectCourse }) => {
  const [teaserOpen, setTeaserOpen] = useState(null);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  // Find the currently open teaser if any
  const openTeaser = teasers.find(t => t.id === teaserOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="space-y-6 transition-colors duration-500"
    >
      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
        >
          My Courses
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button variant="outline" size="sm">
            Browse All Courses
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {courses.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.04, boxShadow: '0px 0px 32px 10px #a78bfa' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: idx * 0.05 }}
          >
            <Card hover className="h-full flex flex-col bg-white dark:bg-gray-900 transition-colors duration-500" id={`course-card-${course.id}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-4 h-4 ${course.color} rounded-full animate-pulse`} />
                <div className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.difficulty)} transition-colors`}>
                  {course.difficulty}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{course.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">{course.description}</p>

              <div className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-300">Progress</span>
                    <span className="font-medium">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                  </div>
                  <ProgressBar 
                    progress={course.progress} 
                    color={course.color.replace('bg-', '').replace('-500', '')} 
                    animated 
                  />
                </div>
                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{course.estimatedTime}h</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen size={14} />
                    <span>{course.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{course.category}</span>
                  </div>
                </div>
                {/* Action Button */}
                <Button 
                  className="w-full"
                  variant={course.progress > 0 ? 'primary' : 'outline'}
                  onClick={() => {
                    onSelectCourse(course.id);
                    setActiveTab('learning');
                  }}
                >
                  <span>{course.progress > 0 ? 'Continue' : 'Start Course'}</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {/* Course Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Card className="bg-white dark:bg-gray-900 transition-colors duration-500">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Recommended for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teasers.map(teaser => (
              <div key={teaser.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg relative">
                <div className={`w-3 h-3 ${teaser.color} rounded-full`} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{teaser.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{teaser.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTeaserOpen(teaser.id)}
                  className="flex items-center gap-1"
                >
                  <Eye size={16} />
                  Preview
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
      {/* Global Teaser Modal */}
      <AnimatePresence>
        {openTeaser && (
          <motion.div
            key="teaser-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 py-8"
            style={{ minHeight: '100vh' }}
            onClick={() => setTeaserOpen(null)}
          >
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={teaserVariants}
              className="relative w-full max-w-sm md:max-w-md bg-gradient-to-br from-orange-100 via-pink-100 to-white dark:from-gray-900 dark:via-pink-900 dark:to-gray-900 rounded-xl shadow-2xl flex flex-col items-center p-6"
              onClick={e => e.stopPropagation()} // Prevent closing on modal click
              style={{
                boxShadow: '0 8px 32px 8px rgba(232,121,249,0.18)',
              }}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-pink-500 transition"
                onClick={() => setTeaserOpen(null)}
                aria-label="Close preview"
              >
                <X size={22} />
              </button>
              <h4 className="font-bold text-lg mb-2 text-transparent bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text">{openTeaser.title}</h4>
              <p className="text-gray-700 dark:text-gray-200 mb-4">{openTeaser.description}</p>
              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold text-xs animate-pulse">
                  Teaser Preview
                </span>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setTeaserOpen(null)}
                className="mt-2"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CourseGrid;