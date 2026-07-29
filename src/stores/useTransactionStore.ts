import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction } from '../types';
import { mockTransactions } from '../data/mockData';

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  deleteTransactions: (ids: string[]) => void;
  getTransactionsByLedger: (ledgerId: string) => Transaction[];
  getMonthlySummary: (year: number, month: number, ledgerId?: string) => { income: number; expense: number; balance: number };
  getTransactionsByDate: (date: string, ledgerId?: string) => Transaction[];
  getTransactionsByMonth: (year: number, month: number, ledgerId?: string) => Transaction[];
  getTransactionsByRange: (startDate: string, endDate: string, ledgerId?: string) => Transaction[];
  getSummaryByRange: (startDate: string, endDate: string, ledgerId?: string) => { income: number; expense: number; balance: number; count: number };
  getDailyData: (year: number, month: number, ledgerId?: string) => { day: string; amount: number }[];
  getDailyDataByRange: (startDate: string, endDate: string, ledgerId?: string) => { day: string; amount: number }[];
  getCategoryStats: (year: number, month: number, type: 'income' | 'expense', ledgerId?: string) => { name: string; amount: number; count: number; percentage: number; color: string }[];
  getCategoryStatsByRange: (startDate: string, endDate: string, type: 'income' | 'expense', ledgerId?: string) => { name: string; amount: number; count: number; percentage: number; color: string }[];
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      addTransaction: (t) => {
        const id = Date.now().toString();
        set((state) => ({ transactions: [{ ...t, id }, ...state.transactions] }));
      },
      updateTransaction: (id, t) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...t, id } : tx
          ),
        }));
      },
      deleteTransaction: (id) => {
        set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) }));
      },
      deleteTransactions: (ids) => {
        set((state) => ({ transactions: state.transactions.filter((t) => !ids.includes(t.id)) }));
      },
      getTransactionsByLedger: (ledgerId) => {
        return get().transactions.filter((t) => t.ledgerId === ledgerId);
      },
      getMonthlySummary: (year, month, ledgerId) => {
        const list = get().getTransactionsByMonth(year, month, ledgerId);
        const income = list.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = list.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return { income, expense, balance: income - expense };
      },
      getTransactionsByDate: (date, ledgerId) => {
        let list = get().transactions.filter((t) => t.date === date);
        if (ledgerId) list = list.filter((t) => t.ledgerId === ledgerId);
        return list.sort((a, b) => b.amount - a.amount);
      },
      getTransactionsByMonth: (year, month, ledgerId) => {
        const prefix = `${year}-${String(month).padStart(2, '0')}`;
        let list = get().transactions.filter((t) => t.date.startsWith(prefix));
        if (ledgerId) list = list.filter((t) => t.ledgerId === ledgerId);
        return list;
      },
      getTransactionsByRange: (startDate, endDate, ledgerId) => {
        let list = get().transactions.filter((t) => t.date >= startDate && t.date <= endDate);
        if (ledgerId) list = list.filter((t) => t.ledgerId === ledgerId);
        return list;
      },
      getSummaryByRange: (startDate, endDate, ledgerId) => {
        const list = get().getTransactionsByRange(startDate, endDate, ledgerId);
        const income = list.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = list.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return { income, expense, balance: income - expense, count: list.length };
      },
      getDailyData: (year, month, ledgerId) => {
        const list = get().getTransactionsByMonth(year, month, ledgerId);
        const days = new Date(year, month, 0).getDate();
        const result = [];
        for (let i = 1; i <= days; i++) {
          const d = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
          const dayTrans = list.filter((t) => t.date === d);
          const expense = dayTrans.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
          result.push({ day: String(i), amount: expense });
        }
        return result;
      },
      getDailyDataByRange: (startDate, endDate, ledgerId) => {
        const list = get().getTransactionsByRange(startDate, endDate, ledgerId);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const result = [];
        const cur = new Date(start);
        while (cur <= end) {
          const d = cur.toISOString().split('T')[0];
          const dayTrans = list.filter((t) => t.date === d);
          const expense = dayTrans.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
          result.push({ day: `${cur.getMonth() + 1}/${cur.getDate()}`, amount: expense });
          cur.setDate(cur.getDate() + 1);
        }
        return result;
      },
      getCategoryStats: (year, month, type, ledgerId) => {
        const list = get().getTransactionsByMonth(year, month, ledgerId).filter((t) => t.type === type);
        const total = list.reduce((s, t) => s + t.amount, 0);
        const map = new Map<string, { amount: number; count: number }>();
        list.forEach((t) => {
          const cur = map.get(t.category) || { amount: 0, count: 0 };
          map.set(t.category, { amount: cur.amount + t.amount, count: cur.count + 1 });
        });
        const stats = Array.from(map.entries())
          .map(([name, data]) => ({
            name,
            amount: data.amount,
            count: data.count,
            percentage: total > 0 ? (data.amount / total) * 100 : 0,
            color: '',
          }))
          .sort((a, b) => b.amount - a.amount);
        const colors = ['#5B9BD5', '#E57373', '#FFB74D', '#81C784', '#9575CD', '#4DD0E1', '#FF8A65', '#A1887F'];
        stats.forEach((s, i) => {
          s.color = colors[i % colors.length];
        });
        return stats;
      },
      getCategoryStatsByRange: (startDate, endDate, type, ledgerId) => {
        const list = get().getTransactionsByRange(startDate, endDate, ledgerId).filter((t) => t.type === type);
        const total = list.reduce((s, t) => s + t.amount, 0);
        const map = new Map<string, { amount: number; count: number }>();
        list.forEach((t) => {
          const cur = map.get(t.category) || { amount: 0, count: 0 };
          map.set(t.category, { amount: cur.amount + t.amount, count: cur.count + 1 });
        });
        const stats = Array.from(map.entries())
          .map(([name, data]) => ({
            name,
            amount: data.amount,
            count: data.count,
            percentage: total > 0 ? (data.amount / total) * 100 : 0,
            color: '',
          }))
          .sort((a, b) => b.amount - a.amount);
        const colors = ['#5B9BD5', '#E57373', '#FFB74D', '#81C784', '#9575CD', '#4DD0E1', '#FF8A65', '#A1887F'];
        stats.forEach((s, i) => {
          s.color = colors[i % colors.length];
        });
        return stats;
      },
    }),
    { name: 'transaction-store' }
  )
);
