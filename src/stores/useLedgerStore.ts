import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Ledger } from '../types';

interface LedgerState {
  ledgers: Ledger[];
  activeLedgerId: string;
  setActiveLedger: (id: string) => void;
  addLedger: (ledger: Omit<Ledger, 'id' | 'createdAt'>) => void;
  updateLedger: (id: string, ledger: Partial<Omit<Ledger, 'id'>>) => void;
  deleteLedger: (id: string) => void;
  getActiveLedger: () => Ledger | undefined;
}

const defaultLedgers: Ledger[] = [
  {
    id: 'default',
    name: '个人账本',
    icon: 'BookOpen',
    color: '#4A90D9',
    createdAt: new Date().toISOString(),
  },
];

export const useLedgerStore = create<LedgerState>()(
  persist(
    (set, get) => ({
      ledgers: defaultLedgers,
      activeLedgerId: 'default',
      setActiveLedger: (id) => set({ activeLedgerId: id }),
      addLedger: (ledger) => {
        const id = Date.now().toString();
        const newLedger: Ledger = {
          ...ledger,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ ledgers: [...state.ledgers, newLedger] }));
      },
      updateLedger: (id, ledger) => {
        set((state) => ({
          ledgers: state.ledgers.map((l) =>
            l.id === id ? { ...l, ...ledger } : l
          ),
        }));
      },
      deleteLedger: (id) => {
        set((state) => {
          const remaining = state.ledgers.filter((l) => l.id !== id);
          const newActive = state.activeLedgerId === id && remaining.length > 0
            ? remaining[0].id
            : state.activeLedgerId;
          return { ledgers: remaining, activeLedgerId: newActive };
        });
      },
      getActiveLedger: () => {
        return get().ledgers.find((l) => l.id === get().activeLedgerId);
      },
    }),
    { name: 'ledger-store' }
  )
);
