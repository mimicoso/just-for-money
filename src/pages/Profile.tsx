import { useNavigate } from 'react-router-dom';
import { useTransactionStore } from '../stores/useTransactionStore';
import {
  ChevronRight, Settings, Tags, Grid3X3, Cloud,
  Database, ArrowLeftRight, Palette, Shapes, BookOpen,
  ListTodo, BarChart3, Eye, Wallet, HardDrive, Repeat
} from 'lucide-react';

const quickActions = [
  { icon: Grid3X3, label: '账户管理', path: '/account-management' },
  { icon: Tags, label: '标签管理', path: '/tag-management' },
  { icon: Shapes, label: '分类管理', path: '/category-management' },
  { icon: Settings, label: '设置', path: '/settings' },
  { icon: ListTodo, label: '愿望清单', path: '/wishlist' },
  { icon: BookOpen, label: '账本管理', path: '/ledger-management' },
  { icon: Wallet, label: '预算管理', path: '/budget' },
  { icon: Repeat, label: '周期记账', path: '/recurring' },
];

const dataManageItems = [
  {
    icon: Cloud,
    title: '云同步',
    desc: '',
    status: '',
    statusColor: '',
    path: '/cloud-sync',
  },
  {
    icon: Database,
    title: '远程数据库',
    desc: 'MySQL 数据存储配置',
    status: '未配置',
    statusColor: 'text-gray-400',
    path: '/remote-database',
  },
  {
    icon: HardDrive,
    title: '数据备份',
    desc: '本地备份与WebDAV备份',
    status: '',
    statusColor: '',
    path: '/data-backup',
  },
  {
    icon: ArrowLeftRight,
    title: '导入导出',
    desc: '支持Excel/CSV/TXT账单导入',
    status: '',
    statusColor: '',
    path: '/import-export',
  },
];

const otherItems = [
  { icon: Palette, title: '主题设置', desc: '自定义主题与背景', path: '/theme-settings' },
  { icon: Shapes, title: '图标管理', desc: '管理全局图标', path: '/icon-management' },
];

export default function Profile() {
  const navigate = useNavigate();
  const transactions = useTransactionStore((s) => s.transactions);
  const transactionCount = transactions.length;

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      {/* User Card */}
      <div className="px-4 pt-8 pb-4">
        <div className="bg-gradient-to-r from-[#5B9BD5] to-[#4A8FD4] rounded-2xl p-6 text-white shadow-lg shadow-blue-200/50 relative mt-8">
          {/* Avatar */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-[#F0F5FA]">
              <span className="text-3xl">🐑</span>
            </div>
          </div>
          <div className="text-center pt-8">
            <div className="text-lg font-semibold mb-1">羊羊记账用户</div>
            <div className="text-sm opacity-90 mb-0.5">坚持记账的第0天</div>
            <div className="text-sm opacity-80">已记录{formatNumber(transactionCount)}条账单</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="flex flex-col items-center gap-1.5"
                  onClick={() => navigate(item.path)}
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-[#4A90D9]" />
                  </div>
                  <span className="text-xs text-gray-600">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">数据管理</h3>
          <div className="space-y-0">
            {dataManageItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between py-3 ${
                    idx < dataManageItems.length - 1 ? 'border-b border-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Icon size={18} className="text-[#4A90D9]" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-800">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.desc || `已同步${formatNumber(transactionCount)}条账单`}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.status && (
                      <span className={`text-xs ${item.statusColor}`}>{item.status}</span>
                    )}
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Other */}
      <div className="px-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">其他</h3>
          <div className="space-y-0">
            {otherItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between py-3 ${
                    idx < otherItems.length - 1 ? 'border-b border-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Icon size={18} className="text-orange-500" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-800">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
