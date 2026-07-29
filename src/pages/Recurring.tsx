import { useState } from 'react';
import { ChevronLeft, Plus, Edit2, Trash2, Calendar, Repeat, Wallet, X } from 'lucide-react';
import { useRecurringStore, type RecurringType } from '../stores/useRecurringStore';
import { useTransactionStore } from '../stores/useTransactionStore';
import { useLedgerStore } from '../stores/useLedgerStore';
import { formatCurrency } from '../utils/formatters';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const recurringLabels: Record<RecurringType, string> = {
  daily: '每天',
  weekly: '每周',
  monthly: '每月',
  yearly: '每年',
};

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const categories = {
  expense: ['餐饮', '交通', '购物', '居住', '娱乐', '医疗', '教育', '其他'],
  income: ['工资', '奖金补贴', '投资收益', '兼职', '其他'],
};

const accounts = ['工资卡', '银行卡', '微信支付', '支付宝', '现金'];

export default function Recurring() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, toggleEnabled, executeTransaction } = useRecurringStore();
  const addTx = useTransactionStore((s) => s.addTransaction);
  const { activeLedgerId } = useLedgerStore();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [recurringType, setRecurringType] = useState<RecurringType>('monthly');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAdd = () => {
    setEditingId(null);
    setName('');
    setAmount('');
    setType('expense');
    setCategory('');
    setAccount('');
    setRecurringType('monthly');
    setDayOfMonth(new Date().getDate());
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setModalOpen(true);
  };

  const handleEdit = (tx: typeof transactions[0]) => {
    setEditingId(tx.id);
    setName(tx.name);
    setAmount(tx.amount.toString());
    setType(tx.type);
    setCategory(tx.category);
    setAccount(tx.account);
    setRecurringType(tx.recurringType);
    setDayOfWeek(tx.dayOfWeek || 1);
    setDayOfMonth(tx.dayOfMonth || 1);
    setStartDate(tx.startDate);
    setEndDate(tx.endDate || '');
    setModalOpen(true);
  };

  const handleSave = () => {
    const amt = parseFloat(amount) || 0;
    if (!name.trim()) { alert('请输入记账名称'); return; }
    if (!category) { alert('请选择分类'); return; }
    if (!account) { alert('请选择账户'); return; }
    if (!startDate) { alert('请选择开始日期'); return; }
    if (amt <= 0) { alert('请输入金额'); return; }
    
    const txData = {
      name: name.trim(),
      amount: amt,
      type,
      category,
      account,
      recurringType,
      dayOfWeek: recurringType === 'weekly' ? dayOfWeek : undefined,
      dayOfMonth: recurringType === 'monthly' || recurringType === 'yearly' ? dayOfMonth : undefined,
      startDate,
      endDate: endDate || undefined,
      enabled: editingId !== null ? transactions.find(t => t.id === editingId)?.enabled : true,
    };

    if (editingId) {
      updateTransaction(editingId, txData);
    } else {
      addTransaction(txData);
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteTransaction(deleteTarget.id);
    }
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const getScheduleText = (tx: typeof transactions[0]) => {
    if (tx.recurringType === 'daily') return recurringLabels.daily;
    if (tx.recurringType === 'weekly') return `${recurringLabels.weekly}${weekdays[tx.dayOfWeek || 1]}`;
    if (tx.recurringType === 'monthly') return `${recurringLabels.monthly}${tx.dayOfMonth}日`;
    if (tx.recurringType === 'yearly') return `${recurringLabels.yearly}${tx.dayOfMonth}日`;
    return '';
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      <div className="bg-white px-4 pt-4 pb-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 flex items-center justify-center" onClick={() => window.history.back()}>
            <ChevronLeft size={22} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">周期记账</h1>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  tx.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <Repeat size={20} className={tx.type === 'income' ? 'text-green-500' : 'text-red-500'} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-semibold text-gray-800">{tx.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      tx.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {tx.enabled ? '开启' : '关闭'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {getScheduleText(tx)}
                    </span>
                    <span className="mx-2">·</span>
                    <span className="flex items-center gap-1">
                      <Wallet size={14} />
                      {tx.account}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
                <div className="text-xs text-gray-400 mt-1">{tx.category}</div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-50">
              <button onClick={() => toggleEnabled(tx.id)} className={`text-xs px-3 py-1.5 rounded-lg ${
                tx.enabled ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'
              }`}>
                {tx.enabled ? '暂停' : '开启'}
              </button>
              <button onClick={() => handleEdit(tx)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600">
                编辑
              </button>
              <button onClick={() => { setDeleteTarget({ id: tx.id, name: tx.name }); setDeleteOpen(true); }} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600">
                删除
              </button>
              {tx.enabled && (
                <button onClick={() => {
                  executeTransaction(tx.id);
                  addTx({
                    ledgerId: activeLedgerId,
                    type: tx.type,
                    amount: tx.amount,
                    category: tx.category,
                    subcategory: tx.category,
                    account: tx.account,
                    date: new Date().toISOString().split('T')[0],
                    note: `[周期]${tx.name}`,
                  });
                  alert(`已执行「${tx.name}」，${tx.type === 'income' ? '+' : '-'}${formatCurrency(tx.amount)}`);
                }} className="text-xs px-3 py-1.5 rounded-lg bg-[#4A90D9] text-white">
                  立即执行
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAdd}
        className="fixed right-4 bottom-20 w-14 h-14 bg-[#4A90D9] rounded-full shadow-lg shadow-blue-300/50 flex items-center justify-center text-white z-[60]"
      >
        <Plus size={28} />
      </button>

      <DeleteConfirmModal
        open={deleteOpen}
        title={`是否删除周期记账「${deleteTarget?.name || ''}」?`}
        onCancel={() => { setDeleteOpen(false); setDeleteTarget(null); }}
        onConfirm={handleConfirmDelete}
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-end" onClick={() => setModalOpen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 animate-slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-gray-800">{editingId ? '编辑周期记账' : '新增周期记账'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-2 block">记账名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="如: 工资收入、房租"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                  autoFocus
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-500 mb-2 block">收支类型</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setType('expense'); setCategory(''); }}
                      className={`py-2.5 rounded-xl text-xs font-medium transition-colors ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-50 text-gray-600'}`}
                    >
                      支出
                    </button>
                    <button
                      onClick={() => { setType('income'); setCategory(''); }}
                      className={`py-2.5 rounded-xl text-xs font-medium transition-colors ${type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-50 text-gray-600'}`}
                    >
                      收入
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-500 mb-2 block">金额</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">分类</label>
                <div className="flex flex-wrap gap-2">
                  {categories[type].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        category === cat ? 'bg-[#4A90D9] text-white' : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">账户</label>
                <div className="flex flex-wrap gap-2">
                  {accounts.map((acc) => (
                    <button
                      key={acc}
                      onClick={() => setAccount(acc)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        account === acc ? 'bg-[#4A90D9] text-white' : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {acc}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">周期类型</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(recurringLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setRecurringType(key as RecurringType)}
                      className={`py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        recurringType === key ? 'bg-[#4A90D9] text-white' : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {recurringType === 'weekly' && (
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">星期几</label>
                  <div className="grid grid-cols-7 gap-2">
                    {weekdays.map((day, idx) => (
                      <button
                        key={day}
                        onClick={() => setDayOfWeek(idx)}
                        className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                          dayOfWeek === idx ? 'bg-[#4A90D9] text-white' : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(recurringType === 'monthly' || recurringType === 'yearly') && (
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">每月/每年几号</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(Math.min(31, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-sm text-gray-500 mb-2 block">开始日期</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">结束日期（可选）</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSave}
                disabled={!name.trim() || !category || !account || !startDate}
                className="w-full py-3 bg-[#4A90D9] text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {editingId ? '保存修改' : '创建周期记账'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
