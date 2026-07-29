import type { Transaction, Account, Asset } from '../types';

export const mockTransactions: Transaction[] = [
  { id: '1', ledgerId: 'default', type: 'income', amount: 327.69, category: '收入', subcategory: '理财盈利', account: '家庭小荷包', date: '2026-06-26', note: '家庭小荷包 账户余额补齐' },
  { id: '2', ledgerId: 'default', type: 'income', amount: 255.60, category: '收入', subcategory: '理财盈利', account: '网商银行', date: '2026-06-26', note: '网商银行 账户余额补齐' },
  { id: '3', ledgerId: 'default', type: 'expense', amount: 2.85, category: '交通开支', subcategory: '公共交通', account: '深圳通', date: '2026-06-21', note: '' },
  { id: '4', ledgerId: 'default', type: 'expense', amount: 3.80, category: '交通开支', subcategory: '公共交通', account: '深圳通', date: '2026-06-21', note: '' },
  { id: '5', ledgerId: 'default', type: 'income', amount: 0.40, category: '收入', subcategory: '其他', account: '蚂蚁花呗', date: '2026-06-21', note: '蚂蚁花呗账户余额补齐' },
  { id: '6', ledgerId: 'default', type: 'income', amount: 50.00, category: '收入', subcategory: '其他', account: '招商银行9345', date: '2026-06-21', note: '招商银行9345账户余额补齐' },
  { id: '7', ledgerId: 'default', type: 'income', amount: 0.78, category: '理财盈利', subcategory: '理财收入', account: '招商银行9345', date: '2026-06-21', note: '' },
  { id: '8', ledgerId: 'default', type: 'expense', amount: 115.00, category: '吃吃喝喝', subcategory: '咖啡饮料', account: '招商银行9345', date: '2026-06-21', note: '深圳光明椿屋咖啡' },
  { id: '9', ledgerId: 'default', type: 'expense', amount: 180.00, category: '吃吃喝喝', subcategory: '一日三餐', account: '建设银行信用卡', date: '2026-06-21', note: '' },
  { id: '10', ledgerId: 'default', type: 'expense', amount: 4507.95, category: '房租水电', subcategory: '房租', account: '招商银行9345', date: '2026-06-11', note: '' },
  { id: '11', ledgerId: 'default', type: 'expense', amount: 2536.38, category: '吃吃喝喝', subcategory: '一日三餐', account: '招商银行9345', date: '2026-06-13', note: '' },
  { id: '12', ledgerId: 'default', type: 'expense', amount: 455.00, category: '交通开支', subcategory: '公共交通', account: '深圳通', date: '2026-06-13', note: '' },
  { id: '13', ledgerId: 'default', type: 'expense', amount: 860.00, category: '花草宠物', subcategory: '宠物用品', account: '招商银行9345', date: '2026-06-09', note: '' },
  { id: '14', ledgerId: 'default', type: 'expense', amount: 220.00, category: '旅游开支', subcategory: '景点门票', account: '招商银行9345', date: '2026-06-07', note: '' },
  { id: '15', ledgerId: 'default', type: 'expense', amount: 36.00, category: '个人喜好', subcategory: '书籍', account: '招商银行9345', date: '2026-06-05', note: '' },
  { id: '16', ledgerId: 'default', type: 'expense', amount: 35.00, category: '娱乐运动', subcategory: '运动健身', account: '招商银行9345', date: '2026-06-03', note: '' },
  { id: '17', ledgerId: 'default', type: 'expense', amount: 22.50, category: '生活支出', subcategory: '日用品', account: '招商银行9345', date: '2026-06-01', note: '' },
];

export const mockAccounts: Account[] = [
  { id: '1', name: '招商银行9345', type: 'fund', balance: 2164.29 },
  { id: '2', name: '网商银行', type: 'fund', balance: 0 },
  { id: '3', name: '家庭小荷包', type: 'fund', balance: 0 },
  { id: '4', name: '深圳通', type: 'recharge', balance: 0 },
  { id: '5', name: '蚂蚁花呗', type: 'credit', balance: 0 },
  { id: '6', name: '建设银行信用卡', type: 'credit', balance: 0 },
];

export const mockAssets: Asset[] = [
  { id: '1', name: '笔记本电脑', category: '电子产品', price: 5450, purchaseDate: '2017-10-24', dailyCost: 1.71, status: 'active' },
  { id: '2', name: '燕飞利仕震荡波', category: '电子产品', price: 75, purchaseDate: '2026-06-21', dailyCost: 8.33, status: 'active' },
  { id: '3', name: '神牛 IT32 闪光灯', category: '电子产品', price: 370, purchaseDate: '2026-03-30', dailyCost: 3.63, status: 'active' },
  { id: '4', name: '松下85mm F1.8', category: '电子产品', price: 2619.90, purchaseDate: '2023-06-17', dailyCost: 3.59, status: 'active' },
  { id: '5', name: '松下s5-2060套机', category: '电子产品', price: 8767.22, purchaseDate: '2023-06-17', dailyCost: 11.64, status: 'active' },
  { id: '6', name: '燕飞利仕震荡波', category: '电子产品', price: 89, purchaseDate: '2023-08-22', dailyCost: 0.08, status: 'active' },
  { id: '7', name: '显示器', category: '电子产品', price: 100, purchaseDate: '2025-05-21', dailyCost: 0.24, status: 'active' },
  { id: '8', name: '一加 Ace Pro', category: '电子产品', price: 2650, purchaseDate: '2023-01-08', dailyCost: 2.12, status: 'active' },
  { id: '9', name: 'OPPO Find X8 Ultra', category: '电子产品', price: 6029.05, purchaseDate: '2025-06-16', dailyCost: 15.50, status: 'active' },
  { id: '10', name: 'OPPO watch 4 Pro', category: '电子产品', price: 1625, purchaseDate: '2024-03-29', dailyCost: 1.95, status: 'active' },
];

export const categoryColors: Record<string, string> = {
  '房租水电': '#5B9BD5',
  '吃吃喝喝': '#E57373',
  '交通开支': '#FFB74D',
  '花草宠物': '#81C784',
  '旅游开支': '#9575CD',
  '个人喜好': '#4DD0E1',
  '娱乐运动': '#FF8A65',
  '生活支出': '#A1887F',
  '收入': '#E53935',
  '理财盈利': '#E53935',
};

export const categoryIcons: Record<string, string> = {
  '房租水电': 'Home',
  '吃吃喝喝': 'Coffee',
  '交通开支': 'Bus',
  '花草宠物': 'Flower2',
  '旅游开支': 'Plane',
  '个人喜好': 'Heart',
  '娱乐运动': 'Gamepad2',
  '生活支出': 'ShoppingBag',
  '收入': 'TrendingUp',
  '理财盈利': 'TrendingUp',
};
