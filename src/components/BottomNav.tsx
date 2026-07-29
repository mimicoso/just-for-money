import { Home, Calendar, CreditCard, BarChart3, PieChart, User } from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const tabs = [
  { path: '/', label: '首页', icon: Home },
  { path: '/calendar', label: '日历', icon: Calendar },
  { path: '/accounts', label: '账户', icon: CreditCard },
  { path: '/assets', label: '资产', icon: BarChart3 },
  { path: '/statistics', label: '统计', icon: PieChart },
  { path: '/profile', label: '我的', icon: User },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTab, setActiveTab } = useUIStore();

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname, setActiveTab]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-14 pb-safe">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => {
                setActiveTab(tab.path);
                navigate(tab.path);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive ? 'text-[#4A90D9]' : 'text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
