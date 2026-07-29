import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RecurringType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  account: string;
  recurringType: RecurringType;
  dayOfWeek?: number;
  dayOfMonth?: number;
  startDate: string;
  endDate?: string;
  lastExecuteDate?: string;
  enabled: boolean;
}

interface RecurringState {
  transactions: RecurringTransaction[];
  addTransaction: (tx: Omit<RecurringTransaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<RecurringTransaction>) => void;
  deleteTransaction: (id: string) => void;
  toggleEnabled: (id: string) => void;
  executeTransaction: (id: string) => void;
}

const mockRecurring: RecurringTransaction[] = [
  {
    id: '1',
    name: '工资收入',
    amount: 15000,
    type: 'income',
    category: '工资',
    account: '工资卡',
    recurringType: 'monthly',
    dayOfMonth: 10,
    startDate: '2026-01-01',
    enabled: true,
  },
  {
    id: '2',
    name: '房租',
    amount: 3500,
    type: 'expense',
    category: '居住',
    account: '银行卡',
    recurringType: 'monthly',
    dayOfMonth: 1,
    startDate: '2026-01-01',
    enabled: true,
  },
  {
    id: '3',
    name: '餐饮补贴',
    amount: 2000,
    type: 'income',
    category: '奖金补贴',
    account: '工资卡',
    recurringType: 'monthly',
    dayOfMonth: 20,
    startDate: '2026-01-01',
    enabled: false,
  },
  {
    id: '4',
    name: '健身会员',
    amount: 299,
    type: 'expense',
    category: '娱乐',
    account: '微信支付',
    recurringType: 'monthly',
    dayOfMonth: 15,
    startDate: '2026-01-01',
    enabled: true,
  },
];

export const useRecurringStore = create<RecurringState>()(
  persist(
    (set) => ({
      transactions: mockRecurring,
      addTransaction: (tx) => {
        const id = Date.now().toString();
        set((state) => ({ transactions: [...state.transactions, { ...tx, id }] }));
      },
      updateTransaction: (id, tx) => {
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...tx } : t)),
        }));
      },
      deleteTransaction: (id) => {
        set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) }));
      },
      toggleEnabled: (id) => {
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
        }));
      },
      executeTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.map((t) => {
            if (t.id !== id) return t;
            return { ...t, lastExecuteDate: new Date().toISOString().split('T')[0] };
          }),
        }));
      },
    }),
    { name: 'recurring-store' }
  )
);
