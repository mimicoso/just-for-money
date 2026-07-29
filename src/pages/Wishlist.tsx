import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate('/profile')} className="p-2">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">愿望清单</h1>
        <button className="p-2">
          <Plus size={24} className="text-gray-600" />
        </button>
      </div>
      <div className="p-4 text-center text-gray-400 mt-20">暂无愿望，点击右上角添加</div>
    </div>
  );
}
