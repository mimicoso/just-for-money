import { Trash2, X } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ open, title, onCancel, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center px-8">
      <div className="bg-white w-full max-w-xs rounded-2xl p-5 text-center animate-slide-up">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={28} className="text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 mb-2">确认删除</h3>
        <p className="text-sm text-gray-500 mb-6">{title}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm text-white font-medium"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}
