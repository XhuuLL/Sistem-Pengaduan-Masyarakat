import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FileText, CheckCircle2, TrendingUp, ArrowRight, 
    Shield, Clock, MessageSquare, Loader2, Activity 
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Home() {
    const [stats, setStats] = useState({
        total: 0, completed: 0, inProgress: 0, pending: 0
    });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user_session');
        if (savedUser) setUser(JSON.parse(savedUser));
        fetchHomeStats();
    }, []);

    const fetchHomeStats = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('complaints').select('status');
            if (error) throw error;
            if (data) {
                const total = data.length;
                const pending = data.filter(c => c.status === 'pending').length;
                const inProgress = data.filter(c => c.status === 'in_progress' || c.status === 'verified').length;
                const completed = data.filter(c => c.status === 'completed').length;
                setStats({ total, pending, inProgress, completed });
            }
        } catch (error) {
            console.error("Gagal memuat statistik:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-12 animate-in fade-in duration-700">
            <section className="relative overflow-hidden rounded-3xl p-8 md:p-20 shadow-2xl text-center md:text-left mx-4 md:mx-0 group">
                <div className="absolute inset-0 w-full h-full">
                    <img 
                        src="balaidesa.jpg" 
                        alt="Background Desa" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/85 to-teal-900/70"></div>
                </div>

                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl" />
                
                <div className="relative z-10 max-w-4xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-800/30 border border-emerald-400/30 text-emerald-100 text-xs font-semibold mb-6 backdrop-blur-md">
                        Layanan Aspirasi dan Pengaduan Online
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
                        Suara Anda, <br/> Kemajuan Desa Kita.
                    </h1>
                    <p className="text-lg md:text-xl text-emerald-50 mb-10 max-w-2xl leading-relaxed opacity-95 drop-shadow-md">
                        Sampaikan laporan masalah infrastruktur, pelayanan, dan keamanan Desa Cipelem dengan mudah, transparan, dan terpercaya.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link to="/lapor">
                            <button className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-800 font-bold rounded-xl shadow-xl hover:bg-emerald-50 hover:scale-105 transition-all flex items-center justify-center group">
                                <FileText className="w-5 h-5 mr-2 group-hover:text-emerald-600 transition-colors" />
                                Buat Laporan Baru
                            </button>
                        </Link>
                        
                        {user ? (
                            <Link to="/riwayat">
                                <button className="w-full sm:w-auto px-8 py-4 bg-emerald-900/40 text-white font-semibold rounded-xl border border-white/20 hover:bg-emerald-900/60 backdrop-blur-sm transition-all flex items-center justify-center">
                                    Cek Laporan Saya <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            </Link>
                        ) : (
                            <a href="#cara-kerja" className="w-full sm:w-auto px-8 py-4 text-emerald-100 font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center">
                                Pelajari Caranya ↓
                            </a>
                        )}
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transparansi Data</h2>
                    <p className="text-gray-500 dark:text-slate-400">Pantau kinerja penanganan laporan secara real-time</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                <Activity className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">Total</span>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Laporan Masuk</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">Proses</span>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{stats.inProgress}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Sedang Ditangani</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">Selesai</span>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{stats.completed}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Masalah Tuntas</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">Baru</span>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{stats.pending}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Menunggu Verifikasi</p>
                    </div>
                </div>
            </section>

            <section id="cara-kerja" className="py-12 bg-gray-50 dark:bg-slate-900/50 rounded-3xl mx-4 md:mx-0">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Alur Pengaduan</h2>
                        <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">Kami memastikan setiap laporan Anda diproses dengan prosedur yang jelas dan cepat.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-center relative">
                            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 absolute -top-6 left-1/2 -translate-x-1/2 border-4 border-gray-50 dark:border-slate-900">1</div>
                            <div className="mt-4">
                                <FileText className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Tulis Laporan</h3>
                                <p className="text-gray-600 dark:text-slate-400">Klik tombol "Buat Laporan", isi detail masalah, lokasi, dan sertakan foto bukti jika ada.</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-center relative">
                            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 absolute -top-6 left-1/2 -translate-x-1/2 border-4 border-gray-50 dark:border-slate-900">2</div>
                            <div className="mt-4">
                                <Shield className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Verifikasi & Proses</h3>
                                <p className="text-gray-600 dark:text-slate-400">Petugas desa akan memverifikasi laporan Anda dan menindaklanjuti ke unit terkait.</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-center relative">
                            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 absolute -top-6 left-1/2 -translate-x-1/2 border-4 border-gray-50 dark:border-slate-900">3</div>
                            <div className="mt-4">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Selesai</h3>
                                <p className="text-gray-600 dark:text-slate-400">Laporan ditangani hingga tuntas. Anda bisa memantau progressnya secara real-time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-900 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden mx-4 md:mx-0 shadow-2xl">
                 <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                 <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Siap Membangun Desa?</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
                        Jangan biarkan masalah lingkungan berlarut. Laporan Anda adalah awal dari perubahan yang lebih baik.
                    </p>
                    <Link to="/lapor">
                        <button className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1">
                            Laporkan Masalah Sekarang
                        </button>
                    </Link>
                 </div>
            </section>
        </div>
    );
}