import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Wallet, TrendingDown, Save, X } from 'lucide-react';
import { useBudgetStore } from '../stores/useBudgetStore';
import { useTransactionStore } from '../stores/useTransactionStore';
import { formatNumber } from '../utils/formatters';

export default function Budget() {
  const navigate = useNavigate();
  const { monthlyBudget, yearlyBudget, setMonthlyBudget, setYearlyBudget } = useBudgetStore();
  const getMonthlySummary = useTransactionStore((s) => s.getMonthlySummary);
  const getTransactionsByMonth = useTransactionStore((s) => s.getTransactionsByMonth);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  const monthlySummary = getMonthlySummary(currentYear, currentMonth);
  const yearlyExpense = Array.from({ length: currentMonth }, (_, i) => 
    getMonthlySummary(currentYear, i + 1).expense
  ).reduce((a, b) => a + b, 0);

  const monthlyProgress = (monthlySummary.expense / monthlyBudget) * 100;
  const yearlyProgress = (yearlyExpense / yearlyBudget) * 100;

  const [editingMonthly, setEditingMonthly] = useState(false);
  const [editingYearly, setEditingYearly] = useState(false);
  const [monthlyValue, setMonthlyValue] = useState(String(monthlyBudget));
  const [yearlyValue, setYearlyValue] = useState(String(yearlyBudget));

  const saveMonthly = () => {
    const value = parseFloat(monthlyValue) || 0;
    setMonthlyBudget(value);
    setEditingMonthly(false);
  };

  const saveYearly = () => {
    const value = parseFloat(yearlyValue) || 0;
    setYearlyBudget(value);
    setEditingYearly(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-6">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <span className="text-lg font-semibold text-gray-800">预算管理</span>
        </div>
      </div>

      {/* Monthly Budget Card */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Wallet size={20} className="text-[#4A90D9]" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">月度预算</div>
                <div className="text-xs text-gray-400">{currentYear}年{currentMonth}月</div>
              </div>
            </div>
            {editingMonthly ? (
              <div className="flex items-center gap-2">
                <button onClick={saveMonthly} className="p-1">
                  <Save size={18} className="text-[#4A90D9]" />
                </button>
                <button onClick={() => { setEditingMonthly(false); setMonthlyValue(String(monthlyBudget)); }} className="p-1">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
            ) : (
              <button onClick={() => { setEditingMonthly(true); setMonthlyValue(String(monthlyBudget)); }} className="text-sm text-[#4A90D9]">
                修改
              </button>
            )}
          </div>
          
          <div className="mb-4">
            {editingMonthly ? (
              <input
                type="number"
                value={monthlyValue}
                onChange={(e) => setMonthlyValue(e.target.value)}
                className="text-3xl font-bold text-gray-800 w-full border-b border-gray-200 focus:border-[#4A90D9] outline-none py-1"
                placeholder="0.00"
                autoFocus
              />
            ) : (
              <div className="text-3xl font-bold text-gray-800">{formatNumber(monthlyBudget)}</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">已使用</span>
              <span className="text-gray-800">{formatNumber(monthlySummary.expense)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">剩余</span>
              <span className={monthlyBudget - monthlySummary.expense < 0 ? 'text-red-500' : 'text-[#43A047]'}>
                {formatNumber(Math.max(0, monthlyBudget - monthlySummary.expense))}
              </span>
            </div>
            
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  monthlyProgress > 100 ? 'bg-red-500' : monthlyProgress > 80 ? 'bg-orange-500' : 'bg-[#4A90D9]'
                }`}
                style={{ width: `${Math.min(100, monthlyProgress)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 text-right">
              {monthlyProgress > 100 ? '已超支' : `已使用${monthlyProgress.toFixed(1)}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Budget Card */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingDown size={20} className="text-[#43A047]" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">年度预算</div>
                <div className="text-xs text-gray-400">{currentYear}年度</div>
              </div>
            </div>
            {editingYearly ? (
              <div className="flex items-center gap-2">
                <button onClick={saveYearly} className="p-1">
                  <Save size={18} className="text-[#4A90D9]" />
                </button>
                <button onClick={() => { setEditingYearly(false); setYearlyValue(String(yearlyBudget)); }} className="p-1">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
            ) : (
              <button onClick={() => { setEditingYearly(true); setYearlyValue(String(yearlyBudget)); }} className="text-sm text-[#4A90D9]">
                修改
              </button>
            )}
          </div>
          
          <div className="mb-4">
            {editingYearly ? (
              <input
                type="number"
                value={yearlyValue}
                onChange={(e) => setYearlyValue(e.target.value)}
                className="text-3xl font-bold text-gray-800 w-full border-b border-gray-200 focus:border-[#4A90D9] outline-none py-1"
                placeholder="0.00"
                autoFocus
              />
            ) : (
              <div className="text-3xl font-bold text-gray-800">{formatNumber(yearlyBudget)}</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">已使用</span>
              <span className="text-gray-800">{formatNumber(yearlyExpense)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">剩余</span>
              <span className={yearlyBudget - yearlyExpense < 0 ? 'text-red-500' : 'text-[#43A047]'}>
                {formatNumber(Math.max(0, yearlyBudget - yearlyExpense))}
              </span>
            </div>
            
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  yearlyProgress > 100 ? 'bg-red-500' : yearlyProgress > 80 ? 'bg-orange-500' : 'bg-[#43A047]'
                }`}
                style={{ width: `${Math.min(100, yearlyProgress)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 text-right">
              {yearlyProgress > 100 ? '已超支' : `已使用${yearlyProgress.toFixed(1)}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="px-4 mt-4">
        <div className="bg-blue-50 rounded-2xl p-4">
          <div className="text-xs text-[#4A90D9]">
            <p className="mb-1">💡 小贴士</p>
            <p>设置合理的预算有助于更好地控制支出。当支出超过预算的80%时，进度条会变成橙色提醒您注意；超过100%时会变成红色。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
