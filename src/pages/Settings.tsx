import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      <div className="bg-white px-4 py-3 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate('/profile')} className="p-2">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 flex-1 text-center pr-10">设置</h1>
      </div>
      <div className="p-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-sm text-gray-800 mb-2">货币单位</div>
          <div className="text-xs text-gray-400">CNY (人民币)</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-sm text-gray-800 mb-2">记账提醒</div>
          <div className="text-xs text-gray-400">已关闭</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-sm text-gray-800 mb-2">指纹/面容解锁</div>
          <div className="text-xs text-gray-400">未开启</div>
        </div>
      </div>
    </div>
  );
}
