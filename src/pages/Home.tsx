import { useMemo, useState } from 'react';
import { ChevronDown, BookOpen, TrendingUp, TrendingDown, Wallet, Check, Square, Plus } from 'lucide-react';
import { useTransactionStore } from '../stores/useTransactionStore';
import { useBudgetStore } from '../stores/useBudgetStore';
import { useUIStore } from '../stores/useUIStore';
import { useLedgerStore } from '../stores/useLedgerStore';
import { formatNumber, formatDateHeader } from '../utils/formatters';
import { categoryIcons, categoryColors } from '../data/mockData';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ActionSheetModal from '../components/ActionSheetModal';
import TransactionItem from '../components/TransactionItem';

export default function Home() {
  const transactions = useTransactionStore((s) => s.transactions);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);
  const deleteTransactions = useTransactionStore((s) => s.deleteTransactions);
  const getMonthlySummary = useTransactionStore((s) => s.getMonthlySummary);
  const { monthlyBudget, getMonthlyBudgetProgress } = useBudgetStore();
  const { setShowAddModal, setEditingTransaction } = useUIStore();
  const { ledgers, activeLedgerId, setActiveLedger, addLedger, getActiveLedger } = useLedgerStore();
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  const activeLedger = getActiveLedger();
  const ledgerTransactions = useMemo(() => 
    transactions.filter(t => t.ledgerId === activeLedgerId), 
    [transactions, activeLedgerId]
  );
  
  const summary = useMemo(() => 
    getMonthlySummary(currentYear, currentMonth, activeLedgerId), 
    [getMonthlySummary, currentYear, currentMonth, activeLedgerId]
  );
  const budgetProgress = useMemo(() => getMonthlyBudgetProgress(summary.expense), [getMonthlyBudgetProgress, summary.expense]);
  
  const totalAsset = useMemo(() => {
    const allIncome = ledgerTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const allExpense = ledgerTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return allIncome - allExpense;
  }, [ledgerTransactions]);

  const [actionOpen, setActionOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [batchDeleteOpen, setBatchDeleteOpen] = useState(false);
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ledgerPickerOpen, setLedgerPickerOpen] = useState(false);
  const [showAddLedger, setShowAddLedger] = useState(false);
  const [newLedgerName, setNewLedgerName] = useState('');

  const grouped = ledgerTransactions.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {} as Record<string, typeof ledgerTransactions>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const handleLongPress = (id: string, name: string) => {
    if (selectMode) return;
    setTarget({ id, name });
    setActionOpen(true);
  };

  const handleEdit = () => {
    if (target) {
      const tx = transactions.find((t) => t.id === target.id);
      if (tx) {
        setEditingTransaction(tx);
        setTimeout(() => {
          setShowAddModal(true);
        }, 0);
      }
    }
    setActionOpen(false);
  };

  const handleDeleteClick = () => {
    setActionOpen(false);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (target) {
      deleteTransaction(target.id);
    }
    setDeleteOpen(false);
    setTarget(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === ledgerTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ledgerTransactions.map(t => t.id));
    }
  };

  const handleBatchDeleteClick = () => {
    if (selectedIds.length > 0) {
      setBatchDeleteOpen(true);
    }
  };

  const handleConfirmBatchDelete = () => {
    deleteTransactions(selectedIds);
    setSelectedIds([]);
    setSelectMode(false);
    setBatchDeleteOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex-1">
          {!selectMode && ledgerTransactions.length > 0 && (
            <button
              onClick={() => { setSelectMode(true); setSelectedIds([]); }}
              className="text-sm text-[#4A90D9]"
            >
              编辑
            </button>
          )}
        </div>
        <button
          onClick={() => setLedgerPickerOpen(true)}
          className="text-lg font-semibold text-gray-800 flex items-center gap-2"
        >
          <BookOpen size={20} className="text-[#4A90D9]" />
          {activeLedger?.name || '个人账本'}
          <ChevronDown size={16} className="text-gray-500" />
        </button>
        <div className="flex-1 text-right" />
      </div>

      {/* Ledger Picker Modal */}
      {ledgerPickerOpen && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-end" onClick={() => { setLedgerPickerOpen(false); setShowAddLedger(false); setNewLedgerName(''); }}>
          <div
            className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-5 animate-slide-up max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-gray-800 mb-4 text-center">选择账本</h3>
            <div className="space-y-2 mb-4">
              {ledgers.map((ledger) => (
                <button
                  key={ledger.id}
                  onClick={() => {
                    setActiveLedger(ledger.id);
                    setLedgerPickerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    ledger.id === activeLedgerId
                      ? 'bg-blue-50 border border-[#4A90D9]'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: (ledger.color || '#4A90D9') + '15' }}
                  >
                    <BookOpen size={20} style={{ color: ledger.color || '#4A90D9' }} />
                  </div>
                  <span className="flex-1 text-left text-sm font-medium text-gray-800">{ledger.name}</span>
                  {ledger.id === activeLedgerId && (
                    <Check size={18} className="text-[#4A90D9]" />
                  )}
                </button>
              ))}
            </div>
            {!showAddLedger ? (
              <button
                onClick={() => setShowAddLedger(true)}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Plus size={18} />
                新建账本
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newLedgerName}
                  onChange={(e) => setNewLedgerName(e.target.value)}
                  placeholder="输入账本名称"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-[#4A90D9]/20"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowAddLedger(false); setNewLedgerName(''); }}
                    className="flex-1 py-3 rounded-xl bg-gray-100 text-sm text-gray-600 font-medium"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      if (newLedgerName.trim()) {
                        addLedger({ name: newLedgerName.trim() });
                        setShowAddLedger(false);
                        setNewLedgerName('');
                      }
                    }}
                    className="flex-1 py-3 rounded-xl bg-[#4A90D9] text-sm text-white font-medium"
                  >
                    创建
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Select Mode Bar */}
      {selectMode && (
        <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            {selectedIds.length === ledgerTransactions.length ? (
              <Check size={18} className="text-[#4A90D9]" />
            ) : (
              <Square size={18} className="text-gray-300" />
            )}
            全选
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">已选 {selectedIds.length} 项</span>
            <button
              onClick={() => { setSelectMode(false); setSelectedIds([]); }}
              className="text-sm text-gray-600 px-3 py-1.5"
            >
              取消
            </button>
            <button
              onClick={handleBatchDeleteClick}
              disabled={selectedIds.length === 0}
              className="text-sm text-white bg-red-500 px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              删除
            </button>
          </div>
        </div>
      )}

      {/* Summary Card */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-[#5B9BD5] to-[#4A8FD4] rounded-2xl p-5 text-white shadow-lg shadow-blue-200/50">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center min-w-0">
              <div className="text-xs opacity-90 mb-1.5">本月收入</div>
              <div className="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis">{formatNumber(summary.income)}</div>
            </div>
            <div className="text-center min-w-0 border-x border-white/20">
              <div className="text-xs opacity-90 mb-1.5">本月支出</div>
              <div className="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis">{formatNumber(summary.expense)}</div>
            </div>
            <div className="text-center min-w-0">
              <div className="text-xs opacity-90 mb-1.5">本月结余</div>
              <div className="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis">{formatNumber(summary.balance)}</div>
            </div>
          </div>
          <div className="mb-3">
            <div className="text-xs opacity-90 mb-1">总资产(元)</div>
            <div className="text-2xl font-bold">{formatNumber(totalAsset)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1">
                <Wallet size={14} className="opacity-80" />
                <span className="text-xs opacity-90">月度预算</span>
              </div>
              <span className="text-xs opacity-90 whitespace-nowrap">
                {formatNumber(budgetProgress.used)} / {formatNumber(monthlyBudget)}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${budgetProgress.percentage}%` }}
              />
            </div>
            <div className="text-xs opacity-70 mt-1 text-right">
              {budgetProgress.percentage > 100 ? '已超支' : `剩余${formatNumber(budgetProgress.remaining)}`}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-4 space-y-3">
        {sortedDates.map((date) => {
          const dayTrans = grouped[date];
          const dayIncome = dayTrans.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
          const dayExpense = dayTrans.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

          return (
            <div key={date} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-800">{formatDateHeader(date)}</span>
                <div className="text-xs">
                  <span className="text-[#43A047] mr-2">收 {dayIncome.toFixed(2)}</span>
                  <span className="text-[#E53935]">支 {dayExpense.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-1">
                {dayTrans.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center gap-3 rounded-xl p-2 transition-colors w-full overflow-hidden ${
                      selectMode
                        ? selectedIds.includes(t.id)
                          ? 'bg-blue-50'
                          : 'active:bg-gray-50'
                        : ''
                    }`}
                    onClick={() => selectMode && toggleSelect(t.id)}
                  >
                    {selectMode && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSelect(t.id); }}
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
                      >
                        {selectedIds.includes(t.id) ? (
                          <div className="w-5 h-5 rounded-full bg-[#4A90D9] flex items-center justify-center">
                            <Check size={12} className="text-white" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                      </button>
                    )}
                    <TransactionItem
                      transaction={t}
                      categoryIcons={categoryIcons}
                      categoryColors={categoryColors}
                      onLongPress={handleLongPress}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <ActionSheetModal
        open={actionOpen}
        title={target?.name || ''}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onCancel={() => { setActionOpen(false); setTarget(null); }}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        title={`是否删除「${target?.name || ''}」?`}
        onCancel={() => { setDeleteOpen(false); setTarget(null); }}
        onConfirm={handleConfirmDelete}
      />

      <DeleteConfirmModal
        open={batchDeleteOpen}
        title={`是否删除选中的 ${selectedIds.length} 条账单?`}
        onCancel={() => { setBatchDeleteOpen(false); }}
        onConfirm={handleConfirmBatchDelete}
      />
    </div>
  );
}
