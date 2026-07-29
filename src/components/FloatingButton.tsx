import { Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useUIStore } from '../stores/useUIStore';

export default function FloatingButton() {
  const { showAddModal, setShowAddModal } = useUIStore();
  const location = useLocation();
  const pathname = location.pathname;

  const shouldShow = pathname === '/';

  if (!shouldShow || showAddModal) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowAddModal(true);
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className="fixed bottom-16 right-4 z-[9999] w-14 h-14 bg-[#4A90D9] rounded-full shadow-lg shadow-blue-300/50 flex items-center justify-center text-white active:scale-95 transition-transform"
      style={{ pointerEvents: 'auto' }}
      aria-label="添加记账"
    >
      <Plus size={28} strokeWidth={2.5} />
    </button>
  );
}
