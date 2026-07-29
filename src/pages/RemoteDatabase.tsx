import { ArrowLeft, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RemoteDatabase() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      <div className="bg-white px-4 py-3 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate('/profile')} className="p-2">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 flex-1 text-center pr-10">远程数据库</h1>
      </div>
      <div className="p-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Database size={20} className="text-[#4A90D9]" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">MySQL 数据库</div>
              <div className="text-xs text-gray-400">远程数据存储配置</div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">服务器地址</label>
              <input type="text" placeholder="输入服务器地址" className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4A90D9]" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">端口号</label>
              <input type="text" placeholder="3306" className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4A90D9]" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">数据库名</label>
              <input type="text" placeholder="输入数据库名" className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4A90D9]" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">用户名</label>
              <input type="text" placeholder="输入用户名" className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4A90D9]" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">密码</label>
              <input type="password" placeholder="输入密码" className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4A90D9]" />
            </div>
          </div>
          <button className="w-full mt-4 py-3 bg-[#4A90D9] text-white rounded-xl text-sm font-medium">保存配置</button>
        </div>
      </div>
    </div>
  );
}
