import { useState, useEffect } from 'react';
import { Menu, Search, Bell, Settings, User, Sun, Moon } from 'lucide-react';

interface AppHeaderProps {
  sidebarToggled: boolean;
  onSidebarToggle: () => void;
}

export default function AppHeader({ sidebarToggled, onSidebarToggle }: AppHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Logo & Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LV</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Life Vision</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Command Center</p>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Time Display */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Notifications */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* User Profile */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
