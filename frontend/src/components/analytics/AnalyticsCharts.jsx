import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Clock, Target, Award, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import Card from '../shared/Card';
import ProgressBar from '../shared/ProgressBar';
import { analyticsData } from '../../data/mockData';
import { motion } from 'framer-motion';

// Animation variant helpers
const fadeInUp = (i = 0) => ({
  initial: { opacity: 0, y: 32, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.13, duration: 0.62, type: 'spring' } }
});

// Helper to pick color based on accuracy
const getColor = (accuracy) =>
  accuracy >= 90 ? 'green' : accuracy >= 80 ? 'blue' : accuracy >= 70 ? 'yellow' : 'red';

const getChartData = (days) => {
  if (!analyticsData.weeklyChart) return [];
  if (days <= analyticsData.weeklyChart.length) {
    return analyticsData.weeklyChart.slice(-days);
  }
  const emptyDay = { day: '', xp: 0, minutes: 0 };
  return [
    ...Array(days - analyticsData.weeklyChart.length).fill(emptyDay),
    ...analyticsData.weeklyChart
  ];
};

const STORAGE_KEY = 'analytics_days_selected';

const AnalyticsCharts = ({ activeTab }) => {
  const [days, setDays] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? Number(saved) : 7;
  });

  const chartContainer = useRef(null);
  const [chartWidth, setChartWidth] = useState(500);

  // To trigger width recalculation on tab switch or section visibility
  useEffect(() => {
    // Handler to update chart width after layout
    const updateWidth = () => {
      if (chartContainer.current) {
        const width = chartContainer.current.offsetWidth || 500;
        setChartWidth(width);
      }
    };

    // Run when the component mounts and when tab becomes active
    updateWidth();

    // Use ResizeObserver for dynamic/parent container resizes
    let observer;
    if (chartContainer.current && 'ResizeObserver' in window) {
      observer = new window.ResizeObserver(() => {
        updateWidth();
      });
      observer.observe(chartContainer.current);
    } else {
      window.addEventListener('resize', updateWidth);
    }

    // If using a tab system, recalc on tab switch
    if (typeof activeTab !== "undefined") {
      // Delay to allow layout/parent to render
      setTimeout(updateWidth, 120);
    }

    return () => {
      if (observer && chartContainer.current) {
        observer.disconnect();
      } else {
        window.removeEventListener('resize', updateWidth);
      }
    };
  }, [days, activeTab]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, days);
  }, [days]);

  const data = getChartData(days);

  const getSvgMinWidth = () => (days === 7 ? 700 : 1200);

  const chartHeight = 140;
  const svgWidth = days === 30 ? 1200 : chartWidth;
  const barGap = data.length > 0 ? svgWidth / data.length : 1;
  const barWidth = Math.max(barGap * 0.45, 12);
  const maxMinutes = Math.max(...data.map(day => Number.isFinite(day.minutes) ? day.minutes : 0), 1);
  const maxXP = Math.max(...data.map(day => Number.isFinite(day.xp) ? day.xp : 0), 1);

  const subjectPerformance = analyticsData.subjectPerformance || [];
  const topSubject = subjectPerformance.length
    ? subjectPerformance.reduce((top, curr) => (curr.accuracy > top.accuracy ? curr : top), subjectPerformance[0])
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="space-y-8 transition-colors duration-500"
    >
      <motion.div {...fadeInUp(0)} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Learning Analytics</h2>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.07, backgroundColor: "#dbeafe" }}
            transition={{ type: 'spring', stiffness: 250 }}
            className={`px-3 py-1 text-sm rounded-lg font-bold shadow transition
              ${days === 7 ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium'}`}
            onClick={() => setDays(7)}
            aria-pressed={days === 7}
          >
            7 Days
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.07, backgroundColor: "#dbeafe" }}
            transition={{ type: 'spring', stiffness: 250 }}
            className={`px-3 py-1 text-sm rounded-lg font-bold shadow transition
              ${days === 30 ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium'}`}
            onClick={() => setDays(30)}
            aria-pressed={days === 30}
          >
            30 Days
          </motion.button>
        </div>
      </motion.div>

      {/* Weekly Progress Responsive SVG Chart */}
      <div>
        <Card className="glass-card p-8 rounded-2xl shadow-xl bg-gradient-to-tr from-blue-100 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-0 transition-colors duration-500">
          <h3 className="text-xl font-bold mb-5 text-blue-900 dark:text-blue-200">Weekly Activity</h3>
          <div
            ref={chartContainer}
            className="w-full"
            style={{ overflowX: 'auto', overflowY: 'hidden', paddingBottom: 0, marginBottom: 0, maxHeight: 'unset' }}
          >
            <div className="w-full" style={{ overflowX: 'auto', overflowY: 'hidden', paddingBottom: 0, marginBottom: 0 }}>
              <svg
                width={svgWidth}
                height={chartHeight + 52}
                viewBox={`0 0 ${svgWidth} ${chartHeight + 52}`}
                preserveAspectRatio="none"
                className="block"
                style={{
                  minWidth: days === 30 ? 1200 : undefined,
                  width: svgWidth,
                  maxWidth: '100%',
                  display: 'block',
                }}
              >
                {/* Y axis grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((v, i) =>
                  <line
                    key={i}
                    x1={0}
                    x2={svgWidth}
                    y1={18 + chartHeight - chartHeight * v}
                    y2={18 + chartHeight - chartHeight * v}
                    stroke="#e5e7eb"
                    strokeDasharray="2,2"
                  />
                )}
                {/* XP Line */}
                <polyline
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="2"
                  points={
                    data.map((day, i) => {
                      const safeXP = Number.isFinite(day.xp) ? day.xp : 0;
                      const y = 18 + chartHeight - (safeXP / maxXP) * (chartHeight - 28);
                      return `${barGap * i + barGap / 2},${y}`;
                    }).join(' ')
                  }
                  className="transition-all duration-700"
                />
                {/* Bars */}
                {data.map((day, i) => {
                  if (!day || day.day == null) return null;
                  const safeXP = Number.isFinite(day.xp) ? day.xp : 0;
                  const safeMinutes = Number.isFinite(day.minutes) ? day.minutes : 0;
                  const xpY = 18 + chartHeight - (safeXP / maxXP) * (chartHeight - 28);
                  const minBarY = 18 + chartHeight - (safeMinutes / maxMinutes) * (chartHeight - 28);
                  return (
                    <g key={day.day || i}>
                      {/* XP Bar */}
                      <rect
                        x={barGap * i + (barGap - barWidth) / 2}
                        y={xpY}
                        width={barWidth}
                        height={(safeXP / maxXP) * (chartHeight - 28)}
                        fill="#a78bfa"
                        rx="4"
                        className="transition-all duration-700"
                      />
                      {/* Minutes Bar */}
                      <rect
                        x={barGap * i + (barGap - barWidth) / 2 + barWidth * 0.18}
                        y={minBarY}
                        width={barWidth * 0.65}
                        height={(safeMinutes / maxMinutes) * (chartHeight - 28)}
                        fill="#3b82f6"
                        rx="3"
                        className="transition-all duration-700"
                        opacity="0.85"
                      />
                      {/* XP point */}
                      <circle
                        cx={barGap * i + barGap / 2}
                        cy={xpY}
                        r="4"
                        fill="#a78bfa"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      {/* XP label above the point */}
                      <text
                        x={barGap * i + barGap / 2}
                        y={xpY - 8}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#7c3aed"
                        fontWeight={700}
                        style={{ pointerEvents: 'none' }}
                      >{safeXP}</text>
                      {/* Minutes label below the bar */}
                      <text
                        x={barGap * i + barGap / 2}
                        y={chartHeight + 28}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#2563eb"
                        fontWeight={700}
                        style={{ pointerEvents: 'none' }}
                      >{safeMinutes}m</text>
                    </g>
                  );
                })}
                {/* Day labels (horizontal, only every 5th and last) */}
                {data.map((day, i, arr) => {
                  if (!day || !day.day) return null;
                  if (!(i === 0 || (i + 1) % 5 === 0 || i === arr.length - 1)) return null;
                  return (
                    <text
                      key={`${day.day}-label-${i}`}
                      x={barGap * i + barGap / 2}
                      y={chartHeight + 46}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#444"
                    >
                      {day.day}
                    </text>
                  );
                })}
              </svg>
            </div>
            {/* Legend stays OUTSIDE scroll area */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap sm:flex-nowrap justify-center space-x-4 space-y-1 sm:space-y-0 mt-3"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded shadow"></div>
                <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">Study Time</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded shadow"></div>
                <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">XP Earned</span>
              </div>
            </motion.div>
          </div>
        </Card>
      </div>

      {/* Subject Performance */}
      <motion.div {...fadeInUp(2)}>
        <Card className="glass-card p-8 rounded-2xl bg-gradient-to-tr from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 border-0 shadow-lg transition-colors duration-500">
          <h3 className="text-xl font-bold mb-5 text-purple-900 dark:text-purple-200">Subject Performance</h3>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.09, delayChildren: 0.18 } }
            }}
            className="space-y-6"
          >
            {subjectPerformance.map((subject, idx) => (
              <motion.div key={subject.subject || idx} {...fadeInUp(idx)}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                      {subject.subject}
                      {subject.subject === topSubject.subject && (
                        <Star className="ml-1 text-yellow-400" size={15} />
                      )}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-300">{subject.accuracy}% accuracy</span>
                  </div>
                  <ProgressBar 
                    progress={subject.accuracy} 
                    color={getColor(subject.accuracy)} 
                    animated 
                    className="shadow"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{subject.timeSpent} minutes spent</span>
                    <span>{subject.lessonsCompleted} lessons completed</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.div>

      {/* Monthly Stats with trend icons */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            icon: <Clock className="w-10 h-10 text-blue-500 mx-auto mb-2 animate-pulse" />,
            value: analyticsData.monthlyStats?.totalMinutes || 0,
            label: "Total Minutes",
            trend: <ArrowUpRight className="text-green-500" />,
            color: "text-gray-900 dark:text-gray-100",
            bg: "from-blue-100 to-purple-50 dark:from-gray-800 dark:to-purple-900 border-blue-200 dark:border-blue-900"
          },
          {
            icon: <Target className="w-10 h-10 text-green-500 mx-auto mb-2 animate-pulse" />,
            value: analyticsData.monthlyStats?.totalLessons || 0,
            label: "Lessons Completed",
            trend: <ArrowDownRight className="text-red-400" />,
            color: "text-gray-900 dark:text-gray-100",
            bg: "from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-900"
          },
          {
            icon: <TrendingUp className="w-10 h-10 text-purple-500 mx-auto mb-2 animate-pulse" />,
            value: (analyticsData.monthlyStats?.averageAccuracy || 0) + "%",
            label: "Average Accuracy",
            trend: <ArrowUpRight className="text-green-500" />,
            color: "text-gray-900 dark:text-gray-100",
            bg: "from-purple-100 to-blue-50 dark:from-purple-900 dark:to-blue-900 border-purple-200 dark:border-purple-900"
          },
          {
            icon: <Award className="w-10 h-10 text-yellow-500 mx-auto mb-2 animate-pulse" />,
            value: analyticsData.monthlyStats?.bestStreak || 0,
            label: "Best Streak (days)",
            trend: <ArrowUpRight className="text-green-500" />,
            color: "text-gray-900 dark:text-gray-100",
            bg: "from-yellow-100 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border-yellow-200 dark:border-yellow-900"
          }
        ].map((item, i) => (
          <motion.div key={item.label} {...fadeInUp(i)}>
            <Card className={`text-center bg-gradient-to-br ${item.bg} rounded-2xl shadow-lg glass-card transition-colors duration-500`}>
              {item.icon}
              <div className="flex items-center justify-center gap-2">
                <span className={`text-3xl font-bold ${item.color}`}>{item.value}</span>
                {item.trend}
              </div>
              <div className="text-base text-gray-500 dark:text-gray-200">{item.label}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsCharts;