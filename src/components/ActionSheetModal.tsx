import { Pencil, Trash2, X } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export default function ActionSheetModal({ open, title, onEdit, onDelete, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center px-8" onClick={onCancel}>
      <div
        className="bg-white w-full max-w-xs rounded-2xl p-5 text-center animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-gray-800 mb-5">{title}</h3>
        <div className="space-y-3">
          <button
            onClick={onEdit}
            className="w-full py-2.5 rounded-xl bg-[#4A90D9] text-sm text-white font-medium flex items-center justify-center gap-2"
          >
            <Pencil size={16} />
            修改
          </button>
          <button
            onClick={onDelete}
            className="w-full py-2.5 rounded-xl bg-red-500 text-sm text-white font-medium flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            删除
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
