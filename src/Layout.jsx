import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
    Menu, X, Home, FileText, LayoutDashboard, User, Users, 
    FolderTree, LogOut, Moon, Sun, AlertTriangle, Building2, 
    Wallet, Tag, Settings, ChevronRight
} from 'lucide-react';

// --- KOMPONEN SIDEBAR ---
const SidebarContent = ({ menuGroups, currentPath, onNavigate, user, onLogout }) => {
    return (
        <div className="py-6 px-4 space-y-8">
            {menuGroups.map((group, index) => (
                <div key={index}>
                    {group.title && (
                        <h3 className="px-4 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                            {group.title}
                        </h3>
                    )}
                    <div className="space-y-1">
                        {group.items.map((item) => {
                            const isActive = currentPath === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={onNavigate}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                        isActive
                                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10'
                                            : 'text-gray-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-slate-500 group-hover:text-emerald-500'}`} />
                                        {item.name}
                                    </div>
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
            
            {user && (
                <div>
                    <h3 className="px-4 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                        LAINNYA
                    </h3>
                    <button onClick={onLogout} className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                        <LogOut className="w-5 h-5 mr-3" />
                        Keluar
                    </button>
                </div>
            )}
        </div>
    );
};

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
    
    const isLandingPage = currentPath === '/' || currentPath === '/lapor';

    useEffect(() => {
        const handleStorageChange = () => {
        const savedUser = localStorage.getItem('user_session');
        if (savedUser) setUser(JSON.parse(savedUser));
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('userSessionUpdated', handleStorageChange);
        return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('userSessionUpdated', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleLogoutClick = () => setIsLogoutOpen(true);

    const confirmLogout = () => {
        localStorage.removeItem('user_session');
        setUser(null);
        setIsLogoutOpen(false);
        window.location.href = '/login';
    };

    const adminMenuGroups = [
        { title: '', items: [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] },
        { title: 'MANAJEMEN PENGADUAN', items: [{ name: 'Daftar Pengaduan', path: '/kelola', icon: FileText }, { name: 'Kategori Laporan', path: '/kategori', icon: FolderTree }] },
        { title: 'KEUANGAN DESA', items: [{ name: 'Arus Kas', path: '/keuangan', icon: Wallet }, { name: 'Kategori Keuangan', path: '/kategori-keuangan', icon: Tag }] },
        { title: 'PENGGUNA & SISTEM', items: [{ name: 'Kelola User', path: '/pengguna', icon: Users }, { name: 'Profil Saya', path: '/profil', icon: User }] }
    ];

    const petugasMenuGroups = [
        { title: '', items: [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] },
        { title: 'LAYANAN', items: [{ name: 'Kelola Pengaduan', path: '/kelola', icon: FileText }] },
        { title: 'AKUN', items: [{ name: 'Profil Saya', path: '/profil', icon: User }] }
    ];

    const bendaharaMenuGroups = [
        { title: '', items: [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] },
        { title: 'KEUANGAN DESA', items: [{ name: 'Arus Kas', path: '/keuangan', icon: Wallet }] }, // Cuma Arus Kas
        { title: 'AKUN', items: [{ name: 'Profil Saya', path: '/profil', icon: User }] }
    ];

    const publicMenuGroups = [
        { title: 'MENU UTAMA', items: [{ name: 'Beranda', path: '/', icon: Home }, { name: 'Buat Pengaduan', path: '/lapor', icon: FileText }] }
    ];

    let menuGroups = publicMenuGroups;
    if (user) {
        if (user.role === 'admin') menuGroups = adminMenuGroups;
        else if (user.role === 'petugas') menuGroups = petugasMenuGroups;
        else if (user.role === 'bendahara') menuGroups = bendaharaMenuGroups;
    }

    const flattenItems = menuGroups.flatMap(group => group.items);
    const activePageName = flattenItems.find(item => item.path === currentPath)?.name || 'SIGAP Desa';

    if (isLandingPage) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans transition-colors duration-300">
                <header className="fixed w-full top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 transition-colors shadow-sm">
                    <div className="w-full px-6 md:px-12 lg:px-16">
                        <div className="flex justify-between items-center h-20">
                            <Link to="/" className="flex items-center space-x-3 group">
                                <img src="/Brebes.svg" alt="Logo Brebes" className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
                                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">SIGAP</span>
                            </Link>

                            <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                                <Link to="/" className={`text-sm font-bold transition-colors ${currentPath === '/' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-slate-300 hover:text-emerald-600'}`}>Beranda</Link>
                                <Link to="/lapor" className={`text-sm font-bold transition-colors ${currentPath === '/lapor' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-slate-300 hover:text-emerald-600'}`}>Buat Pengaduan</Link>
                            </nav>

                            <div className="hidden md:flex items-center gap-4">
                                <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors border border-transparent dark:border-slate-700">
                                    {darkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
                                </button>
                                {user ? (
                                    <Link to="/dashboard">
                                        <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center shadow-lg">
                                            <LayoutDashboard className="w-4 h-4 mr-2"/> Dashboard
                                        </button>
                                    </Link>
                                ) : (
                                    <Link to="/login">
                                        <button className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30">
                                            Masuk
                                        </button>
                                    </Link>
                                )}
                            </div>

                            <div className="md:hidden flex items-center gap-4">
                                <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-gray-500">
                                    {darkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
                                </button>
                                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-700 dark:text-white">
                                    {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 absolute w-full shadow-xl">
                            <div className="px-6 pt-4 pb-6 space-y-2">
                                <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 font-bold rounded-lg ${currentPath === '/' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50'}`}>Beranda</Link>
                                <Link to="/lapor" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 font-bold rounded-lg ${currentPath === '/lapor' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50'}`}>Buat Pengaduan</Link>
                                {user ? (
                                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg">Masuk Dashboard</Link>
                                ) : (
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block mt-4 px-4 py-3 bg-emerald-600 text-white text-center font-bold rounded-xl shadow-lg">Masuk</Link>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                <main className="pt-20">
                    <Outlet />
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 font-sans transition-colors duration-300 overflow-hidden">
        <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 z-20">
            <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-slate-700">
                <Link to="/" className="flex items-center space-x-3 group">
                    <img src="/Brebes.svg" alt="Logo Brebes" className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
                    <h1 className="text-xl font-extrabold text-gray-800 dark:text-white tracking-tight">SIGAP</h1>
                </Link>
            </div>
            <nav className="flex-1 overflow-y-auto custom-scrollbar">
                <SidebarContent 
                    menuGroups={menuGroups} 
                    currentPath={currentPath} 
                    onNavigate={() => {}} 
                    user={user}
                    onLogout={handleLogoutClick}
                />
            </nav>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
            <header className="h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700 flex justify-between items-center px-4 sm:px-8 z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <button className="md:hidden p-2 text-gray-600 dark:text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <h2 className="hidden md:block text-lg font-bold text-gray-800 dark:text-white capitalize">
                        {activePageName}
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    
                    {user && (
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-600">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{user.full_name}</p>
                                <p className="text-[10px] text-emerald-600 uppercase font-bold">{user.role}</p>
                            </div>
                            <Link to="/profil" className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm overflow-hidden">
                                {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover"/> : user.full_name?.charAt(0)}
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
                <Outlet />
            </main>
        </div>

        {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto">
                    <div className="flex items-center p-6 border-b border-gray-100 dark:border-slate-700">
                        <img src="/Brebes.svg" alt="Logo Brebes" className="w-8 h-8 object-contain mr-3" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">SIGAP</span>
                    </div>
                    <SidebarContent 
                        menuGroups={menuGroups} 
                        currentPath={currentPath} 
                        onNavigate={() => setMobileMenuOpen(false)} 
                        user={user}
                        onLogout={handleLogoutClick}
                    />
                </div>
            </div>
        )}

        {isLogoutOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-xl p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"><AlertTriangle className="w-8 h-8" /></div>
                    <h3 className="text-xl font-bold dark:text-white mb-2">Konfirmasi Keluar</h3>
                    <p className="text-gray-500 mb-6">Yakin ingin keluar dari sistem?</p>
                    <div className="flex gap-3">
                        <button onClick={() => setIsLogoutOpen(false)} className="flex-1 py-2 rounded-xl border font-medium dark:text-white">Batal</button>
                        <button onClick={confirmLogout} className="flex-1 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700">Ya, Keluar</button>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
    }