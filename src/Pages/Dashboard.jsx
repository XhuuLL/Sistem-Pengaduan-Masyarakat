import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FileText, Clock, CheckCircle2, TrendingUp, 
    Loader2, BarChart3, Calendar, ArrowRight, MapPin, Image as ImageIcon 
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0, pending: 0, verified: 0, inProgress: 0, completed: 0, rejected: 0
    });
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);

    useEffect(() => {
        const savedUser = localStorage.getItem('user_session');
        if (savedUser) setUser(JSON.parse(savedUser));
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const { data: allComplaints, error: errComplaints } = await supabase.from('complaints').select('*');
            if (errComplaints) throw errComplaints;

            const newStats = {
                total: allComplaints.length,
                pending: allComplaints.filter(c => c.status === 'pending').length,
                verified: allComplaints.filter(c => c.status === 'verified').length,
                inProgress: allComplaints.filter(c => c.status === 'in_progress').length,
                completed: allComplaints.filter(c => c.status === 'completed').length,
                rejected: allComplaints.filter(c => c.status === 'rejected').length
            };
            setStats(newStats);

            const { data: recentData } = await supabase
                .from('complaints')
                .select('*, categories ( name )')
                .order('created_at', { ascending: false })
                .limit(5);
            if (recentData) setRecentComplaints(recentData);

            const { data: categories } = await supabase.from('categories').select('*');
            if (categories) {
                const catStats = categories.map(cat => {
                    const count = allComplaints.filter(c => c.category_id === cat.id).length;
                    return { ...cat, count };
                }).sort((a, b) => b.count - a.count);
                setCategoryStats(catStats);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
            verified: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-slate-400 mt-1">Selamat datang, <span className="font-semibold text-emerald-600 dark:text-emerald-400">{user?.full_name || 'Admin'}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Pengaduan</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</h3>
                        </div>
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400"><FileText className="w-6 h-6" /></div>
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-4 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> Data Realtime</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Perlu Verifikasi</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.pending}</h3>
                        </div>
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400"><Clock className="w-6 h-6" /></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-4">Belum ditangani</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Dalam Proses</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.inProgress}</h3>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400"><Loader2 className="w-6 h-6" /></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-4">Sedang dikerjakan</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Selesai</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.completed}</h3>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400"><CheckCircle2 className="w-6 h-6" /></div>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-4">Laporan tuntas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pengaduan Terbaru */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Pengaduan Terbaru
                        </h3>
                        <Link to="/kelola-aduan" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium flex items-center">
                            Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    <div className="p-6 space-y-4">
                        {recentComplaints.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-slate-400 py-4">Belum ada pengaduan masuk.</p>
                        ) : (
                            recentComplaints.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 rounded-lg border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden border dark:border-slate-600">
                                        {item.photo_url ? (
                                            <img src={item.photo_url} alt="Bukti" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-slate-500">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.title}</h4>
                                            {getStatusBadge(item.status)}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2 mb-2">{item.description}</p>
                                        <div className="flex flex-wrap gap-3 text-xs text-gray-400 dark:text-slate-500">
                                            <span className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded font-mono text-gray-600 dark:text-slate-300">{item.ticket_id}</span>
                                            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {formatDate(item.created_at)}</span>
                                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {item.location || '-'}</span>
                                            {item.categories && (
                                                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">
                                                    {item.categories.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Kategori Populer
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {categoryStats.map((cat) => (
                            <div key={cat.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${cat.color || 'bg-emerald-500'}`}></div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{cat.name}</span>
                                </div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                                    {cat.count}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}