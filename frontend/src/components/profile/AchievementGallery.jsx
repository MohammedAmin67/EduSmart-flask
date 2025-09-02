import React, { useState } from 'react';
import { Trophy, Star, Lock, Calendar } from 'lucide-react';
import Card from '../shared/Card';
import Modal from '../shared/Modal';
import ProgressBar from '../shared/ProgressBar';
import { achievements } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const fadeInUp = (i = 0) => ({
  initial: { opacity: 0, y: 32, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.09, duration: 0.65, type: 'spring' } }
});
const fadePop = { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } }, exit: { opacity: 0, scale: 0.88, transition: { duration: 0.3 } } };

const AchievementGallery = () => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [filter, setFilter] = useState('all');

  const rarityBorders = {
    common: 'border-gray-300',
    rare: 'border-blue-300',
    epic: 'border-purple-300',
    legendary: 'border-yellow-300'
  };
  const filters = [
    { id: 'all', label: 'All Achievements' },
    { id: 'unlocked', label: 'Unlocked' },
    { id: 'locked', label: 'Locked' },
    { id: 'in-progress', label: 'In Progress' }
  ];
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlockedDate;
    if (filter === 'locked') return !achievement.unlockedDate && !achievement.progress;
    if (filter === 'in-progress') return achievement.progress && !achievement.unlockedDate;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlockedDate).length;
  const totalXPEarned = achievements
    .filter(a => a.unlockedDate)
    .reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="space-y-5 sm:space-y-6 min-h-screen px-2 py-4 transition-colors duration-500"
    >
      <AnimatePresence>
        <motion.div {...fadeInUp()} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Achievement Gallery</h2>
          <div className="text-left sm:text-right">
            <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              {unlockedCount} / {achievements.length} Unlocked
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300">{totalXPEarned} XP Earned</div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Stats Overview */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
      >
        {[
          {
            icon: <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-1 sm:mb-2" />,
            value: unlockedCount,
            label: "Achievements Unlocked",
            colorClass: "text-yellow-800 dark:text-yellow-300",
            bg: "from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border-yellow-200 dark:border-yellow-700"
          },
          {
            icon: <Star className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 mx-auto mb-1 sm:mb-2" />,
            value: totalXPEarned,
            label: "XP from Achievements",
            colorClass: "text-purple-800 dark:text-purple-200",
            bg: "from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 border-purple-200 dark:border-purple-700"
          },
          {
            icon: <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 mx-auto mb-1 sm:mb-2" />,
            value: Math.round((unlockedCount / achievements.length) * 100),
            label: "Completion Rate",
            colorClass: "text-blue-800 dark:text-blue-200",
            bg: "from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-blue-200 dark:border-blue-700",
            isPercent: true
          }
        ].map((item, i) => (
          <motion.div key={item.label} {...fadeInUp(i)}>
            <Card className={`text-center bg-gradient-to-br ${item.bg}`}>
              {item.icon}
              <div className={`text-xl sm:text-2xl font-bold ${item.colorClass}`}>{item.value}{item.isPercent && "%"}</div>
              <div className={`text-xs sm:text-sm ${item.colorClass.replace("font-bold", "")}`}>{item.label}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {/* Filters */}
      <motion.div {...fadeInUp(1)} className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        {filters.map((filterOption, i) => (
          <motion.button
            key={filterOption.id}
            whileHover={{ scale: 1.09, boxShadow: '0px 0px 18px 2px #e879f9' }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => setFilter(filterOption.id)}
            className={`px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === filterOption.id
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {filterOption.label}
          </motion.button>
        ))}
      </motion.div>
      {/* Achievement Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05, delayChildren: 0.13 } }
        }}
        className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
      >
        {filteredAchievements.map((achievement, i) => (
          <motion.div key={achievement.id} {...fadeInUp(i)} whileHover={{ scale: 1.04 }}>
            <Card
              hover
              onClick={() => setSelectedAchievement(achievement)}
              className={`relative overflow-hidden bg-white dark:bg-[#20293a] cursor-pointer ${
                achievement.unlockedDate 
                  ? rarityBorders[achievement.rarity]
                  : 'border-gray-200 dark:border-gray-700 opacity-75'
              }`}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.16 + i * 0.04 }}
                  className={`text-3xl sm:text-4xl mb-2 sm:mb-3 ${achievement.unlockedDate ? '' : 'grayscale'}`}
                >
                  {achievement.unlockedDate ? achievement.icon : '🔒'}
                </motion.div>
                <h3 className={`font-semibold mb-1 sm:mb-2 ${
                  achievement.unlockedDate ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {achievement.name}
                </h3>
                <p className={`text-xs sm:text-sm mb-2 sm:mb-3 ${
                  achievement.unlockedDate ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                {/* Progress for in-progress achievements */}
                {achievement.progress && !achievement.unlockedDate && (
                  <div className="mb-2 sm:mb-3">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.target}</span>
                    </div>
                    <ProgressBar 
                      progress={achievement.progress} 
                      max={achievement.target} 
                      color="blue" 
                      size="sm"
                    />
                  </div>
                )}
                <div className={`flex items-center justify-center space-x-1 text-xs sm:text-sm ${
                  achievement.unlockedDate ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  <Star size={12} />
                  <span>{achievement.xpReward} XP</span>
                </div>
                {achievement.unlockedDate && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                  </div>
                )}
                {!achievement.unlockedDate && !achievement.progress && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center"
                  >
                    <Lock className="text-gray-400 dark:text-gray-500" size={28} />
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {/* Achievement Detail Modal with animation */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div {...fadePop} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <Modal
              isOpen={!!selectedAchievement}
              onClose={() => setSelectedAchievement(null)}
              title="Achievement Details"
              size="sm"
            >
              {selectedAchievement && (
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0.8, rotate: -15, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.55, type: 'spring' }}
                    className="text-4xl sm:text-6xl"
                  >
                    {selectedAchievement.unlockedDate ? selectedAchievement.icon : '🔒'}
                  </motion.div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {selectedAchievement.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {selectedAchievement.description}
                    </p>
                  </div>
                  <div className={`inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                    selectedAchievement.rarity === 'legendary' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100' :
                    selectedAchievement.rarity === 'epic' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100' :
                    selectedAchievement.rarity === 'rare' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' :
                    'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100'
                  }`}>
                    {(selectedAchievement.rarity || "").charAt(0).toUpperCase() + (selectedAchievement.rarity || "").slice(1)}
                  </div>
                  {selectedAchievement.progress && !selectedAchievement.unlockedDate && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <span>Progress</span>
                        <span>{selectedAchievement.progress}/{selectedAchievement.target}</span>
                      </div>
                      <ProgressBar 
                        progress={selectedAchievement.progress} 
                        max={selectedAchievement.target} 
                        color="blue" 
                        animated
                        showPercentage
                      />
                    </div>
                  )}
                  <div className="bg-gray-50 dark:bg-[#181F2A] p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-yellow-600 dark:text-yellow-400">
                      <Star size={16} />
                      <span className="font-semibold">{selectedAchievement.xpReward} XP Reward</span>
                    </div>
                    {selectedAchievement.unlockedDate && (
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Unlocked on {new Date(selectedAchievement.unlockedDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AchievementGallery;