import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FileText, CheckCircle2, TrendingUp, TrendingDown,
    Loader2, Calendar, ArrowRight, MapPin, Image as ImageIcon, BarChart3,
    Wallet, PieChart, XCircle, ArrowUpRight, ArrowDownLeft, Landmark, Clock, AlertCircle
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import FinanceChart from '../Components/Dashboard/FinanceChart';

import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title,
    PointElement,
    LineElement,
    Filler
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    ArcElement, Tooltip, Legend, 
    CategoryScale, LinearScale, BarElement, Title,
    PointElement, LineElement, Filler
);

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [stats, setStats] = useState({
        total: 0, pending: 0, verified: 0, inProgress: 0, completed: 0, rejected: 0
    });

    const [financeStats, setFinanceStats] = useState({
        balance: 0, totalIncome: 0, totalExpense: 0, estimatedCost: 0
    });
    
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
    const [incomeChartData, setIncomeChartData] = useState({ labels: [], datasets: [] });
    const [expenseChartData, setExpenseChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const savedUser = localStorage.getItem('user_session');
        if (savedUser) setUser(JSON.parse(savedUser));
        
        fetchDashboardData();

        const channel = supabase
            .channel('dashboard-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => fetchDashboardData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'finance_logs' }, () => fetchDashboardData())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data: allComplaints, error: errC } = await supabase.from('complaints').select('*');
            if (errC) throw errC;

            setStats({
                total: allComplaints.length,
                pending: allComplaints.filter(c => c.status === 'pending').length,
                verified: allComplaints.filter(c => c.status === 'verified').length,
                inProgress: allComplaints.filter(c => c.status === 'in_progress').length,
                completed: allComplaints.filter(c => c.status === 'completed').length,
                rejected: allComplaints.filter(c => c.status === 'rejected').length
            });

            const estimatedCost = allComplaints.reduce((acc, curr) => acc + (curr.cost_amount || 0), 0);
            const { data: financeLogs } = await supabase.from('finance_logs').select('*');
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const currentYear = new Date().getFullYear();
            let realIncome = 0;
            let realExpense = 0;
            const monthlyIncome = new Array(12).fill(0);
            const monthlyExpense = new Array(12).fill(0);

            if (financeLogs) {
                financeLogs.forEach(log => {
                    const amount = Number(log.amount) || 0;
                    const date = new Date(log.transaction_date);
                    
                    if (log.type === 'income') realIncome += amount;
                    else realExpense += amount;

                    if (date.getFullYear() === currentYear) {
                        const idx = date.getMonth();
                        if (log.type === 'income') monthlyIncome[idx] += amount;
                        else monthlyExpense[idx] += amount;
                    }
                });
            }

            setFinanceStats({
                balance: realIncome - realExpense,
                totalIncome: realIncome,
                totalExpense: realExpense,
                estimatedCost: estimatedCost
            });

            setIncomeChartData({
                labels: months,
                datasets: [{
                    label: 'Pemasukan', data: monthlyIncome, borderColor: '#10b981', fill: true, tension: 0.4,
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
                        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
                        return gradient;
                    }
                }]
            });

            setExpenseChartData({
                labels: months,
                datasets: [{
                    label: 'Pengeluaran', data: monthlyExpense, borderColor: '#ef4444', fill: true, tension: 0.4,
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
                        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
                        return gradient;
                    }
                }]
            });

            const dataSelesai = new Array(12).fill(0);
            const dataBelum = new Array(12).fill(0);
            allComplaints.forEach(item => {
                const date = new Date(item.created_at);
                if (date.getFullYear() === currentYear) {
                    const idx = date.getMonth();
                    if (item.status === 'completed') dataSelesai[idx] += 1;
                    else dataBelum[idx] += 1;
                }
            });
            setBarChartData({
                labels: months,
                datasets: [
                    { label: 'Selesai', data: dataSelesai, backgroundColor: '#10b981', borderRadius: 4 },
                    { label: 'Proses', data: dataBelum, backgroundColor: '#f59e0b', borderRadius: 4 }
                ]
            });

            const { data: recent } = await supabase.from('complaints').select('*, categories(name)').order('created_at', { ascending: false }).limit(5);
            if (recent) setRecentComplaints(recent);

            const { data: cats } = await supabase.from('categories').select('*');
            if (cats) {
                const catStats = cats.map(cat => ({
                    ...cat, count: allComplaints.filter(c => c.category_id === cat.id).length
                })).sort((a, b) => b.count - a.count);
                setCategoryStats(catStats);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (num) => "Rp " + (num || 0).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    const formatDate = (ds) => new Date(ds).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    
    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
            verified: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>{status}</span>;
    };

    const pieData = {
        labels: categoryStats.map(c => c.name),
        datasets: [{
            data: categoryStats.map(c => c.count),
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'],
            borderWidth: 2,
            borderColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
        }]
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, color: '#9ca3af' } } },
        layout: { padding: 10 }
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9ca3af' } },
            y: { grid: { color: '#334155', borderDash: [5, 5] }, ticks: { stepSize: 1, color: '#9ca3af' } }
        },
        plugins: { legend: { position: 'top', align: 'end', labels: { usePointStyle: true, color: '#9ca3af' } } }
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: { x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 10 } } }, y: { display: false } },
        elements: { point: { radius: 0, hitRadius: 10, hoverRadius: 5 } } 
    };

    if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="w-10 h-10 animate-spin text-emerald-600"/></div>;

    const role = user?.role;
    const showComplaints = role === 'admin' || role === 'petugas';
    const showFinance = role === 'admin' || role === 'bendahara';

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-600 dark:text-slate-400 mt-1">
                        {role === 'bendahara' ? 'Ringkasan arus kas dan anggaran desa' : 'Statistik penanganan laporan masyarakat'}
                    </p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-500 dark:text-slate-400">Halo,</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-lg uppercase">{user?.full_name || 'User'}</p>
                </div>
            </div>

            {showFinance && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Saldo Kas */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden flex flex-col justify-between h-40 group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <Landmark className="w-24 h-24" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-1 opacity-80">
                                    <Wallet className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Sisa Saldo Kas</span>
                                </div>
                                <h3 className="text-3xl font-bold tracking-tight truncate">{formatRupiah(financeStats.balance)}</h3>
                            </div>
                            <div className="relative z-10 text-xs text-blue-100 bg-white/10 w-fit px-2 py-1 rounded backdrop-blur-sm">Total Dana Tersedia</div>
                        </div>

                        {/* Pemasukan */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between h-40">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                                    <span className="text-sm font-bold uppercase">Pemasukan</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{formatRupiah(financeStats.totalIncome)}</h3>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">Total pendapatan masuk</p>
                        </div>

                        {/* Pengeluaran */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between h-40">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"><TrendingDown className="w-5 h-5" /></div>
                                    <span className="text-sm font-bold uppercase">Pengeluaran</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{formatRupiah(financeStats.totalExpense)}</h3>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">Total belanja desa</p>
                        </div>

                        {/* Estimasi */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between h-40">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-slate-300">
                                    <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg"><FileText className="w-5 h-5" /></div>
                                    <span className="text-sm font-bold uppercase">Estimasi</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{formatRupiah(financeStats.estimatedCost)}</h3>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">Kebutuhan perbaikan (Aduan)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                            <h4 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase mb-4 flex items-center">
                                <ArrowDownLeft className="w-4 h-4 mr-2 text-emerald-500"/> Tren Pemasukan
                            </h4>
                            <div className="h-64 w-full"><Line data={incomeChartData} options={lineOptions} /></div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                            <h4 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase mb-4 flex items-center">
                                <ArrowUpRight className="w-4 h-4 mr-2 text-red-500"/> Tren Pengeluaran
                            </h4>
                            <div className="h-64 w-full"><Line data={expenseChartData} options={lineOptions} /></div>
                        </div>
                    </div>
                </div>
            )}

            {showComplaints && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-colors group">
                            <div className="flex justify-between">
                                <div><p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Pengaduan</p><h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 group-hover:text-emerald-500 transition-colors">{stats.total}</h3></div>
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400"><FileText className="w-6 h-6"/></div>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:border-purple-500 transition-colors group">
                            <div className="flex justify-between">
                                <div><p className="text-sm font-medium text-gray-500 dark:text-slate-400">Diproses</p><h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 group-hover:text-purple-500 transition-colors">{stats.inProgress}</h3></div>
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400"><Loader2 className="w-6 h-6"/></div>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:border-green-500 transition-colors group">
                            <div className="flex justify-between">
                                <div><p className="text-sm font-medium text-gray-500 dark:text-slate-400">Selesai</p><h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 group-hover:text-green-500 transition-colors">{stats.completed}</h3></div>
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400"><CheckCircle2 className="w-6 h-6"/></div>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className="bg-green-500 h-full rounded-full" style={{ width: `${(stats.completed / stats.total) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:border-red-500 transition-colors group">
                            <div className="flex justify-between">
                                <div><p className="text-sm font-medium text-gray-500 dark:text-slate-400">Ditolak</p><h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 group-hover:text-red-500 transition-colors">{stats.rejected}</h3></div>
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400"><XCircle className="w-6 h-6"/></div>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className="bg-red-500 h-full rounded-full" style={{ width: `${(stats.rejected / stats.total) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-stretch">
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Statistik Bulanan
                            </h3>
                            <div className="flex-1 w-full min-h-[300px]">
                                <Bar data={barChartData} options={barOptions} />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Kategori Laporan
                            </h3>
                            <div className="flex-1 flex items-center justify-center min-h-[250px]">
                                {categoryStats.length > 0 ? (
                                    <div className="w-full h-[250px] relative"> 
                                        <Pie data={pieData} options={pieOptions} />
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 dark:text-slate-500 text-sm">
                                        <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-50"/>
                                        Belum ada data kategori.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Laporan Terbaru
                            </h3>
                            <Link to="/kelola" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium flex items-center transition-colors">
                                Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                        <div className="p-6 space-y-4">
                            {recentComplaints.length === 0 ? (
                                <div className="text-center py-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                                    <FileText className="w-10 h-10 text-gray-300 dark:text-slate-600 mb-2" />
                                    <p className="text-gray-500 dark:text-slate-400 font-medium">Belum ada pengaduan masuk.</p>
                                </div>
                            ) : (
                                recentComplaints.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-emerald-50/50 dark:hover:bg-slate-700/50 transition-colors group relative">
                                        <div className="w-full sm:w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden border dark:border-slate-600">
                                            {item.photo_url ? (
                                                <img src={item.photo_url} alt="Bukti" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-slate-500">
                                                    <ImageIcon className="w-8 h-8 opacity-50" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-2 gap-2">
                                                <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-base">{item.title}</h4>
                                                {getStatusBadge(item.status)}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2 mb-3">{item.description}</p>
                                            <div className="flex flex-wrap gap-3 text-xs font-medium text-gray-500 dark:text-slate-400">
                                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 text-gray-400" /> {formatDate(item.created_at)}</span>
                                                <span className="flex items-center truncate max-w-[150px]"><MapPin className="w-3 h-3 mr-1 text-gray-400" /> {item.location || '-'}</span>
                                                {item.categories && (
                                                    <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded border dark:border-slate-600 ml-auto sm:ml-0">
                                                        {item.categories.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Link to={`/laporan/${item.id}`} className="absolute inset-0"></Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}