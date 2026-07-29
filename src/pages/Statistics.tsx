import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from 'recharts';
import { useTransactionStore } from '../stores/useTransactionStore';
import { useAssetStore } from '../stores/useAssetStore';
import { formatNumber, formatAmount, formatCurrency } from '../utils/formatters';
import { categoryIcons, categoryColors } from '../data/mockData';
import * as Icons from 'lucide-react';
import { ChevronRight, Calendar as CalIcon } from 'lucide-react';
import DatePickerModal from '../components/DatePickerModal';

const statTabs = ['日常', '月统计', '年统计', '资产统计'];
const chartTypes = ['支出', '收入', '结余'];

const assetTrendData = [
  { date: '26.02.10', value: 3500 },
  { date: '26.03.05', value: 6200 },
  { date: '26.04.10', value: 8500 },
  { date: '26.04.15', value: 8500 },
  { date: '26.05.01', value: 9200 },
  { date: '26.05.14', value: 10550 },
];

const costTrendData = [
  { date: '26.02.10', value: 45 },
  { date: '26.03.05', value: 78 },
  { date: '26.04.10', value: 95 },
  { date: '26.04.15', value: 95 },
  { date: '26.05.01', value: 108 },
  { date: '26.05.14', value: 122.17 },
];

type DateMode = 'month' | 'year' | 'custom';

export default function Statistics() {
  const [activeTab, setActiveTab] = useState('月统计');
  const [chartType, setChartType] = useState('支出');
  const [rankType, setRankType] = useState('支出');
  
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>('month');
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6);
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-30');

  const getDailyData = useTransactionStore((s) => s.getDailyData);
  const getMonthlySummary = useTransactionStore((s) => s.getMonthlySummary);
  const getCategoryStats = useTransactionStore((s) => s.getCategoryStats);
  const getSummaryByRange = useTransactionStore((s) => s.getSummaryByRange);
  const getDailyDataByRange = useTransactionStore((s) => s.getDailyDataByRange);
  const getCategoryStatsByRange = useTransactionStore((s) => s.getCategoryStatsByRange);
  const getTotalAssetValue = useAssetStore((s) => s.getTotalAssetValue);
  const getTotalDailyCost = useAssetStore((s) => s.getTotalDailyCost);
  const getCategoryBreakdown = useAssetStore((s) => s.getCategoryBreakdown);
  const assets = useAssetStore((s) => s.assets);

  const { dateLabel, summary, barData, pieData } = useMemo(() => {
    let label = '';
    let summaryData = { income: 0, expense: 0, balance: 0, count: 0 };
    let bar: { day: string; amount: number }[] = [];
    let pie: { name: string; amount: number; count: number; percentage: number; color: string }[] = [];

    if (dateMode === 'month') {
      label = `${year}年${month}月`;
      const m = getMonthlySummary(year, month);
      summaryData = { ...m, count: 0 };
      bar = getDailyData(year, month);
      pie = getCategoryStats(year, month, rankType === '支出' ? 'expense' : 'income');
    } else if (dateMode === 'year') {
      label = `${year}年度`;
      let income = 0, expense = 0;
      for (let m = 1; m <= 12; m++) {
        const s = getMonthlySummary(year, m);
        income += s.income;
        expense += s.expense;
      }
      summaryData = { income, expense, balance: income - expense, count: 0 };
      bar = Array.from({ length: 12 }, (_, i) => {
        const m = i + 1;
        const s = getMonthlySummary(year, m);
        return { day: `${m}月`, amount: s.expense };
      });
      pie = getCategoryStats(year, month, rankType === '支出' ? 'expense' : 'income');
      const allPie: Record<string, { amount: number; count: number }> = {};
      for (let m = 1; m <= 12; m++) {
        const stats = getCategoryStats(year, m, rankType === '支出' ? 'expense' : 'income');
        stats.forEach((s) => {
          if (!allPie[s.name]) allPie[s.name] = { amount: 0, count: 0 };
          allPie[s.name].amount += s.amount;
          allPie[s.name].count += s.count;
        });
      }
      const total = Object.values(allPie).reduce((sum, p) => sum + p.amount, 0);
      const colors = ['#5B9BD5', '#E57373', '#FFB74D', '#81C784', '#9575CD', '#4DD0E1', '#FF8A65', '#A1887F'];
      pie = Object.entries(allPie)
        .map(([name, data], i) => ({
          name,
          amount: data.amount,
          count: data.count,
          percentage: total > 0 ? (data.amount / total) * 100 : 0,
          color: colors[i % colors.length],
        }))
        .sort((a, b) => b.amount - a.amount);
    } else {
      label = `${startDate} 至 ${endDate}`;
      summaryData = getSummaryByRange(startDate, endDate);
      bar = getDailyDataByRange(startDate, endDate);
      pie = getCategoryStatsByRange(startDate, endDate, rankType === '支出' ? 'expense' : 'income');
    }

    return { dateLabel: label, summary: summaryData, barData: bar, pieData: pie };
  }, [dateMode, year, month, startDate, endDate, rankType, getMonthlySummary, getDailyData, getCategoryStats, getSummaryByRange, getDailyDataByRange, getCategoryStatsByRange]);

  const assetCategories = useMemo(() => getCategoryBreakdown(), [getCategoryBreakdown]);
  const totalAssetValue = useMemo(() => getTotalAssetValue(), [getTotalAssetValue]);
  const totalDailyCost = useMemo(() => getTotalDailyCost(), [getTotalDailyCost]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100 text-xs">
          <div className="font-medium mb-1">{label}</div>
          <div className="text-[#43A047]">¥{payload[0].value.toFixed(2)}</div>
        </div>
      );
    }
    return null;
  };

  const handleModeChange = (mode: DateMode) => {
    setDateMode(mode);
  };

  const handleMonthChange = (y: number, m: number) => {
    setYear(y);
    setMonth(m);
    setDateMode('month');
  };

  const handleRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setDateMode('custom');
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      {/* Top Tabs */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {statTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-[#E3F2FD] text-[#4A90D9]' : 'text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 资产统计 Tab */}
      {activeTab === '资产统计' && (
        <>
          {/* Asset Overview Card */}
          <div className="px-4 mb-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-4">资产总览</h3>
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-1">总资产价值</div>
                  <div className="text-2xl font-bold text-gray-800">{formatCurrency(totalAssetValue)}</div>
                </div>
                <div className="flex flex-col gap-2 pl-4 border-l border-gray-100">
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-0.5">资产数量</div>
                    <div className="text-sm font-semibold text-gray-700">{assets.length}件</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-0.5">日均成本</div>
                    <div className="text-sm font-semibold text-gray-700">{formatCurrency(totalDailyCost)}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {assetCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm text-gray-700">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-gray-800">{formatCurrency(cat.value)}</span>
                      <ChevronRight size={14} className="text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Asset Trend */}
          <div className="px-4 mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-3">资产趋势</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-gray-400">当前资产价值</span>
                <span className="text-lg font-bold text-gray-800">{formatCurrency(totalAssetValue)}</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={assetTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="assetGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5B9BD5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#5B9BD5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} tickFormatter={(v) => formatAmount(v)} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="value" stroke="#5B9BD5" strokeWidth={2} fill="url(#assetGradient)" dot={{ r: 4, fill: '#5B9BD5' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Daily Cost Trend */}
          <div className="px-4 mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-3">日均成本趋势</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-gray-400">当前日均成本</span>
                <span className="text-lg font-bold text-gray-800">{formatCurrency(totalDailyCost)}</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#43A047" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#43A047" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="value" stroke="#43A047" strokeWidth={2} fill="url(#costGradient)" dot={{ r: 4, fill: '#43A047' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 非资产统计 Tab */}
      {activeTab !== '资产统计' && (
        <>
          {/* Date Selector */}
          <div className="px-4 mb-3">
            <button
              onClick={() => setPickerOpen(true)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm"
            >
              <CalIcon size={16} className="text-[#4A90D9]" />
              <span className="text-sm font-medium text-gray-700">{dateLabel}</span>
              <ChevronRight size={14} className="text-gray-400 -rotate-90" />
            </button>
          </div>

          {/* Summary Card */}
          <div className="px-4 mb-4">
            <div className="bg-gradient-to-r from-[#5B9BD5] to-[#4A8FD4] rounded-2xl p-5 text-white shadow-lg shadow-blue-200/50">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-xs opacity-90 mb-1">{chartType === '收入' ? '总收入' : chartType === '结余' ? '总结余' : '总支出'}</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(chartType === '收入' ? summary.income : chartType === '结余' ? summary.balance : summary.expense)}
                  </div>
                </div>
                <div className="flex flex-col gap-2 pl-4 border-l border-white/20">
                  <div className="text-right">
                    <div className="text-xs opacity-80 mb-0.5">收入</div>
                    <div className="text-sm font-semibold">{formatCurrency(summary.income)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-80 mb-0.5">支出</div>
                    <div className="text-sm font-semibold">{formatCurrency(summary.expense)}</div>
                  </div>
                </div>
              </div>
              {summary.count > 0 && (
                <div className="text-center mt-4 pt-3 border-t border-white/10 text-xs opacity-80">
                  共 {summary.count} 笔交易
                </div>
              )}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="px-4 mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-semibold text-gray-800">收支统计</span>
                <div className="flex items-center gap-2">
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    {chartTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() => setChartType(t)}
                        className={`px-3 py-1 rounded-md text-xs transition-colors ${
                          chartType === t ? 'bg-[#4A90D9] text-white' : 'text-gray-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} interval="preserveStartEnd" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} tickFormatter={(v) => formatAmount(v)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="amount"
                      fill={chartType === '收入' ? '#E53935' : chartType === '结余' ? '#5B9BD5' : '#43A047'}
                      radius={[3, 3, 0, 0]}
                      maxBarSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pie Chart & Rank */}
          <div className="px-4 mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-semibold text-gray-800">分类排行</span>
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                  {['支出', '收入'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setRankType(t)}
                      className={`px-3 py-1 rounded-md text-xs transition-colors ${
                        rankType === t ? 'bg-[#4A90D9] text-white' : 'text-gray-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div className="w-32 h-32 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={55}
                        paddingAngle={2}
                        dataKey="amount"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 ml-4 space-y-1.5 max-h-32 overflow-y-auto">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-600 truncate max-w-[80px]">{item.name}</span>
                      </div>
                      <span className="text-gray-500">{item.percentage.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {pieData.map((item) => {
                  const iconName = categoryIcons[item.name] || 'Circle';
                  const IconComp = ((Icons as unknown) as Record<string, React.ComponentType<{size?: number; className?: string; style?: React.CSSProperties}>>)[iconName] || Icons.Circle;
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <IconComp size={16} style={{ color: item.color }} />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="text-xs text-gray-400">{item.count}笔</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-[#4A90D9]">{formatCurrency(item.amount)}</div>
                          <div className="text-xs text-gray-400">{item.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <DatePickerModal
        open={pickerOpen}
        mode={dateMode}
        startDate={startDate}
        endDate={endDate}
        year={year}
        month={month}
        onClose={() => setPickerOpen(false)}
        onModeChange={handleModeChange}
        onMonthChange={handleMonthChange}
        onDateRangeChange={handleRangeChange}
      />
    </div>
  );
}
