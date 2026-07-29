import { useState, useMemo, useEffect } from 'react';
import { generateCalendarDays, getMonthTitle, getWeekdayName } from '../utils/dateUtils';
import { useTransactionStore } from '../stores/useTransactionStore';
import { useUIStore } from '../stores/useUIStore';
import { formatCurrency } from '../utils/formatters';
import { Calendar as CalIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLongPress } from '../hooks/useLongPress';
import ActionSheetModal from '../components/ActionSheetModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function Calendar() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6);
  const { selectedDate, setSelectedDate, setShowAddModal, setEditingTransaction } = useUIStore();
  const transactions = useTransactionStore((s) => s.transactions);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);
  const getTransactionsByDate = useTransactionStore((s) => s.getTransactionsByDate);
  const getMonthlySummary = useTransactionStore((s) => s.getMonthlySummary);

  const [actionOpen, setActionOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(year);

  useEffect(() => {
    const currentMonthTx = transactions.filter((t) =>
      t.date.startsWith(`${year}-${String(month).padStart(2, '0')}`)
    );
    if (currentMonthTx.length > 0 && !selectedDate.startsWith(`${year}-${String(month).padStart(2, '0')}`)) {
      setSelectedDate(currentMonthTx[0].date);
    }
  }, [year, month, transactions, selectedDate, setSelectedDate]);

  const transactionDates = useMemo(() => new Set(transactions.map((t) => t.date)), [transactions]);
  const days = useMemo(() => generateCalendarDays(year, month, new Date(selectedDate), transactionDates), [year, month, selectedDate, transactionDates]);
  const summary = useMemo(() => getMonthlySummary(year, month), [getMonthlySummary, year, month]);
  const dayTrans = useMemo(() => getTransactionsByDate(selectedDate), [getTransactionsByDate, selectedDate]);
  const dayIncome = useMemo(() => dayTrans.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0), [dayTrans]);
  const dayExpense = useMemo(() => dayTrans.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [dayTrans]);

  const handleToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
    setSelectedDate(now.toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (month === 1) { setYear(year - 1); setMonth(12); }
              else { setMonth(month - 1); }
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button onClick={() => { setPickerYear(year); setPickerOpen(true); }}>
            <h2 className="text-xl font-bold text-gray-800">{getMonthTitle(year, month)}</h2>
          </button>
          <button
            onClick={() => {
              if (month === 12) { setYear(year + 1); setMonth(1); }
              else { setMonth(month + 1); }
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
        <button
          onClick={handleToday}
          className="w-9 h-9 bg-[#4A90D9] rounded-full flex items-center justify-center text-white text-sm font-medium"
        >
          今
        </button>
      </div>

      {/* Month Summary */}
      <div className="px-4 mb-3 text-sm">
        <span className="text-[#E53935]">收¥{summary.income.toFixed(2)}</span>
        <span className="text-[#43A047] mx-2">支¥{summary.expense.toFixed(2)}</span>
        <span className="text-[#E53935]">余¥{summary.balance.toFixed(2)}</span>
      </div>

      {/* Calendar Grid */}
      <div className="px-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-7 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
              <div key={d} className="text-center text-xs text-gray-400 py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {days.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDate(day.fullDate)}
                className={`flex flex-col items-center justify-center py-2 rounded-lg transition-colors ${
                  day.isSelected ? 'bg-[#4A90D9] text-white' : day.isToday ? 'text-[#4A90D9]' : 'text-gray-800'
                } ${!day.isCurrentMonth ? 'opacity-30' : ''}`}
              >
                <span className="text-base font-medium">{day.date}</span>
                <span className={`text-[10px] ${day.isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                  {day.lunar}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Day Detail */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm min-h-[200px]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base font-semibold text-gray-800">
              {selectedDate.split('-')[1].replace(/^0/, '')}月{selectedDate.split('-')[2].replace(/^0/, '')}日 {getWeekdayName(selectedDate)}
            </span>
            <div className="text-xs">
              <span className="text-[#43A047] mr-2">支出¥{dayExpense.toFixed(2)}</span>
              <span className="text-[#E53935]">收入¥{dayIncome.toFixed(2)}</span>
            </div>
          </div>

          {dayTrans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                <CalIcon size={32} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-500">当天暂无账单</p>
              <p className="text-xs text-gray-400 mt-1">点击下方记账按钮开始记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayTrans.map((t) => (
                <CalendarTransactionItem
                  key={t.id}
                  transaction={t}
                  onLongPress={() => {
                    setTarget({ id: t.id, name: `${t.category}-${t.subcategory}` });
                    setActionOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ActionSheetModal
        open={actionOpen}
        title={target?.name || ''}
        onEdit={() => {
          if (target) {
            const tx = transactions.find((t) => t.id === target.id);
            if (tx) {
              setEditingTransaction(tx);
              setShowAddModal(true);
            }
          }
          setActionOpen(false);
        }}
        onDelete={() => {
          setActionOpen(false);
          setDeleteOpen(true);
        }}
        onCancel={() => { setActionOpen(false); setTarget(null); }}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        title={`是否删除「${target?.name || ''}」?`}
        onCancel={() => { setDeleteOpen(false); setTarget(null); }}
        onConfirm={() => {
          if (target) deleteTransaction(target.id);
          setDeleteOpen(false);
          setTarget(null);
        }}
      />

      {/* Month Picker */}
      {pickerOpen && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-end" onClick={() => setPickerOpen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-gray-800">选择月份</h3>
              <button onClick={() => setPickerOpen(false)} className="p-1">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setPickerYear(pickerYear - 1)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <span className="text-lg font-semibold text-gray-800">{pickerYear}年</span>
              <button
                onClick={() => setPickerYear(pickerYear + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <button
                  key={m}
                  onClick={() => { setYear(pickerYear); setMonth(m); setPickerOpen(false); }}
                  className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                    year === pickerYear && month === m
                      ? 'bg-[#4A90D9] text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {m}月
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarTransactionItem({
  transaction,
  onLongPress,
}: {
  transaction: { id: string; type: 'income' | 'expense'; category: string; subcategory: string; account: string; note: string; amount: number };
  onLongPress: () => void;
}) {
  const longPressProps = useLongPress(onLongPress, 600);
  const isIncome = transaction.type === 'income';
  return (
    <div className="flex justify-between items-center select-none" {...longPressProps}>
      <div>
        <div className="text-sm font-medium">{transaction.category}-{transaction.subcategory}</div>
        <div className="text-xs text-gray-400">{transaction.account} {transaction.note}</div>
      </div>
      <div className={`text-sm font-semibold ${isIncome ? 'text-[#E53935]' : 'text-[#43A047]'}`}>
        {isIncome ? '+' : '-'}{transaction.amount.toFixed(2)}
      </div>
    </div>
  );
}
