import { useState } from 'react';
import {
  LayoutDashboard,
  Target,
  Heart,
  DollarSign,
  Trophy,
  Brain,
  Users,
  FileText,
  Mail,
  Terminal,
  Store,
  ChevronRight,
  ChevronLeft,
  Shield,
  TrendingUp
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

interface AppSidebarProps {
  isToggled: boolean;
  isCollapsed: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCollapseToggle?: () => void;
}

const menuItems: MenuItem[] = [
  {
    id: 'command',
    label: 'Command',
    icon: Shield,
  },
  {
    id: 'health',
    label: 'Health',
    icon: Heart,
  },
  {
    id: 'income',
    label: 'Income',
    icon: DollarSign,
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: Trophy,
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: Brain,
  },
  {
    id: 'romance',
    label: 'Romance',
    icon: Heart,
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
  },
  {
    id: 'infographics',
    label: 'Infographics',
    icon: FileText,
  },
  {
    id: 'loyalty',
    label: 'Loyalty',
    icon: Mail,
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: Terminal,
  },
  {
    id: 'walmart',
    label: 'Walmart',
    icon: Store,
  },
];

export default function AppSidebar({ isToggled, isCollapsed, activeTab, onTabChange, onCollapseToggle }: AppSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (!isToggled) return null;

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="h-full overflow-y-auto">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Navigation
            </h2>
          )}
          {onCollapseToggle && (
            <button
              onClick={onCollapseToggle}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-auto"
              aria-label="Collapse sidebar"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.id);

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleExpand(item.id);
                    } else {
                      onTabChange(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mb-1 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      {hasChildren && (
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? 'transform rotate-90' : ''
                          }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {!isCollapsed && hasChildren && isExpanded && item.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => onTabChange(child.id)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span>{child.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">LV</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Life Vision
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  v1.0.0
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">LV</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
