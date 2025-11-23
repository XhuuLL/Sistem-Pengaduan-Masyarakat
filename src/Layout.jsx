import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Bell, Menu, X, Home, FileText, LayoutDashboard, User, Users, FolderTree, LogOut, Moon, Sun, AlertTriangle } from 'lucide-react';
import { Building2 } from 'lucide-react';

export default function Layout() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user_session');
    setUser(null);
    setIsLogoutOpen(false);
    window.location.href = '/';
  };

  const publicMenuItems = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Buat Pengaduan', path: '/lapor', icon: FileText },
  ];

  const petugasMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Pengaduan', path: '/kelola-aduan', icon: FileText },
  ];

  const adminMenuItems = [
    ...petugasMenuItems,
    { name: 'Kelola User', path: '/pengguna', icon: Users },
    { name: 'Kelola Kategori', path: '/kategori', icon: FolderTree },
  ];

  let menuItems = publicMenuItems;
  if (user) {
    if (user.role === 'admin') menuItems = adminMenuItems;
    else if (user.role === 'petugas') menuItems = petugasMenuItems;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 border-b border-emerald-100 dark:border-slate-700 sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <Building2 className="text-white w-6 h-6" />
                </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Lapor Kang</h1>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Sistem Pengaduan Masyarakat</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 bg-gray-50 dark:bg-slate-700/50 p-1 rounded-xl border dark:border-slate-600">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                    currentPath === item.path
                      ? 'bg-white dark:bg-slate-600 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <item.icon className={`w-4 h-4 mr-2 ${currentPath === item.path ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-slate-400'}`} />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full text-gray-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="flex items-center pl-4 border-l border-gray-200 dark:border-slate-600 gap-3">
                     
                     <Link to="/profil" className="group text-right hidden md:block cursor-pointer">
                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {user.full_name}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium capitalize bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full inline-block">
                            {user.role}
                        </p>
                     </Link>

                     <button 
                        onClick={handleLogoutClick}
                        className="w-9 h-9 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                        title="Keluar"
                     >
                        <LogOut className="w-4 h-4" />
                     </button>
                </div>
              ) : (
                <Link to="/login">
                    <button className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium text-sm px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-all">
                        <User className="w-4 h-4" /> Login
                    </button>
                </Link>
              )}

              <button
                className="md:hidden p-2 text-gray-600 dark:text-slate-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 absolute w-full shadow-lg">
              <div className="p-4 space-y-2">
                {user && (
                    <Link to="/profil" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-4 py-3 mb-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                        <User className="w-5 h-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">{user.full_name}</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 capitalize">{user.role}</p>
                        </div>
                    </Link>
                )}

                {menuItems.map((item) => (
                    <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
                        currentPath === item.path
                        ? 'bg-emerald-50 dark:bg-slate-700 text-emerald-700 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                    >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                    </Link>
                ))}
              </div>
            </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">© 2025 Sistem Pengaduan Masyarakat By XhuuLL</p>
        </div>
      </footer>

      {isLogoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Konfirmasi Keluar</h3>
                    <p className="text-gray-500 dark:text-slate-400 mb-6">Apakah Anda yakin ingin keluar dari sistem?</p>
                    
                    <div className="flex gap-3">
                        <button onClick={() => setIsLogoutOpen(false)} className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Batal</button>
                        <button onClick={confirmLogout} className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200 dark:shadow-none">Ya, Keluar</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}