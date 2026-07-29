import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DataMode() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      <div className="bg-white px-4 py-3 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate('/profile')} className="p-2">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 flex-1 text-center pr-10">数据模式</h1>
      </div>
      <div className="p-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-sm text-gray-800 mb-1">本地模式</div>
          <div className="text-xs text-gray-400">数据仅保存在本地设备</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-sm text-gray-800 mb-1">云同步模式</div>
          <div className="text-xs text-gray-400">数据自动同步到云端</div>
        </div>
      </div>
    </div>
  );
}
