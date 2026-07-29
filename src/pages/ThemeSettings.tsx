import { ArrowLeft, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const themes = [
  { name: '海洋蓝', primary: '#4A90D9', bg: '#F0F5FA' },
  { name: '清新绿', primary: '#43A047', bg: '#F0FAF0' },
  { name: '热情红', primary: '#E53935', bg: '#FAF0F0' },
  { name: '优雅紫', primary: '#7E57C2', bg: '#F5F0FA' },
];

export default function ThemeSettings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      <div className="bg-white px-4 py-3 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate('/profile')} className="p-2">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 flex-1 text-center pr-10">主题设置</h1>
      </div>
      <div className="p-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-800 mb-3">选择主题</div>
          <div className="grid grid-cols-4 gap-3">
            {themes.map((theme) => (
              <button key={theme.name} className="flex flex-col items-center gap-2 p-2 rounded-xl border-2 border-transparent hover:border-gray-200">
                <div className="w-12 h-12 rounded-full" style={{ backgroundColor: theme.bg, border: `3px solid ${theme.primary}` }} />
                <span className="text-xs text-gray-600">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                <Palette size={18} className="text-orange-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">自定义背景</div>
                <div className="text-xs text-gray-400">从相册选择背景图片</div>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
