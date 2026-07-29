import { useState } from 'react';
import {
  Eye, EyeOff, MoreVertical, ChevronDown, ChevronUp, FileText, CreditCard,
  TrendingUp, Landmark, Wallet, CircleDollarSign, Plus, Pencil, Trash2, X, GripVertical
} from 'lucide-react';
import { useAccountStore } from '../stores/useAccountStore';
import { formatNumber } from '../utils/formatters';
import type { AccountType } from '../types';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const typeOptions: { value: AccountType; label: string }[] = [
  { value: 'fund', label: '资金账户' },
  { value: 'recharge', label: '充值账户' },
  { value: 'credit', label: '信贷账户' },
  { value: 'investment', label: '投资理财' },
  { value: 'other', label: '其他' },
];

export default function Accounts() {
  const {
    accounts, groups, showBalance, toggleShowBalance,
    addAccount, updateAccount, deleteAccount,
    addGroup, updateGroup, deleteGroup,
    getNetWorth, getTotalAssets, getTotalLiabilities
  } = useAccountStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [manageMode, setManageMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState<AccountType>('fund');
  const [groupId, setGroupId] = useState<string | undefined>(undefined);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: 'account' | 'group' } | null>(null);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');

  const grouped = accounts.reduce((acc, a) => {
    const key = a.groupId || 'ungrouped';
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {} as Record<string, typeof accounts>);

  const netWorth = getNetWorth();
  const totalAssets = getTotalAssets();
  const totalLiabilities = getTotalLiabilities();

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setBalance('');
    setType('fund');
    setGroupId(groups[0]?.id);
    setModalOpen(true);
  };

  const openEdit = (account: typeof accounts[0]) => {
    setEditingId(account.id);
    setName(account.name);
    setBalance(String(account.balance));
    setType(account.type);
    setGroupId(account.groupId);
    setModalOpen(true);
  };

  const handleSave = () => {
    const b = parseFloat(balance) || 0;
    if (!name.trim()) return;
    if (editingId) {
      updateAccount(editingId, { name: name.trim(), balance: b, type, groupId });
    } else {
      addAccount({ name: name.trim(), balance: b, type, groupId });
    }
    setModalOpen(false);
  };

  const handleDeleteClick = (id: string, name: string, type: 'account' | 'group') => {
    setDeleteTarget({ id, name, type });
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'account') {
      deleteAccount(deleteTarget.id);
    } else {
      deleteGroup(deleteTarget.id);
    }
    setDeleteOpen(false);
    setDeleteTarget(null);
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

  const getGroupTotal = (groupKey: string) => {
    const items = grouped[groupKey] || [];
    return items.reduce((s, a) => s + a.balance, 0);
  };

  const getGroupName = (groupKey: string) => {
    if (groupKey === 'ungrouped') return '未分组';
    const group = groups.find(g => g.id === groupKey);
    return group?.name || '未知分组';
  };

  const groupKeys = ['ungrouped', ...groups.map(g => g.id)];

  return (
    <div className="min-h-screen bg-[#F0F5FA] pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex-1" />
        <h2 className="text-lg font-semibold text-gray-800">账户</h2>
        <div className="flex-1 text-right">
          <button
            onClick={() => setManageMode(!manageMode)}
            className={`text-sm font-medium ${manageMode ? 'text-[#4A90D9]' : 'text-gray-500'}`}
          >
            {manageMode ? '完成' : '管理'}
          </button>
        </div>
      </div>

      {/* Net Worth Card */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-[#5B9BD5] to-[#4A8FD4] rounded-2xl p-5 text-white shadow-lg shadow-blue-200/50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-90">净资产(元)</span>
              <button onClick={toggleShowBalance}>
                {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <MoreVertical size={18} className="opacity-80" />
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold">
              {showBalance ? formatNumber(netWorth) : '****'}
            </div>
            <div className="text-right text-xs opacity-90">
              <div>总资产 {showBalance ? formatNumber(totalAssets) : '****'}</div>
              <div>负债 {showBalance ? formatNumber(totalLiabilities) : '****'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Cards */}
      <div className="px-4 mb-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <FileText size={20} className="text-[#4A90D9]" />
          </div>
          <div className="text-sm font-medium mb-2">报销</div>
          <div className="flex justify-between text-xs px-1">
            <div>
              <div className="text-gray-400">可报</div>
              <div>0.00</div>
            </div>
            <div>
              <div className="text-gray-400">已报</div>
              <div>0.00</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <CreditCard size={20} className="text-orange-500" />
          </div>
          <div className="text-sm font-medium mb-2">债务</div>
          <div className="flex justify-between text-xs px-1">
            <div>
              <div className="text-gray-400">应付</div>
              <div className="text-[#E53935]">0.00</div>
            </div>
            <div>
              <div className="text-gray-400">应收</div>
              <div className="text-[#43A047]">0.00</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <div className="text-sm font-medium mb-2">理财</div>
          <div className="flex justify-between text-xs px-1">
            <div>
              <div className="text-gray-400">总额</div>
              <div>0.00</div>
            </div>
            <div>
              <div className="text-gray-400">盈亏</div>
              <div className="text-[#E53935]">+0.00</div>
            </div>
          </div>
        </div>
      </div>

      {/* Account List */}
      <div className="px-4 space-y-3">
        {groupKeys.map((groupKey) => {
          const items = grouped[groupKey] || [];
          const isExpanded = expanded[groupKey] ?? true;
          const groupTotal = getGroupTotal(groupKey);

          return (
            <div key={groupKey} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleExpand(groupKey)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium">{getGroupName(groupKey)}</span>
                  <span className="text-sm text-gray-400">({items.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold">¥{formatNumber(groupTotal)}</span>
                  {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-3 space-y-3">
                  {items.length > 0 ? (
                    items.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between py-2 border-t border-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Wallet size={18} className="text-gray-500" />
                          </div>
                          <span className="text-sm">{account.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">¥{formatNumber(account.balance)}</span>
                          {manageMode && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEdit(account)}
                                className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center"
                              >
                                <Pencil size={13} className="text-[#4A90D9]" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(account.id, account.name, 'account')}
                                className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center"
                              >
                                <Trash2 size={13} className="text-red-500" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : groupKey !== 'ungrouped' && (
                    <div className="py-4 text-center text-gray-400 text-sm">
                      暂无账户
                    </div>
                  )}
                </div>
              )}
              {manageMode && groupKey !== 'ungrouped' && (
                <div className="px-4 pb-3 pt-2 border-t border-gray-50 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditGroup(groups.find(g => g.id === groupKey)!)}
                    className="text-xs text-blue-500 px-2 py-1"
                  >
                    编辑分组
                  </button>
                  <button
                    onClick={() => handleDeleteClick(groupKey, getGroupName(groupKey), 'group')}
                    className="text-xs text-red-500 px-2 py-1"
                  >
                    删除分组
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Buttons */}
      <div className="fixed right-4 bottom-20 flex flex-col gap-3">
        <button
          type="button"
          onClick={openAdd}
          className="w-14 h-14 bg-[#4A90D9] rounded-full shadow-lg shadow-blue-300/50 flex items-center justify-center text-white z-[55]"
          aria-label="添加账户"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
        {manageMode && (
          <button
            type="button"
            onClick={openAddGroup}
            className="w-12 h-12 bg-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 z-[55]"
            aria-label="添加分组"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      {/* Add/Edit Account Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-end" onClick={() => setModalOpen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-gray-800">
                {editingId ? '编辑账户' : '添加账户'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-2 block">账户名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入账户名称"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">账户余额</label>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">账户分组</label>
                <div className="flex flex-wrap gap-2">
                  {groups.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGroupId(g.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        groupId === g.id
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
                <label className="text-sm text-gray-500 mb-2 block">账户类型</label>
                <div className="grid grid-cols-3 gap-2">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setType(opt.value)}
                      className={`py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        type === opt.value
                          ? 'bg-[#4A90D9] text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="w-full py-3 bg-[#4A90D9] text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {editingId ? '保存修改' : '添加账户'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Group Modal */}
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

      <DeleteConfirmModal
        open={deleteOpen}
        title={`是否删除${deleteTarget?.type === 'group' ? '分组' : '账户'}「${deleteTarget?.name || ''}」?`}
        onCancel={() => { setDeleteOpen(false); setDeleteTarget(null); }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

