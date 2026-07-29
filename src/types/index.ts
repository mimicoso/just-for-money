export type TransactionType = 'income' | 'expense';
export type AccountType = 'fund' | 'recharge' | 'credit' | 'investment' | 'other';
export type AssetStatus = 'active' | 'retired' | 'sold';

export interface Ledger {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  ledgerId: string;
  type: TransactionType;
  amount: number;
  category: string;
  subcategory: string;
  account: string;
  date: string;
  note: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  groupId?: string;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  price: number;
  purchaseDate: string;
  expiryDate?: string;
  dailyCost: number;
  status: AssetStatus;
}

export interface DayCell {
  date: number;
  fullDate: string;
  lunar: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasTransaction: boolean;
}

export interface CategoryStat {
  name: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}
