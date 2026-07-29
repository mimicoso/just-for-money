import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Account } from '../types';
import { mockAccounts } from '../data/mockData';

export interface AccountGroup {
  id: string;
  name: string;
  icon?: string;
}

interface AccountState {
  accounts: Account[];
  groups: AccountGroup[];
  showBalance: boolean;
  toggleShowBalance: () => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, account: Omit<Account, 'id'>) => void;
  deleteAccount: (id: string) => void;
  addGroup: (group: Omit<AccountGroup, 'id'>) => void;
  updateGroup: (id: string, group: Omit<AccountGroup, 'id'>) => void;
  deleteGroup: (id: string) => void;
  getTotalAssets: () => number;
  getTotalLiabilities: () => number;
  getNetWorth: () => number;
}

const defaultGroups: AccountGroup[] = [
  { id: 'g1', name: '资金账户' },
  { id: 'g2', name: '信用卡' },
  { id: 'g3', name: '投资' },
  { id: 'g4', name: '储蓄' },
];

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      accounts: mockAccounts,
      groups: defaultGroups,
      showBalance: true,
      toggleShowBalance: () => set((state) => ({ showBalance: !state.showBalance })),
      addAccount: (account) => {
        const id = Date.now().toString();
        set((state) => ({ accounts: [...state.accounts, { ...account, id }] }));
      },
      updateAccount: (id, account) => {
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === id ? { ...account, id } : a)),
        }));
      },
      deleteAccount: (id) => {
        set((state) => ({ accounts: state.accounts.filter((a) => a.id !== id) }));
      },
      addGroup: (group) => {
        const id = Date.now().toString();
        set((state) => ({ groups: [...state.groups, { ...group, id }] }));
      },
      updateGroup: (id, group) => {
        set((state) => ({
          groups: state.groups.map((g) => (g.id === id ? { ...group, id } : g)),
        }));
      },
      deleteGroup: (id) => {
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          accounts: state.accounts.map((a) => (a.groupId === id ? { ...a, groupId: undefined } : a)),
        }));
      },
      getTotalAssets: () => {
        return get().accounts
          .filter((a) => a.type === 'fund' || a.type === 'recharge' || a.type === 'investment')
          .reduce((s, a) => s + a.balance, 0);
      },
      getTotalLiabilities: () => {
        return get().accounts
          .filter((a) => a.type === 'credit')
          .reduce((s, a) => s + a.balance, 0);
      },
      getNetWorth: () => get().getTotalAssets() - get().getTotalLiabilities(),
    }),
    { name: 'account-store' }
  )
);
