import { ArrowLeft, Plus, Grid3X3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function IconManagement() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate('/profile')} className="p-2">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">图标管理</h1>
        <button className="p-2">
          <Plus size={24} className="text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-800 mb-3">已安装图标包</div>
          <div className="grid grid-cols-3 gap-3">
            {['系统默认', '可爱图标', '简约图标'].map((name) => (
              <button key={name} className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <Grid3X3 size={24} className="text-gray-400" />
                <span className="text-xs text-gray-600">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
