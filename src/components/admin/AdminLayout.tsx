import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Briefcase, 
  Newspaper, 
  MessageSquare,
  Phone,
  Settings as SettingsIcon,
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/products', label: 'Sản phẩm', icon: <Package size={20} /> },
    { path: '/admin/projects', label: 'Dự án', icon: <Briefcase size={20} /> },
    { path: '/admin/news', label: 'Tin tức', icon: <Newspaper size={20} /> },
    { path: '/admin/recruitment', label: 'Tuyển dụng', icon: <Briefcase size={20} /> },
    { path: '/admin/messages', label: 'Tin nhắn', icon: <MessageSquare size={20} /> },
    { path: '/admin/contact', label: 'Liên hệ', icon: <Phone size={20} /> },
    { path: '/admin/settings', label: 'Cài đặt', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <Link to="/" className="text-xl font-bold text-blue-800 dark:text-blue-400">
            Hoài Sơn Admin
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 dark:text-gray-300">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-800 dark:text-white">Quản trị hệ thống</span>
          <div className="w-6"></div> {/* Spacer for centering */}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
