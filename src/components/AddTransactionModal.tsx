import { useState, useRef, useCallback, useEffect } from 'react';
import { X, RefreshCw, Plus, Calendar, Wallet, Tag, ChevronDown } from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';
import { useTransactionStore } from '../stores/useTransactionStore';
import { useLedgerStore } from '../stores/useLedgerStore';
import { useAccountStore } from '../stores/useAccountStore';

type TabType = 'expense' | 'income' | 'transfer';

const expenseCategories = [
  { id: '饮食', icon: 'UtensilsCrossed' },
  { id: '服饰', icon: 'Shirt' },
  { id: '住房', icon: 'Home' },
  { id: '服务保障', icon: 'Shield' },
  { id: '日常家居', icon: 'Armchair' },
  { id: '购物消费', icon: 'ShoppingCart' },
  { id: '交通', icon: 'Bus' },
  { id: '旅行', icon: 'Plane' },
  { id: '美妆个护', icon: 'Sparkles' },
  { id: '学习教育', icon: 'BookOpen' },
  { id: '日常用品', icon: 'Package' },
  { id: '医疗保障', icon: 'BriefcaseMedical' },
  { id: '转账红包', icon: 'Gift' },
  { id: '汽车', icon: 'Car' },
  { id: '娱乐', icon: 'Gamepad2' },
  { id: '请客送礼', icon: 'Crown' },
  { id: '数码电器', icon: 'Camera' },
  { id: '运动户外', icon: 'Activity' },
  { id: '其它', icon: 'Grid3X3' },
  { id: '充值缴费', icon: 'Zap' },
  { id: '付费会员', icon: 'Star' },
];

const incomeCategories = [
  { id: '工资', icon: 'Wallet' },
  { id: '转账红包', icon: 'Gift' },
  { id: '兼职外快', icon: 'User' },
  { id: '其它收入', icon: 'Grid3X3' },
  { id: '差旅补贴', icon: 'Plane' },
  { id: '信用借还', icon: 'Handshake' },
  { id: '理财盈利', icon: 'TrendingUp' },
  { id: '租金', icon: 'Home' },
  { id: '提现', icon: 'Wallet' },
  { id: '公积金', icon: 'Landmark' },
  { id: '二手置换', icon: 'RefreshCw' },
  { id: '退税', icon: 'FileText' },
  { id: '医保', icon: 'Heart' },
  { id: '退款', icon: 'Undo2' },
];

const tabColors: Record<TabType, { bg: string; text: string; border: string }> = {
  expense: { bg: '#E53935', text: '#E53935', border: '#E53935' },
  income: { bg: '#43A047', text: '#43A047', border: '#43A047' },
  transfer: { bg: '#4A90D9', text: '#4A90D9', border: '#4A90D9' },
};

function formatDateDisplay(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  if (isToday) return `今天 ${hours}:${mins}`;
  return `${month}月${day}日 ${hours}:${mins}`;
}

export default function AddTransactionModal() {
  const { showAddModal, setShowAddModal, editingTransaction, setEditingTransaction } = useUIStore();
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const updateTransaction = useTransactionStore((s) => s.updateTransaction);
  const { activeLedgerId } = useLedgerStore();
  const { accounts } = useAccountStore();
  
  const accountList = accounts.map(a => a.name);
  
  const [tab, setTab] = useState<TabType>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [account, setAccount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [discount, setDiscount] = useState('');
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [accountPickerFor, setAccountPickerFor] = useState<'account' | 'from' | 'to'>('account');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (showAddModal) {
      if (editingTransaction) {
        setTab(editingTransaction.type === 'income' ? 'income' : 'expense');
        setCategory(editingTransaction.category);
        setAmount(String(editingTransaction.amount));
        setNote(editingTransaction.note);
        setAccount(editingTransaction.account);
        setDate(editingTransaction.date);
        setDiscount('');
      } else {
        setTab('expense');
        setCategory('');
        setAmount('');
        setNote('');
        setAccount(accountList[0] || '');
        setFromAccount(accountList[0] || '');
        setToAccount(accountList[1] || '');
        setDate(new Date().toISOString().split('T')[0]);
        setDiscount('');
      }
    }
  }, [editingTransaction, showAddModal, accountList]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = touchEndX.current - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0 && tab !== 'expense') {
        setTab(tab === 'income' ? 'expense' : 'income');
      } else if (deltaX < 0 && tab !== 'transfer') {
        setTab(tab === 'expense' ? 'income' : 'transfer');
      }
    }
  }, [tab]);

  if (!showAddModal) return null;

  const categories = tab === 'expense' ? expenseCategories : incomeCategories;

  const handleNumberClick = (num: string) => {
    if (num === 'backspace') {
      setAmount((prev) => prev.slice(0, -1));
    } else if (num === '.') {
      if (!amount.includes('.')) {
        setAmount((prev) => prev + '.');
      }
    } else if (num === '-') {
      setAmount((prev) => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
    } else if (num === '+') {
      setAmount((prev) => prev.startsWith('-') ? prev.slice(1) : prev);
    } else {
      if (amount.length < 12) {
        const parts = amount.split('.');
        if (parts[1] && parts[1].length >= 2) return;
        setAmount((prev) => prev + num);
      }
    }
  };

  const openAccountPicker = (forWhich: 'account' | 'from' | 'to') => {
    setAccountPickerFor(forWhich);
    setShowAccountPicker(true);
  };

  const selectAccount = (acc: string) => {
    if (accountPickerFor === 'account') setAccount(acc);
    else if (accountPickerFor === 'from') setFromAccount(acc);
    else if (accountPickerFor === 'to') setToAccount(acc);
    setShowAccountPicker(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleSubmit = () => {
    if (tab !== 'transfer' && (!category || !amount)) {
      if (!category) alert('请先选择分类');
      else if (!amount) alert('请输入金额');
      return;
    }
    if (tab === 'transfer' && (!fromAccount || !toAccount || !amount)) {
      if (!fromAccount || !toAccount) alert('请填写转出和转入账户');
      else if (!amount) alert('请输入金额');
      return;
    }
    const finalAmount = discount ? parseFloat(amount) - parseFloat(discount) : parseFloat(amount);
    if (tab !== 'transfer') {
      const txData = {
        ledgerId: activeLedgerId,
        type: tab as 'income' | 'expense',
        amount: Math.abs(finalAmount),
        category,
        subcategory: category,
        account,
        date,
        note: discount ? `${note} (优惠${discount})`.trim() : note,
      };
      if (editingTransaction) {
        updateTransaction(editingTransaction.id, txData);
      } else {
        addTransaction(txData);
      }
    }
    setShowAddModal(false);
    setEditingTransaction(null);
    setAmount('');
    setNote('');
    setCategory('');
    setDiscount('');
  };

  const handleClose = () => {
    setShowAddModal(false);
    setEditingTransaction(null);
    setAmount('');
    setNote('');
    setCategory('');
    setDiscount('');
    setShowAccountPicker(false);
    setShowDatePicker(false);
    setShowDiscountInput(false);
  };

  const swapAccounts = () => {
    const temp = fromAccount;
    setFromAccount(toAccount);
    setToAccount(temp);
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'expense', label: '支出' },
    { key: 'income', label: '收入' },
    { key: 'transfer', label: '转账' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-end" onClick={handleClose}>
      <div
        className="bg-white w-full max-w-md mx-auto rounded-t-3xl flex flex-col max-h-[85vh] animate-slide-up relative z-10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button onClick={handleClose} className="p-2">
            <X size={24} className="text-gray-500" />
          </button>
          <div className="flex-1 flex justify-center gap-8">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`text-lg font-medium relative pb-1 transition-colors ${
                  tab === t.key ? 'text-gray-800' : 'text-gray-400'
                }`}
              >
                {t.label}
                {tab === t.key && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5" style={{ backgroundColor: tabColors[tab].bg }} />
                )}
              </button>
            ))}
          </div>
          {tab !== 'transfer' && (
            <button className="p-2">
              <Plus size={24} className="text-gray-500" />
            </button>
          )}
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'transfer' ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-full max-w-xs space-y-0">
                <button
                  onClick={() => openAccountPicker('from')}
                  className="w-full bg-gray-50 rounded-t-xl p-4 border border-gray-200 border-b-0 text-left"
                >
                  <label className="text-sm text-gray-500 block mb-1">转出账户</label>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-800">{fromAccount || '请选择'}</span>
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>
                </button>
                <button onClick={swapAccounts} className="bg-white border border-gray-200 border-t-0 border-b-0 p-2 w-full">
                  <RefreshCw size={20} className="text-gray-400 mx-auto" />
                </button>
                <button
                  onClick={() => openAccountPicker('to')}
                  className="w-full bg-gray-50 rounded-b-xl p-4 border border-gray-200 border-t-0 text-left"
                >
                  <label className="text-sm text-gray-500 block mb-1">转入账户</label>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-800">{toAccount || '请选择'}</span>
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      category === cat.id
                        ? tab === 'expense'
                          ? 'bg-red-50'
                          : 'bg-blue-50'
                        : 'bg-gray-100'
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {cat.icon === 'UtensilsCrossed' && <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />}
                      {cat.icon === 'Shirt' && <path d="M20 20v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z" />}
                      {cat.icon === 'Home' && <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />}
                      {cat.icon === 'Shield' && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
                      {cat.icon === 'Armchair' && <path d="M20 10V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2" />}
                      {cat.icon === 'ShoppingCart' && <circle cx="9" cy="21" r="1" />}
                      {cat.icon === 'Bus' && <path d="M4 16v-1a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v1" />}
                      {cat.icon === 'Plane' && <path d="M17.8 19.2 16 11l3-3-3-3 1.8-2.2L23 12l-5.2 6.8z" />}
                      {cat.icon === 'Sparkles' && <path d="M22 12h-4l-3 9L9 3l-3 9H2" />}
                      {cat.icon === 'BookOpen' && <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />}
                      {cat.icon === 'Package' && <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />}
                      {cat.icon === 'BriefcaseMedical' && <path d="M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />}
                      {cat.icon === 'Gift' && <rect x="3" y="8" width="18" height="4" rx="1" />}
                      {cat.icon === 'Car' && <path d="M18 9h-1V7a3 3 0 0 0-6 0v2H6v11h12v-2a3 3 0 0 0 0-6z" />}
                      {cat.icon === 'Gamepad2' && <path d="M6 12h12" />}
                      {cat.icon === 'Crown' && <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />}
                      {cat.icon === 'Camera' && <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />}
                      {cat.icon === 'Activity' && <path d="M22 12h-4l-3 9L9 3l-3 9H2" />}
                      {cat.icon === 'Grid3X3' && <rect x="3" y="3" width="7" height="7" />}
                      {cat.icon === 'Zap' && <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />}
                      {cat.icon === 'Star' && <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />}
                      {cat.icon === 'Wallet' && <path d="M20 6h-3a1 1 0 0 0-1 1v1a2 2 0 0 1-4 0V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />}
                      {cat.icon === 'User' && <circle cx="12" cy="8" r="5" />}
                      {cat.icon === 'Handshake' && <path d="M12 2v4m0 4v12m-4-12v4m8-4v4m0 4v8" />}
                      {cat.icon === 'TrendingUp' && <polyline points="23 6 13.5 15.5 8.5 10.5 2 17" />}
                      {cat.icon === 'Landmark' && <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />}
                      {cat.icon === 'FileText' && <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />}
                      {cat.icon === 'Heart' && <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />}
                      {cat.icon === 'Undo2' && <path d="M3 7v6h6" />}
                    </svg>
                  </div>
                  <span
                    className={`text-xs ${
                      category === cat.id ? (tab === 'expense' ? 'text-red-500' : 'text-blue-500') : 'text-gray-600'
                    }`}
                  >
                    {cat.id}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 p-3">
          <div className="flex items-center gap-2 mb-3">
            <button className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium">
              #
            </button>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="点此输入备注..."
              className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
            />
            <div className="flex items-center gap-1">
              <span
                className="text-2xl font-bold"
                style={{ color: tabColors[tab].text }}
              >
                {amount || '0.0'}
              </span>
              <span className="text-gray-500 text-sm">CNY</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {tab !== 'transfer' && (
              <button
                onClick={() => openAccountPicker('account')}
                className="whitespace-nowrap px-3 py-1.5 bg-white rounded-lg text-sm text-gray-600 flex items-center gap-1"
              >
                <Wallet size={14} />
                {account || '选择账户'}
              </button>
            )}
            <button
              onClick={() => setShowDatePicker(true)}
              className="whitespace-nowrap px-3 py-1.5 bg-white rounded-lg text-sm text-gray-600 flex items-center gap-1"
            >
              <Calendar size={14} />
              {formatDateDisplay(date)}
            </button>
            {tab !== 'transfer' && (
              <button
                onClick={() => setShowDiscountInput(!showDiscountInput)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                  discount ? 'bg-green-50 text-green-600' : 'bg-white text-gray-600'
                }`}
              >
                <Tag size={14} />
                {discount ? `优惠${discount}` : '优惠'}
              </button>
            )}
            {tab === 'transfer' && (
              <button className="whitespace-nowrap px-3 py-1.5 bg-white rounded-lg text-sm text-gray-600">
                手续费
              </button>
            )}
            {tab === 'expense' && (
              <button className="whitespace-nowrap px-3 py-1.5 bg-white rounded-lg text-sm text-gray-600">
                报销
              </button>
            )}
          </div>

          {showDiscountInput && (
            <div className="mb-3 flex items-center gap-2 bg-white rounded-lg px-3 py-2">
              <span className="text-sm text-gray-500">优惠金额</span>
              <input
                type="text"
                value={discount}
                onChange={(e) => setDiscount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none text-right"
              />
              <span className="text-sm text-gray-500">元</span>
            </div>
          )}

          {showDatePicker && (
            <div className="mb-3 bg-white rounded-lg px-3 py-2">
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="w-full bg-transparent text-sm text-gray-800 outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-4 gap-1">
            <button onClick={() => handleNumberClick('1')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-800 active:bg-gray-100">1</button>
            <button onClick={() => handleNumberClick('2')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-800 active:bg-gray-100">2</button>
            <button onClick={() => handleNumberClick('3')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-800 active:bg-gray-100">3</button>
            <button onClick={() => handleNumberClick('backspace')} className="h-12 bg-white rounded-lg flex items-center justify-center active:bg-gray-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            </button>
            <button onClick={() => handleNumberClick('4')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-800 active:bg-gray-100">4</button>
            <button onClick={() => handleNumberClick('5')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-800 active:bg-gray-100">5</button>
            <button onClick={() => handleNumberClick('6')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-800 active:bg-gray-100">6</button>
            <button onClick={() => handleNumberClick('-')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-600 active:bg-gray-100">-</button>
            <button onClick={() => handleNumberClick('7')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-800 active:bg-gray-100">7</button>
            <button onClick={() => handleNumberClick('8')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-800 active:bg-gray-100">8</button>
            <button onClick={() => handleNumberClick('9')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-800 active:bg-gray-100">9</button>
            <button onClick={() => handleNumberClick('+')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-600 active:bg-gray-100">+</button>
            <button onClick={() => {}} className="h-12 bg-white rounded-lg text-sm font-medium text-gray-600 active:bg-gray-100">再记</button>
            <button onClick={() => handleNumberClick('0')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-800 active:bg-gray-100">0</button>
            <button onClick={() => handleNumberClick('.')} className="h-12 bg-white rounded-lg text-lg font-medium text-gray-800 active:bg-gray-100">.</button>
            <button
              onClick={handleSubmit}
              className="h-12 rounded-lg text-white font-semibold text-base active:opacity-90 transition-opacity"
              style={{ backgroundColor: tabColors[tab].bg }}
            >
              {editingTransaction ? '修改' : '保存'}
            </button>
          </div>
        </div>
      </div>

      {showAccountPicker && (
        <div className="fixed inset-0 bg-black/40 z-[80] flex items-end" onClick={() => setShowAccountPicker(false)}>
          <div
            className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-5 animate-slide-up max-h-[60vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-gray-800 mb-4 text-center">选择账户</h3>
            <div className="space-y-2">
              {accountList.map((acc) => (
                <button
                  key={acc}
                  onClick={() => selectAccount(acc)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    (accountPickerFor === 'account' && account === acc) ||
                    (accountPickerFor === 'from' && fromAccount === acc) ||
                    (accountPickerFor === 'to' && toAccount === acc)
                      ? 'bg-blue-50 border border-[#4A90D9]'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#4A90D9]/10 flex items-center justify-center">
                    <Wallet size={20} className="text-[#4A90D9]" />
                  </div>
                  <span className="flex-1 text-left text-sm font-medium text-gray-800">{acc}</span>
                  {((accountPickerFor === 'account' && account === acc) ||
                    (accountPickerFor === 'from' && fromAccount === acc) ||
                    (accountPickerFor === 'to' && toAccount === acc)) && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#4A90D9]">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
