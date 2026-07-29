import * as Icons from 'lucide-react';
import { useLongPress } from '../hooks/useLongPress';

interface Props {
  transaction: {
    id: string;
    type: 'income' | 'expense';
    category: string;
    subcategory: string;
    account: string;
    note: string;
    amount: number;
  };
  categoryIcons: Record<string, string>;
  categoryColors: Record<string, string>;
  onLongPress: (id: string, name: string) => void;
}

export default function TransactionItem({ transaction, categoryIcons, categoryColors, onLongPress }: Props) {
  const iconName = categoryIcons[transaction.category] || 'Circle';
  const IconComp = ((Icons as unknown) as Record<string, React.ComponentType<{size?: number; className?: string; style?: React.CSSProperties}>>)[iconName] || Icons.Circle;
  const isIncome = transaction.type === 'income';
  const longPressProps = useLongPress(() => onLongPress(transaction.id, `${transaction.category}-${transaction.subcategory}`), 600);

  return (
    <div
      className="flex items-center gap-3 select-none flex-1"
      {...longPressProps}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: (categoryColors[transaction.category] || '#999') + '15' }}
      >
        <IconComp size={20} style={{ color: categoryColors[transaction.category] || '#999' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">
          {transaction.category}-{transaction.subcategory}
        </div>
        <div className="text-xs text-gray-400 truncate">
          {transaction.account} {transaction.note}
        </div>
      </div>
      <div className={`text-base font-semibold flex-shrink-0 text-right ${isIncome ? 'text-[#43A047]' : 'text-[#E53935]'}`}>
        {isIncome ? '+' : '-'}{transaction.amount.toFixed(2)}
      </div>
    </div>
  );
}
