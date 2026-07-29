import { ArrowLeft, Upload, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ImportExport() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      <div className="bg-white px-4 py-3 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate('/profile')} className="p-2">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 flex-1 text-center pr-10">导入导出</h1>
      </div>
      <div className="p-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-800 mb-3">导入账单</div>
          <button className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-[#4A90D9] transition-colors">
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm text-gray-500">点击或拖拽文件到此处</span>
            <span className="text-xs text-gray-400">支持 Excel/CSV/TXT 格式</span>
          </button>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-800 mb-3">导出账单</div>
          <button className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Download size={20} className="text-[#4A90D9]" />
              <div>
                <div className="text-sm font-medium text-gray-800">导出为 CSV</div>
                <div className="text-xs text-gray-400">通用表格格式</div>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-green-50 rounded-xl mt-2">
            <div className="flex items-center gap-3">
              <Download size={20} className="text-green-500" />
              <div>
                <div className="text-sm font-medium text-gray-800">导出为 Excel</div>
                <div className="text-xs text-gray-400">支持 Excel 2007+</div>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
