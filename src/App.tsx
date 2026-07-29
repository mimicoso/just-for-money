import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Accounts from './pages/Accounts';
import Assets from './pages/Assets';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import Budget from './pages/Budget';
import AccountManagement from './pages/AccountManagement';
import TagManagement from './pages/TagManagement';
import CategoryManagement from './pages/CategoryManagement';
import Settings from './pages/Settings';
import Wishlist from './pages/Wishlist';
import LedgerManagement from './pages/LedgerManagement';
import DataMode from './pages/DataMode';
import CloudSync from './pages/CloudSync';
import RemoteDatabase from './pages/RemoteDatabase';
import ImportExport from './pages/ImportExport';
import DataBackup from './pages/DataBackup';
import ThemeSettings from './pages/ThemeSettings';
import IconManagement from './pages/IconManagement';
import Recurring from './pages/Recurring';
import BottomNav from './components/BottomNav';
import FloatingButton from './components/FloatingButton';
import AddTransactionModal from './components/AddTransactionModal';
export default function App() {
  return (
    <Router>
      <div className="max-w-md mx-auto bg-[#F0F5FA] min-h-screen relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/account-management" element={<AccountManagement />} />
          <Route path="/tag-management" element={<TagManagement />} />
          <Route path="/category-management" element={<CategoryManagement />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/ledger-management" element={<LedgerManagement />} />
          <Route path="/data-mode" element={<DataMode />} />
          <Route path="/cloud-sync" element={<CloudSync />} />
          <Route path="/remote-database" element={<RemoteDatabase />} />
          <Route path="/import-export" element={<ImportExport />} />
          <Route path="/data-backup" element={<DataBackup />} />
          <Route path="/theme-settings" element={<ThemeSettings />} />
          <Route path="/icon-management" element={<IconManagement />} />
          <Route path="/recurring" element={<Recurring />} />
        </Routes>
        <BottomNav />
        <FloatingButton />
        <AddTransactionModal />
      </div>
    </Router>
  );
}
