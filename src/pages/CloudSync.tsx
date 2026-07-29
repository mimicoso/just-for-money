import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CloudSync() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      <div className="bg-white px-4 py-3 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate('/profile')} className="p-2">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 flex-1 text-center pr-10">云同步</h1>
      </div>
      <div className="p-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <RefreshCw size={20} className="text-[#4A90D9]" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">同步状态</div>
                <div className="text-xs text-green-500">已同步</div>
              </div>
            </div>
            <button className="text-xs text-[#4A90D9] px-3 py-1.5 bg-blue-50 rounded-lg">立即同步</button>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">已同步账单</span>
              <span className="text-gray-800">2,862条</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">上次同步</span>
              <span className="text-gray-800">今天 11:22</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-800 mb-1">同步提示</div>
              <div className="text-xs text-gray-400 leading-relaxed">
                数据会自动同步到云端，确保数据安全。建议定期检查同步状态。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
