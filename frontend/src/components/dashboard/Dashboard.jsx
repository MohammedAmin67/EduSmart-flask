import React from 'react';
import ProgressOverview from './ProgressOverview';
import ContinueLearning from './ContinueLearning';
import { motion } from 'framer-motion';

const dashboardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, type: 'spring', staggerChildren: 0.11, delayChildren: 0.18 }
  }
};

const Dashboard = ({ setActiveTab }) => (
  <motion.div
    className="container mx-auto px-2 sm:px-4 py-5 md:py-10 animate-fadeIn"
    variants={dashboardVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start"
      variants={dashboardVariants}
    >
      <motion.div className="lg:col-span-1" variants={dashboardVariants}>
        <ProgressOverview />
      </motion.div>
      <motion.div className="lg:col-span-2" variants={dashboardVariants}>
        <ContinueLearning setActiveTab={setActiveTab} />
      </motion.div>
    </motion.div>
  </motion.div>
);

export default Dashboard;