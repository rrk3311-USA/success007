export default function AppFooter() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          © 2026 Life Vision Board. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
