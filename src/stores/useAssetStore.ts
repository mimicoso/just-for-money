import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Asset } from '../types';
import { mockAssets } from '../data/mockData';

export interface AssetGroup {
  id: string;
  name: string;
}

interface AssetState {
  assets: Asset[];
  groups: AssetGroup[];
  categoryFilter: string;
  setCategoryFilter: (f: string) => void;
  getFilteredAssets: () => Asset[];
  getTotalAssetValue: () => number;
  getTotalDailyCost: () => number;
  deleteAsset: (id: string) => void;
  deleteAssets: (ids: string[]) => void;
  addAsset: (asset: Omit<Asset, 'id' | 'dailyCost'>) => void;
  updateAsset: (id: string, asset: Partial<Omit<Asset, 'id'>>) => void;
  recalculateDailyCosts: () => void;
  getCategoryBreakdown: () => { name: string; value: number; count: number; color: string }[];
  addGroup: (group: Omit<AssetGroup, 'id'>) => void;
  updateGroup: (id: string, group: Omit<AssetGroup, 'id'>) => void;
  deleteGroup: (id: string) => void;
}

const defaultAssetGroups: AssetGroup[] = [
  { id: 'ag1', name: '电子产品' },
  { id: 'ag2', name: '虚拟物品' },
  { id: 'ag3', name: '其他' },
];

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      assets: mockAssets,
      groups: defaultAssetGroups,
      categoryFilter: '所有物品',
      setCategoryFilter: (f) => set({ categoryFilter: f }),
      getFilteredAssets: () => {
        let list = get().assets;
        if (get().categoryFilter !== '所有物品') {
          list = list.filter((a) => a.category === get().categoryFilter);
        }
        return list;
      },
      getTotalAssetValue: () => get().assets.reduce((s, a) => s + a.price, 0),
      getTotalDailyCost: () => {
        const active = get().assets.filter((a) => a.status === 'active');
        return active.length > 0 ? active.reduce((s, a) => s + a.dailyCost, 0) : 0;
      },
      deleteAsset: (id) => {
        set((state) => ({ assets: state.assets.filter((a) => a.id !== id) }));
      },
      deleteAssets: (ids) => {
        set((state) => ({ assets: state.assets.filter((a) => !ids.includes(a.id)) }));
      },
      addAsset: (asset) => {
        const id = Date.now().toString();
        const purchaseDate = new Date(asset.purchaseDate);
        const today = new Date();
        const days = Math.max(1, Math.floor((today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)));
        const dailyCost = asset.price / days;
        set((state) => ({ assets: [...state.assets, { ...asset, id, dailyCost }] }));
      },
      updateAsset: (id, asset) => {
        set((state) => ({
          assets: state.assets.map((a) => {
            if (a.id !== id) return a;
            const updated = { ...a, ...asset };
            if (asset.purchaseDate || asset.price) {
              const purchaseDate = new Date(updated.purchaseDate);
              const today = new Date();
              const days = Math.max(1, Math.floor((today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)));
              updated.dailyCost = updated.price / days;
            }
            return updated;
          }),
        }));
      },
      recalculateDailyCosts: () => {
        const today = new Date();
        set((state) => ({
          assets: state.assets.map((a) => {
            const purchaseDate = new Date(a.purchaseDate);
            const days = Math.max(1, Math.floor((today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)));
            return { ...a, dailyCost: a.price / days };
          }),
        }));
      },
      getCategoryBreakdown: () => {
        const map = new Map<string, { value: number; count: number; color: string }>();
        const colors: Record<string, string> = {
          '吃穿住行': '#5B9BD5',
          '个人设备': '#E57373',
          '小件设备': '#FFB74D',
        };
        get().assets.forEach((a) => {
          const cur = map.get(a.category) || { value: 0, count: 0, color: colors[a.category] || '#999' };
          map.set(a.category, { value: cur.value + a.price, count: cur.count + 1, color: cur.color });
        });
        return Array.from(map.entries()).map(([name, data]) => ({ name, ...data }));
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
          assets: state.assets.map((a) => (a.category === get().groups.find(g => g.id === id)?.name ? { ...a, category: '其他' } : a)),
        }));
      },
    }),
    { name: 'asset-store' }
  )
);
