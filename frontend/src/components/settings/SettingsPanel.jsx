import React, { useContext, useState } from 'react';
import { Sun, Moon, Save, Loader2 } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { DarkModeContext } from '../../App';
import { motion } from 'framer-motion';

// Animation variants
const fadeInUp = (i = 0) => ({
  initial: { opacity: 0, y: 32, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.13, duration: 0.6, type: 'spring' } }
});

const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [animating, setAnimating] = useState(false);
  const [fadeToDark, setFadeToDark] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    emailNotifications: true,
    marketingEmails: false,
    privacy: 'public',
  });

  const handleDarkToggle = () => {
    setFadeToDark(!darkMode);
    setAnimating(true);
    setTimeout(() => {
      toggleDarkMode();
      setTimeout(() => setAnimating(false), 400);
    }, 60);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="max-w-2xl mx-auto mt-10 space-y-8 transition-colors duration-500 px-2"
    >
      {/* Dark Mode Toggle -- allowed on settings! */}
      <motion.div {...fadeInUp(0)}>
        <Card className="flex items-center justify-between p-6 bg-white dark:bg-gray-900 border-0 shadow-lg">
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">Theme</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Switch between light and dark mode for a comfortable experience.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.12, rotate: 20, boxShadow: '0px 0px 18px 2px #fbbf24' }}
            transition={{ type: 'spring', stiffness: 330 }}
            onClick={handleDarkToggle}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-500 ml-4"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </motion.button>
        </Card>
      </motion.div>
      <form onSubmit={handleSave}>
        <motion.div {...fadeInUp(1)}>
          <Card className="p-6 bg-white dark:bg-gray-900 border-0 shadow-lg space-y-7">
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Notification Settings</h2>
            <motion.div whileHover={{ scale: 1.03 }}>
              <div className="flex items-center justify-between">
                <label className="font-medium text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={form.emailNotifications}
                    onChange={handleChange}
                    className="mr-2 accent-pink-500"
                  />
                  Email Notifications
                </label>
                <span className="text-gray-400 text-xs">Receive updates via email</span>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }}>
              <div className="flex items-center justify-between">
                <label className="font-medium text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    name="marketingEmails"
                    checked={form.marketingEmails}
                    onChange={handleChange}
                    className="mr-2 accent-pink-500"
                  />
                  Marketing Emails
                </label>
                <span className="text-gray-400 text-xs">Occasional tips & offers</span>
              </div>
            </motion.div>
          </Card>
        </motion.div>
        <motion.div {...fadeInUp(2)}>
          <Card className="p-6 bg-white dark:bg-gray-900 border-0 shadow-lg mt-7 space-y-5">
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Privacy</h2>
            <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.03 }}>
              <label className="text-gray-700 dark:text-gray-200 font-semibold">
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={form.privacy === "public"}
                  onChange={handleChange}
                  className="mr-2 accent-pink-500"
                />
                Public
              </label>
              <label className="text-gray-700 dark:text-gray-200 font-semibold">
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={form.privacy === "private"}
                  onChange={handleChange}
                  className="mr-2 accent-pink-500"
                />
                Private
              </label>
            </motion.div>
            <div className="text-xs text-gray-400">
              {form.privacy === "public"
                ? "Your profile and achievements are visible to others."
                : "Your learning progress is private and only visible to you."}
            </div>
          </Card>
        </motion.div>
        <motion.div {...fadeInUp(3)} className="flex justify-end mt-6">
          <Button type="submit" size="lg" className="flex items-center gap-2">
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default SettingsPage;