import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LedgerManagement() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate('/profile')} className="p-2">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">账本管理</h1>
        <button className="p-2">
          <Plus size={24} className="text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <span className="text-xl">📚</span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">个人账本</div>
            <div className="text-xs text-gray-400">默认账本</div>
          </div>
        </div>
      </div>
    </div>
  );
}
