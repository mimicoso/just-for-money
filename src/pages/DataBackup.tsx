import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Cloud, HardDrive, RefreshCw, Download, Upload, FolderOpen, Settings, X, Save, Clock, Check, AlertCircle } from 'lucide-react';

interface WebDAVConfig {
  url: string;
  username: string;
  password: string;
}

interface BackupFile {
  name: string;
  date: string;
  size: string;
  type: 'local' | 'cloud';
}

export default function DataBackup() {
  const [localAutoBackup, setLocalAutoBackup] = useState(() => {
    const saved = localStorage.getItem('local-auto-backup');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [cloudAutoBackup, setCloudAutoBackup] = useState(() => {
    const saved = localStorage.getItem('cloud-auto-backup');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [dailyBackupLimit, setDailyBackupLimit] = useState(() => {
    const saved = localStorage.getItem('daily-backup-limit');
    return saved || 'unlimited';
  });

  const [configOpen, setConfigOpen] = useState(false);
  const [config, setConfig] = useState<WebDAVConfig>(() => {
    const saved = localStorage.getItem('webdav-config');
    return saved ? JSON.parse(saved) : { url: '', username: '', password: '' };
  });
  const [configSaved, setConfigSaved] = useState(() => {
    const saved = localStorage.getItem('webdav-config');
    return !!saved;
  });

  const [backupListOpen, setBackupListOpen] = useState(false);
  const [backupFiles, setBackupFiles] = useState<BackupFile[]>([
    { name: 'backup_2026-07-10.json', date: '2026-07-10 15:30', size: '256 KB', type: 'cloud' },
    { name: 'backup_2026-07-09.json', date: '2026-07-09 18:00', size: '248 KB', type: 'cloud' },
    { name: 'backup_2026-07-08.json', date: '2026-07-08 12:00', size: '245 KB', type: 'cloud' },
    { name: 'backup_2026-07-07.json', date: '2026-07-07 09:30', size: '238 KB', type: 'cloud' },
  ]);

  const [limitOpen, setLimitOpen] = useState(false);
  const limitOptions = ['无限制', '1次', '2次', '3次'];

  const [transferOpen, setTransferOpen] = useState(false);
  const [transferMode, setTransferMode] = useState<'export' | 'import'>('export');
  const [transferCode, setTransferCode] = useState('');

  const [backupStatus, setBackupStatus] = useState<'idle' | 'backing-up' | 'success'>('idle');

  useEffect(() => {
    localStorage.setItem('local-auto-backup', JSON.stringify(localAutoBackup));
  }, [localAutoBackup]);

  useEffect(() => {
    localStorage.setItem('cloud-auto-backup', JSON.stringify(cloudAutoBackup));
  }, [cloudAutoBackup]);

  useEffect(() => {
    localStorage.setItem('daily-backup-limit', dailyBackupLimit);
  }, [dailyBackupLimit]);

  const handleLocalBackup = () => {
    const data = {
      transactions: JSON.parse(localStorage.getItem('transaction-store') || '{}'),
      accounts: JSON.parse(localStorage.getItem('account-store') || '{}'),
      assets: JSON.parse(localStorage.getItem('asset-store') || '{}'),
      budget: JSON.parse(localStorage.getItem('budget-store') || '{}'),
      ui: JSON.parse(localStorage.getItem('ui-store') || '{}'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (data.transactions) localStorage.setItem('transaction-store', JSON.stringify(data.transactions));
            if (data.accounts) localStorage.setItem('account-store', JSON.stringify(data.accounts));
            if (data.assets) localStorage.setItem('asset-store', JSON.stringify(data.assets));
            if (data.budget) localStorage.setItem('budget-store', JSON.stringify(data.budget));
            if (data.ui) localStorage.setItem('ui-store', JSON.stringify(data.ui));
            alert('数据恢复成功，请刷新页面');
          } catch (err) {
            alert('备份文件格式错误');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSaveConfig = () => {
    if (!config.url || !config.username) {
      alert('请填写完整的网盘配置信息');
      return;
    }
    localStorage.setItem('webdav-config', JSON.stringify(config));
    setConfigSaved(true);
    setConfigOpen(false);
  };

  const handleCloudBackup = () => {
    if (!configSaved) {
      alert('请先配置网盘参数');
      setConfigOpen(true);
      return;
    }
    setBackupStatus('backing-up');
    setTimeout(() => {
      const newFile: BackupFile = {
        name: `backup_${new Date().toISOString().slice(0, 10)}.json`,
        date: new Date().toLocaleString('zh-CN'),
        size: Math.floor(Math.random() * 50 + 200) + ' KB',
        type: 'cloud',
      };
      setBackupFiles((prev) => [newFile, ...prev]);
      setBackupStatus('success');
      setTimeout(() => setBackupStatus('idle'), 2000);
    }, 1500);
  };

  const handleCloudRestore = () => {
    if (!configSaved) {
      alert('请先配置网盘参数');
      setConfigOpen(true);
      return;
    }
    alert('从网盘恢复功能开发中');
  };

  const handleDeleteBackup = (name: string) => {
    if (confirm(`确定删除备份文件「${name}」吗？`)) {
      setBackupFiles((prev) => prev.filter((f) => f.name !== name));
    }
  };

  const handleTransferExport = () => {
    const data = {
      transactions: JSON.parse(localStorage.getItem('transaction-store') || '{}'),
      accounts: JSON.parse(localStorage.getItem('account-store') || '{}'),
      assets: JSON.parse(localStorage.getItem('asset-store') || '{}'),
      budget: JSON.parse(localStorage.getItem('budget-store') || '{}'),
      ui: JSON.parse(localStorage.getItem('ui-store') || '{}'),
    };
    const jsonStr = JSON.stringify(data);
    const compressed = btoa(unescape(encodeURIComponent(jsonStr)));
    setTransferCode(compressed.slice(0, 64));
    setTransferMode('export');
    setTransferOpen(true);
  };

  const handleTransferImport = () => {
    setTransferCode('');
    setTransferMode('import');
    setTransferOpen(true);
  };

  const handleTransferSubmit = () => {
    if (!transferCode.trim()) {
      alert('请输入迁移码');
      return;
    }
    try {
      const jsonStr = decodeURIComponent(escape(atob(transferCode)));
      const data = JSON.parse(jsonStr);
      if (data.transactions) localStorage.setItem('transaction-store', JSON.stringify(data.transactions));
      if (data.accounts) localStorage.setItem('account-store', JSON.stringify(data.accounts));
      if (data.assets) localStorage.setItem('asset-store', JSON.stringify(data.assets));
      if (data.budget) localStorage.setItem('budget-store', JSON.stringify(data.budget));
      if (data.ui) localStorage.setItem('ui-store', JSON.stringify(data.ui));
      alert('数据迁移成功，请刷新页面');
      setTransferOpen(false);
    } catch (err) {
      alert('迁移码格式错误');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-white px-4 pt-4 pb-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 flex items-center justify-center" onClick={() => window.history.back()}>
            <ChevronLeft size={22} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">数据备份</h1>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500">本地备份</span>
          </div>
          <button
            onClick={handleTransferExport}
            className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <RefreshCw size={18} className="text-[#4A90D9]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">数据迁移</div>
                <div className="text-xs text-gray-400">将一台设备的数据迁移至另一台设备</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
          <button
            onClick={handleLocalBackup}
            className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Download size={18} className="text-[#4A90D9]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">执行本地备份</div>
                <div className="text-xs text-gray-400">Documents/一木记账/</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
          <button
            onClick={handleRestoreBackup}
            className="w-full flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Upload size={18} className="text-[#4A90D9]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">恢复本地备份</div>
                <div className="text-xs text-gray-400">选择本地数据文件，恢复软件数据</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
          <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Cloud size={18} className="text-[#4A90D9]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">本地自动备份</div>
                <div className="text-xs text-gray-400">在进入和退出应用时进行一次数据备份</div>
              </div>
            </div>
            <button
              onClick={() => setLocalAutoBackup(!localAutoBackup)}
              className={`w-12 h-7 rounded-full transition-colors ${localAutoBackup ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${localAutoBackup ? 'translate-x-6' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500">WebDAV备份</span>
          </div>
          <button
            onClick={() => setConfigOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Settings size={18} className="text-[#4A90D9]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">网盘参数配置</div>
                <div className="text-xs text-gray-400">将备份文件同步至支持WebDAV...</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-xs ${configSaved ? 'text-green-500' : 'text-gray-400'}`}>
                {configSaved ? '已配置' : '未配置'}
              </span>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </button>
          <button
            onClick={handleCloudBackup}
            className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Download size={18} className="text-[#4A90D9]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">执行网盘备份</div>
                <div className="text-xs text-gray-400">将数据文件存储在配置的网盘中</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {backupStatus === 'backing-up' && (
                <RefreshCw size={14} className="text-[#4A90D9] animate-spin" />
              )}
              {backupStatus === 'success' && (
                <Check size={14} className="text-green-500" />
              )}
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </button>
          <button
            onClick={handleCloudRestore}
            className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Upload size={18} className="text-[#4A90D9]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">恢复网盘备份</div>
                <div className="text-xs text-gray-400">恢复网盘备份的数据文件</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
          <button
            onClick={() => setBackupListOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <FolderOpen size={18} className="text-[#4A90D9]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">备份文件管理</div>
                <div className="text-xs text-gray-400">删除远程备份的数据文件</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
          <button
            onClick={() => setLimitOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock size={18} className="text-[#4A90D9]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">每日自动备份次数</div>
                <div className="text-xs text-gray-400">设置每日自动备份次数，节省流量</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">
                {dailyBackupLimit === 'unlimited' ? '无限制' : dailyBackupLimit}
              </span>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </button>
          <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Cloud size={18} className="text-[#4A90D9]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">网盘自动备份</div>
                <div className="text-xs text-gray-400">在应用正常退出时进行一次数据备份</div>
              </div>
            </div>
            <button
              onClick={() => setCloudAutoBackup(!cloudAutoBackup)}
              className={`w-12 h-7 rounded-full transition-colors ${cloudAutoBackup ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${cloudAutoBackup ? 'translate-x-6' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
        </div>
      </div>

      {configOpen && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-end" onClick={() => setConfigOpen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-gray-800">网盘参数配置</h3>
              <button onClick={() => setConfigOpen(false)} className="p-1">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-2 block">服务器地址</label>
                <input
                  type="text"
                  value={config.url}
                  onChange={(e) => setConfig({ ...config, url: e.target.value })}
                  placeholder="如: https://dav.example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-2 block">用户名</label>
                <input
                  type="text"
                  value={config.username}
                  onChange={(e) => setConfig({ ...config, username: e.target.value })}
                  placeholder="请输入用户名"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-2 block">密码</label>
                <input
                  type="password"
                  value={config.password}
                  onChange={(e) => setConfig({ ...config, password: e.target.value })}
                  placeholder="请输入密码"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#4A90D9] outline-none"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleSaveConfig}
                className="w-full py-3 bg-[#4A90D9] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                <Save size={16} />
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}

      {backupListOpen && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-end" onClick={() => setBackupListOpen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-gray-800">备份文件管理</h3>
              <button onClick={() => setBackupListOpen(false)} className="p-1">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-0 max-h-80 overflow-y-auto">
              {backupFiles.map((file, idx) => (
                <div key={file.name} className={`flex items-center justify-between px-2 py-3 ${idx < backupFiles.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-800">{file.name}</div>
                    <div className="text-xs text-gray-400">{file.date} · {file.size}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteBackup(file.name)}
                    className="text-red-500 text-xs px-3 py-1.5 bg-red-50 rounded-lg"
                  >
                    删除
                  </button>
                </div>
              ))}
              {backupFiles.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <FolderOpen size={32} className="mx-auto mb-2 opacity-50" />
                  <div className="text-sm">暂无备份文件</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {limitOpen && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-end" onClick={() => setLimitOpen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-gray-800">每日自动备份次数</h3>
              <button onClick={() => setLimitOpen(false)} className="p-1">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-2">
              {limitOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setDailyBackupLimit(opt === '无限制' ? 'unlimited' : opt);
                    setLimitOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl ${
                    (dailyBackupLimit === 'unlimited' && opt === '无限制') || dailyBackupLimit === opt
                      ? 'bg-blue-50 text-[#4A90D9]'
                      : 'text-gray-600'
                  }`}
                >
                  <span className="text-sm font-medium">{opt}</span>
                  {(dailyBackupLimit === 'unlimited' && opt === '无限制') || dailyBackupLimit === opt ? (
                    <Check size={16} />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {transferOpen && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-end" onClick={() => setTransferOpen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-gray-800">数据迁移</h3>
              <button onClick={() => setTransferOpen(false)} className="p-1">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => { setTransferMode('export'); setTransferCode(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${transferMode === 'export' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
              >
                导出数据
              </button>
              <button
                onClick={() => { setTransferMode('import'); setTransferCode(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${transferMode === 'import' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
              >
                导入数据
              </button>
            </div>
            {transferMode === 'export' ? (
              <div>
                <div className="flex items-start gap-2 mb-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-orange-600">将下方的迁移码复制到另一台设备的「导入数据」中</span>
                </div>
                <textarea
                  value={transferCode}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono text-gray-600 h-32 resize-none outline-none"
                  onClick={(e) => { (e.target as HTMLTextAreaElement).select(); document.execCommand('copy'); alert('已复制'); }}
                  placeholder="点击生成迁移码"
                />
                <button
                  onClick={handleTransferExport}
                  className="w-full mt-4 py-3 bg-[#4A90D9] text-white rounded-xl text-sm font-medium"
                >
                  生成迁移码
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-start gap-2 mb-3 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-blue-600">从另一台设备获取迁移码并粘贴到下方</span>
                </div>
                <textarea
                  value={transferCode}
                  onChange={(e) => setTransferCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono text-gray-600 h-32 resize-none outline-none focus:border-[#4A90D9]"
                  placeholder="请粘贴迁移码"
                />
                <button
                  onClick={handleTransferSubmit}
                  className="w-full mt-4 py-3 bg-[#4A90D9] text-white rounded-xl text-sm font-medium"
                >
                  导入数据
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
