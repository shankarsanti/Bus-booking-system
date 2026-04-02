import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Wallet, 
  User, 
  LogOut, 
  Home,
  ChevronLeft,
  ChevronRight,
  Bus,
  Route,
  Calendar,
  Users,
  BarChart3,
  Clock
} from 'lucide-react';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  menuItems: MenuItem[];
  userRole: 'agent' | 'admin';
  userName?: string;
  onLogout: () => void;
}

export default function Sidebar({ 
  isOpen, 
  onToggle, 
  menuItems, 
  userRole, 
  userName,
  onLogout 
}: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside 
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col shadow-sm`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900">
                {userRole === 'admin' ? 'Admin' : 'Agent'} Panel
              </h1>
              {userName && (
                <p className="text-xs text-neutral-500 truncate max-w-[140px]">
                  {userName}
                </p>
              )}
            </div>
          </div>
        )}
        <button 
          onClick={onToggle}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-neutral-600" />
          )}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                isActive 
                  ? 'bg-primary-50 text-primary-600 shadow-sm' 
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
              title={!isOpen ? item.name : undefined}
            >
              <div className={`${isActive ? 'text-primary-600' : 'text-neutral-500 group-hover:text-neutral-700'}`}>
                {item.icon}
              </div>
              {isOpen && (
                <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.name}
                </span>
              )}
              {isActive && isOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-200 p-3 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all"
          title={!isOpen ? 'Home' : undefined}
        >
          <Home className="w-5 h-5" />
          {isOpen && <span className="font-medium">Home</span>}
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all w-full"
          title={!isOpen ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

// Predefined menu items for different roles
export const agentMenuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/agent/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Search Buses', path: '/agent/search', icon: <Search className="w-5 h-5" /> },
  { name: 'My Bookings', path: '/agent/bookings', icon: <FileText className="w-5 h-5" /> },
  { name: 'Wallet', path: '/agent/wallet', icon: <Wallet className="w-5 h-5" /> },
  { name: 'Profile', path: '/agent/profile', icon: <User className="w-5 h-5" /> }
];

export const adminMenuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Buses', path: '/admin/buses', icon: <Bus className="w-5 h-5" /> },
  { name: 'Routes', path: '/admin/routes', icon: <Route className="w-5 h-5" /> },
  { name: 'Trips', path: '/admin/trips', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Agents', path: '/admin/agents', icon: <Users className="w-5 h-5" /> },
  { name: 'Wallets', path: '/admin/wallets', icon: <Wallet className="w-5 h-5" /> },
  { name: 'Bookings', path: '/admin/bookings', icon: <FileText className="w-5 h-5" /> },
  { name: 'Reports', path: '/admin/reports', icon: <BarChart3 className="w-5 h-5" /> },
  { name: 'Login History', path: '/admin/login-history', icon: <Clock className="w-5 h-5" /> }
];
