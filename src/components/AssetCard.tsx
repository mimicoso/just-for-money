import { useLongPress } from '../hooks/useLongPress';

interface Props {
  asset: { id: string; name: string; price: number; purchaseDate: string; dailyCost: number; status: string };
  onLongPress: (id: string, name: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  statusMap: Record<string, string>;
  formatCurrency: (n: number) => string;
}

function formatDays(dateStr: string): string {
  const purchase = new Date(dateStr);
  const today = new Date();
  const diff = today.getTime() - purchase.getTime();
  const totalDays = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  
  const years = Math.floor(totalDays / 365);
  const remainingDays = totalDays % 365;
  const months = Math.floor(remainingDays / 30);
  const days = remainingDays % 30;
  
  const parts: string[] = [];
  if (years > 0) parts.push(`${years}年`);
  if (months > 0) parts.push(`${months}月`);
  if (days > 0 || (years === 0 && months === 0)) parts.push(`${days}天`);
  
  return `使用${parts.join('')}`;
}

export default function AssetCard({ asset, onLongPress, onEdit, onDelete, statusMap, formatCurrency }: Props) {
  const longPressProps = useLongPress(() => onLongPress(asset.id, asset.name), 600);

  return (
    <div
      className="bg-white rounded-2xl p-4 shadow-sm select-none flex items-center justify-between"
      {...longPressProps}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="w-14 h-14 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-xl flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="6" y="10" width="28" height="24" rx="2" fill="#81C784" />
            <rect x="8" y="12" width="24" height="3" fill="#4CAF50" />
            <rect x="8" y="18" width="20" height="2" fill="#4CAF50" opacity="0.6" />
            <rect x="8" y="22" width="16" height="2" fill="#4CAF50" opacity="0.4" />
            <path d="M10 10 L20 4 L30 10" fill="#4CAF50" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-base font-semibold text-gray-800 truncate">{asset.name}</h4>
            <span className="flex-shrink-0 ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
              {statusMap[asset.status]}
            </span>
          </div>
          <div className="text-sm text-gray-500 mb-1">
            {formatDays(asset.purchaseDate)}
            <span className="text-gray-300 mx-2">|</span>
            <span className="text-[#FF8A65]">{asset.dailyCost.toFixed(2)}/天</span>
          </div>
          <div className="text-lg font-bold text-[#E57373]">
            {formatCurrency(asset.price)}
          </div>
        </div>
      </div>
    </div>
  );
}
