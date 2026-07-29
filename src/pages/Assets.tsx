import { useState, useEffect, useMemo } from 'react';
import { Search, Bell, Menu, Package, Calendar, Clock, MoreVertical, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useAssetStore } from '../stores/useAssetStore';
import { formatCurrency } from '../utils/formatters';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import AssetCard from '../components/AssetCard';

const statusMap: Record<string, string> = { active: '使用中', retired: '已退役', sold: '已卖出' };

export default function Assets() {
  const {
    categoryFilter,
    setCategoryFilter,
    getFilteredAssets,
    deleteAsset,
    deleteAssets,
    addAsset,
    updateAsset,
    recalculateDailyCosts,
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
  } = useAssetStore();

  const assets = getFilteredAssets();

  useEffect(() => {
    recalculateDailyCosts();
  }, [recalculateDailyCosts]);

  const totalValue = useMemo(() => assets.reduce((s, a) => s + a.price, 0), [assets]);
  const dailyCost = useMemo(() => {
    const active = assets.filter((a) => a.status === 'active');
    return active.length > 0 ? active.reduce((s, a) => s + a.dailyCost, 0) : 0;
  }, [assets]);
  const expiringCount = useMemo(() => assets.filter((a) => {
    if (!a.expiryDate) return false;
    const expiry = new Date(a.expiryDate);
    const today = new Date();
    const diffDays = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }).length, [assets]);

  const [manageMode, setManageMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [batchDeleteOpen, setBatchDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: 'asset' | 'group' } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('电子产品');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleLongPress = (id: string, name: string) => {
    if (manageMode || selectMode) return;
    setDeleteTarget({ id, name, type: 'asset' });
    setDeleteOpen(true);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === assets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(assets.map(a => a.id));
    }
  };

  const handleBatchDeleteClick = () => {
    if (selectedIds.length > 0) {
      setBatchDeleteOpen(true);
    }
  };

  const handleConfirmBatchDelete = () => {
    deleteAssets(selectedIds);
    setSelectedIds([]);
    setSelectMode(false);
    setBatchDeleteOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'asset') {
      deleteAsset(deleteTarget.id);
    } else {
      deleteGroup(deleteTarget.id);
    }
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const handleAdd = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setCategory(groups[0]?.name || '其他');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setExpiryDate('');
    setModalOpen(true);
  };

  const handleEdit = (asset: typeof assets[0]) => {
    setEditingId(asset.id);
    setName(asset.name);
    setPrice(asset.price.toString());
    setCategory(asset.category);
    setPurchaseDate(asset.purchaseDate);
    setExpiryDate(asset.expiryDate || '');
    setModalOpen(true);
  };

  const handleSave = () => {
    const p = parseFloat(price) || 0;
    if (!name.trim() || !purchaseDate) return;
    if (editingId) {
      updateAsset(editingId, { name: name.trim(), price: p, category, purchaseDate, expiryDate: expiryDate || undefined });
    } else {
      addAsset({ name: name.trim(), price: p, category, purchaseDate, expiryDate: expiryDate || undefined, status: 'active' });
    }
    setModalOpen(false);
  };

  const openAddGroup = () => {
    setEditingGroupId(null);
    setGroupName('');
    setGroupModalOpen(true);
  };

  const openEditGroup = (group: typeof groups[0]) => {
    setEditingGroupId(group.id);
    setGroupName(group.name);
    setGroupModalOpen(true);
  };

  const handleSaveGroup = () => {
    if (!groupName.trim()) return;
    if (editingGroupId) {
      updateGroup(editingGroupId, { name: groupName.trim() });
    } else {
      addGroup({ name: groupName.trim() });
    }
    setGroupModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex-1" />
        <h2 className="text-lg font-semibold text-gray-800">资产</h2>
        <div className="flex-1 text-right">
          {!selectMode ? (
            <button
              onClick={() => setManageMode(!manageMode)}
              className={`text-sm font-medium ${manageMode ? 'text-[#4A90D9]' : 'text-gray-500'}`}
            >
              {manageMode ? '完成' : '管理'}
            </button>
          ) : (
            <button
              onClick={() => { setSelectMode(false); setSelectedIds([]); }}
              className="text-sm font-medium text-gray-500"
            >
              取消
            </button>
          )}
        </div>
      </div>

      {!manageMode && !selectMode && assets.length > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={() => { setSelectMode(true); setSelectedIds([]); }}
            className="text-sm text-[#4A90D9]"
          >
            编辑
          </button>
        </div>
      )}

      {selectMode && (
        <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            {selectedIds.length === assets.length ? (
              <Check size={18} className="text-[#4A90D9]" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
            )}
            全选
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">已选 {selectedIds.length} 项</span>
            <button
              onClick={handleBatchDeleteClick}
              disabled={selectedIds.length === 0}
              className="text-sm text-white bg-red-500 px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              删除
            </button>
          </div>
        </div>
      )}

      <div className="px-4 mb-4">
        <div className="bg-white rounded-full flex items-center px-4 py-2 shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="搜索物品"
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <Bell size={18} className="text-gray-400 mr-2" />
          <Menu size={18} className="text-gray-400" />
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-[#5B9BD5] to-[#4A8FD4] rounded-2xl p-5 text-white shadow-lg shadow-blue-200/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">物品价值</span>
            <MoreVertical size={18} className="opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-4">{formatCurrency(totalValue)}</div>
          <div className="flex gap-3">
            <div className="flex-1 bg-white/20 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Package size={14} />
                <span className="text-xs opacity-90">物品数量</span>
              </div>
              <div className="text-xl font-bold">{assets.length}</div>
            </div>
            <div className="flex-1 bg-white/20 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={14} />
                <span className="text-xs opacity-90">日均成本</span>
              </div>
              <div className="text-xl font-bold">{formatCurrency(dailyCost)}</div>
            </div>
            <div className="flex-1 bg-white/20 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={14} />
                <span className="text-xs opacity-90">保质期临期</span>
              </div>
              <div className="text-xl font-bold">{expiringCount}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-3">
        <div className="flex gap-3 overflow-x-auto">
          <button
            onClick={() => setCategoryFilter('所有物品')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm flex-shrink-0 transition-all ${
              categoryFilter === '所有物品'
                ? 'bg-[#5B9BD5] text-white shadow-md'
                : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            <Menu size={14} />
            所有物品({assets.length})
          </button>
          {groups.map((g) => {
            const count = assets.filter((a) => a.category === g.name).length;
            return (
              <button
                key={g.id}
                onClick={() => setCategoryFilter(g.name)}
                className={`px-4 py-1.5 rounded-full text-sm flex-shrink-0 transition-all ${
                  categoryFilter === g.name
                    ? 'bg-[#5B9BD5] text-white shadow-md'
                    : 'bg-white text-gray-600 shadow-sm'
                }`}
              >
                {g.name}({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 space-y-3">
        {assets.map((asset) => (
          <div key={asset.id} className="relative">
            <div
              className={`flex items-center gap-3 rounded-xl p-2 transition-colors ${
                selectMode
                  ? selectedIds.includes(asset.id)
                    ? 'bg-blue-50'
                    : 'active:bg-gray-50'
                  : ''
              }`}
              onClick={() => selectMode && toggleSelect(asset.id)}
            >
              {selectMode && (
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelect(asset.id); }}
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
                >
                  {selectedIds.includes(asset.id) ? (
                    <div className="w-5 h-5 rounded-full bg-[#4A90D9] flex items-center justify-center">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </button>
              )}
              <div className="flex-1" onClick={(e) => !selectMode && e.stopPropagation()}>
                <AssetCard
                  asset={asset}
                  onLongPress={handleLongPress}
                  onEdit={() => handleEdit(asset)}
                  onDelete={() => { setDeleteTarget({ id: asset.id, name: asset.name, type: 'asset' }); setDeleteOpen(true); }}
                  statusMap={statusMap}
                  formatCurrency={formatCurrency}
                />
              </div>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); handleEdit(asset); }} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/90 shadow-sm text-gray-500 hover:text-blue-500 transition-colors">
                <Edit2 size={14} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: asset.id, name: asset.name, type: 'asset' }); setDeleteOpen(true); }} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/90 shadow-sm text-gray-500 hover:text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed right-4 bottom-20 flex flex-col gap-3">
        <button
          onClick={handleAdd}
          className="w-14 h-14 bg-[#4A90D9] rounded-full shadow-lg shadow-blue-300/50 flex items-center justify-center text-white z-[60]"
        >
          <Plus size={28} />
        </button>
        {manageMode && (
          <button
            onClick={openAddGroup}
            className="w-12 h-12 bg-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 z-[60]"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      <DeleteConfirmModal
        open={deleteOpen}
        title={`是否删除${deleteTarget?.type === 'group' ? '分组' : ''}「${deleteTarget?.name || ''}」?`}
        onCancel={() => { setDeleteOpen(false); setDeleteTarget(null); }}
        onConfirm={handleConfirmDelete}
      />

      <DeleteConfirmModal
        open={batchDeleteOpen}
        title={`是否删除选中的 ${selectedIds.length} 项资产?`}
        onCancel={() => { setBatchDeleteOpen(false); }}
        onConfirm={handleConfirmBatchDelete}
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-end" onClick={() => setModalOpen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-gray-800">
                {editingId ? '编辑物品' : '添加物品'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-2 block">物品名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入物品名称"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">购买金额</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">物品分组</label>
                <div className="flex flex-wrap gap-2">
                  {groups.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setCategory(g.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        category === g.name
                          ? 'bg-[#4A90D9] text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">购买日期</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">保质期（可选）</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="无保质期"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="w-full py-3 bg-[#4A90D9] text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {editingId ? '保存修改' : '添加物品'}
              </button>
            </div>
          </div>
        </div>
      )}

      {groupModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-end" onClick={() => setGroupModalOpen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-gray-800">
                {editingGroupId ? '编辑分组' : '添加分组'}
              </h3>
              <button onClick={() => setGroupModalOpen(false)} className="p-1">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-2 block">分组名称</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="请输入分组名称"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSaveGroup}
                disabled={!groupName.trim()}
                className="w-full py-3 bg-[#4A90D9] text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {editingGroupId ? '保存修改' : '添加分组'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
