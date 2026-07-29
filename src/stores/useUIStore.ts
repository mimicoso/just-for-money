import { create } from 'zustand';
import type { Transaction } from '../types';

interface UIState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  editingTransaction: Transaction | null;
  setEditingTransaction: (t: Transaction | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: '/',
  setActiveTab: (tab) => set({ activeTab: tab }),
  showAddModal: false,
  setShowAddModal: (show) => set({ showAddModal: show }),
  selectedDate: new Date().toISOString().split('T')[0],
  setSelectedDate: (date) => set({ selectedDate: date }),
  editingTransaction: null,
  setEditingTransaction: (t) => set({ editingTransaction: t }),
}));
