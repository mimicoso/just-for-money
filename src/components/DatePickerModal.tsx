import { useState } from 'react';
import { ChevronDown, X, Calendar } from 'lucide-react';

type Mode = 'month' | 'year' | 'custom';

interface Props {
  open: boolean;
  mode: Mode;
  startDate: string;
  endDate: string;
  year: number;
  month: number;
  onClose: () => void;
  onModeChange: (mode: Mode) => void;
  onMonthChange: (year: number, month: number) => void;
  onDateRangeChange: (start: string, end: string) => void;
}

const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export default function DatePickerModal({ open, mode, startDate, endDate, year, month, onClose, onModeChange, onMonthChange, onDateRangeChange }: Props) {
  const [tempYear, setTempYear] = useState(year);
  const [tempMonth, setTempMonth] = useState(month);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  if (!open) return null;

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const confirm = () => {
    if (mode === 'month' || mode === 'year') {
      onMonthChange(tempYear, tempMonth);
    } else {
      if (tempStart && tempEnd && tempStart <= tempEnd) {
        onDateRangeChange(tempStart, tempEnd);
      }
    }
    onClose();
  };

  const selectQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    setTempStart(startStr);
    setTempEnd(endStr);
    onDateRangeChange(startStr, endStr);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-end" onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-3xl max-h-[85vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">选择时间</h3>
          <button onClick={onClose} className="p-1">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(['month', 'year', 'custom'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === m ? 'bg-white text-[#4A90D9] shadow-sm' : 'text-gray-500'
                }`}
              >
                {m === 'month' ? '月统计' : m === 'year' ? '年统计' : '自定义'}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-5 overflow-y-auto max-h-[55vh]">
          {mode === 'month' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setTempYear(tempYear - 1)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <ChevronDown size={20} className="text-gray-600 -rotate-90" />
                </button>
                <span className="text-lg font-semibold text-gray-800">{tempYear}年</span>
                <button
                  onClick={() => setTempYear(tempYear + 1)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <ChevronDown size={20} className="text-gray-600 rotate-90" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {monthNames.map((name, idx) => {
                  const m = idx + 1;
                  const isSelected = tempMonth === m;
                  return (
                    <button
                      key={name}
                      onClick={() => setTempMonth(m)}
                      className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#4A90D9] text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {mode === 'year' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">选择年份</p>
              <div className="grid grid-cols-3 gap-3">
                {years.map((y) => {
                  const isSelected = tempYear === y;
                  return (
                    <button
                      key={y}
                      onClick={() => { setTempYear(y); setTempMonth(1); }}
                      className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#4A90D9] text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {y}年
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {mode === 'custom' && (
            <div>
              <div className="mb-5">
                <label className="text-sm text-gray-500 mb-2 block">快捷选择</label>
                <div className="flex gap-2 flex-wrap">
                  {[7, 15, 30, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => selectQuickRange(days)}
                      className="px-4 py-2 rounded-lg bg-gray-50 text-sm text-gray-600 hover:bg-gray-100"
                    >
                      近{days}天
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">开始日期</label>
                  <input
                    type="date"
                    value={tempStart}
                    onChange={(e) => setTempStart(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">结束日期</label>
                  <input
                    type="date"
                    value={tempEnd}
                    onChange={(e) => setTempEnd(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <button
            onClick={confirm}
            className="w-full py-3 bg-[#4A90D9] text-white rounded-xl text-sm font-medium"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
