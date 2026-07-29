import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Budget {
  monthlyBudget: number;
  yearlyBudget: number;
  monthlyCategoryBudgets: Record<string, number>;
}

interface BudgetState extends Budget {
  setMonthlyBudget: (amount: number) => void;
  setYearlyBudget: (amount: number) => void;
  setCategoryBudget: (category: string, amount: number) => void;
  getMonthlyBudgetProgress: (expense: number) => { used: number; remaining: number; percentage: number };
  getYearlyBudgetProgress: (expense: number) => { used: number; remaining: number; percentage: number };
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      monthlyBudget: 5000,
      yearlyBudget: 60000,
      monthlyCategoryBudgets: {},
      setMonthlyBudget: (amount) => set({ monthlyBudget: amount }),
      setYearlyBudget: (amount) => set({ yearlyBudget: amount }),
      setCategoryBudget: (category, amount) =>
        set((state) => ({
          monthlyCategoryBudgets: { ...state.monthlyCategoryBudgets, [category]: amount },
        })),
      getMonthlyBudgetProgress: (expense) => {
        const budget = get().monthlyBudget;
        const used = expense;
        const remaining = Math.max(0, budget - expense);
        const percentage = budget > 0 ? Math.min(100, (expense / budget) * 100) : 0;
        return { used, remaining, percentage };
      },
      getYearlyBudgetProgress: (expense) => {
        const budget = get().yearlyBudget;
        const used = expense;
        const remaining = Math.max(0, budget - expense);
        const percentage = budget > 0 ? Math.min(100, (expense / budget) * 100) : 0;
        return { used, remaining, percentage };
      },
    }),
    { name: 'budget-store' }
  )
);
