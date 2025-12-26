import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FileText, CheckCircle2, TrendingUp, ArrowRight, 
    Shield, Activity, ChevronDown, ChevronUp, 
    Loader2, Megaphone, Wallet, Building2, Banknote, Users,
    Facebook, Instagram, Twitter, Mail, Phone, MapPin
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);
    const [stats, setStats] = useState({
        complaintTotal: 0,
        complaintResolved: 0,
        totalIncome: 0,
        totalExpense: 0
    });

    useEffect(() => {
        const savedUser = localStorage.getItem('user_session');
        if (savedUser) setUser(JSON.parse(savedUser));
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            setLoading(true);
            const { data: complaints } = await supabase.from('complaints').select('status');
            const { data: finance } = await supabase.from('finance_logs').select('amount, type');

            if (complaints && finance) {
                const totalC = complaints.length;
                const resolvedC = complaints.filter(c => c.status === 'completed').length;
                let inc = 0;
                let exp = 0;
                finance.forEach(item => {
                    if (item.type === 'income') inc += item.amount;
                    else exp += item.amount;
                });

                setStats({
                    complaintTotal: totalC,
                    complaintResolved: resolvedC,
                    totalIncome: inc,
                    totalExpense: exp
                });
            }
        } catch (error) {
            console.error("Gagal memuat data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (num) => {
        return "Rp " + (num || 0).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqData = [
        { q: "Apakah data keuangan ini transparan?", a: "Ya, sistem SIGAP menampilkan rekapitulasi Pemasukan dan Pengeluaran desa secara real-time agar warga bisa ikut mengawasi." },
        { q: "Apakah identitas pelapor aman?", a: "Tentu! Anda bisa memilih opsi 'Lapor sebagai Anonim' agar nama Anda tidak ditampilkan ke publik." },
        { q: "Jenis laporan apa yang diterima?", a: "Kami menerima laporan terkait infrastruktur (jalan rusak, lampu mati), pelayanan publik, dan keamanan lingkungan." },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                    <p className="text-gray-500 text-sm animate-pulse">Memuat data SIGAP...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-16 animate-in fade-in duration-700 bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
            <div className="bg-emerald-600 text-white py-2.5 overflow-hidden relative z-20 shadow-md">
                <div className="flex items-center animate-marquee whitespace-nowrap">
                    <span className="flex items-center mx-8 text-sm font-medium">
                        <Megaphone className="w-4 h-4 mr-2" /> 
                        Selamat Datang di SIGAP - Sistem Informasi Gangguan & Anggaran Perbaikan Desa.
                    </span>
                    <span className="flex items-center mx-8 text-sm font-medium">
                        <Wallet className="w-4 h-4 mr-2" /> 
                        Pantau terus transparansi penggunaan Dana Desa secara real-time di sini.
                    </span>
                    <span className="flex items-center mx-8 text-sm font-medium">
                        <Shield className="w-4 h-4 mr-2" /> 
                        Layanan pengaduan masyarakat aktif 24 Jam Dalam Sehari. Identitas pelapor insyaallah aman.
                    </span>
                </div>
            </div>

            <section className="relative overflow-hidden rounded-3xl mx-4 md:mx-0 min-h-[500px] flex items-center shadow-2xl group">
                <div className="absolute inset-0 w-full h-full">
                    <img 
                        src="/balaidesa.jpg" 
                        alt="Desa Digital" 
                        className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-5xl px-8 md:px-16 w-full">
                    <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wider mb-6 backdrop-blur-md uppercase">
                        <Building2 className="w-3 h-3"/> Desa Digital Terpadu
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl">
                        SIGAP
                    </h1>
                    <h2 className="text-xl md:text-3xl font-bold text-emerald-400 mb-8 uppercase leading-tight tracking-wide">
                        Sistem Informasi Gangguan & <br className="hidden md:block" />
                        Anggaran Perbaikan hehe
                    </h2>

                    <p className="text-lg text-slate-300 mb-10 max-w-2xl leading-relaxed border-l-4 border-emerald-500 pl-6">
                        Satu pintu untuk kemajuan desa. Laporkan masalah lingkungan Anda dan pantau penggunaan anggaran desa secara transparan, akuntabel, dan terpercaya.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/lapor">
                            <button className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 hover:-translate-y-1 transition-all flex items-center justify-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Buat Laporan
                            </button>
                        </Link>
                        
                        {user ? (
                            <Link to="/riwayat">
                                <button className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/20 backdrop-blur-sm transition-all flex items-center justify-center">
                                    Lihat Riwayat Saya <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            </Link>
                        ) : (
                            <a href="#transparansi" className="w-full sm:w-auto px-8 py-4 text-slate-300 font-semibold rounded-xl hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-slate-500">
                                Lihat Detail ↓
                            </a>
                        )}
                    </div>
                </div>
            </section>
            <section id="transparansi" className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Transparansi Publik</h2>
                    <p className="text-gray-500 dark:text-slate-400">Data kinerja penanganan masalah dan arus kas keuangan desa.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card Statistik */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:border-blue-500 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                <Activity className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">Laporan</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.complaintTotal}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Total Aduan Masuk</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:border-green-500 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">Kinerja</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.complaintResolved}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Masalah Diselesaikan</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:border-emerald-500 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <Banknote className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">Kas Masuk</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate" title={formatRupiah(stats.totalIncome)}>
                            {formatRupiah(stats.totalIncome)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Total Pendapatan Desa</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:border-red-500 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md">Realisasi</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate" title={formatRupiah(stats.totalExpense)}>
                            {formatRupiah(stats.totalExpense)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Anggaran Digunakan</p>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white dark:bg-slate-900/50 rounded-3xl mx-4 md:mx-0 border border-gray-100 dark:border-slate-800">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Alur Layanan</h2>
                        <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Proses yang mudah, cepat, dan transparan untuk setiap laporan warga.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 dark:from-slate-700 dark:via-emerald-900 dark:to-slate-700 -z-0"></div>

                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-center relative z-10 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30 text-white">
                                <FileText className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Tulis Laporan</h3>
                            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
                                Isi formulir pengaduan dengan detail masalah, lokasi, dan foto bukti pendukung.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-center relative z-10 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 text-white">
                                <Users className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Disposisi & Proses</h3>
                            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
                                Admin memverifikasi dan meneruskan laporan ke petugas terkait untuk ditangani segera.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-center relative z-10 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 text-white">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Selesai & Transparan</h3>
                            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
                                Laporan selesai. Biaya perbaikan akan dicatat di menu keuangan demi transparansi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pertanyaan Umum</h2>
                </div>
                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden transition-all hover:shadow-md">
                            <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center p-5 text-left font-semibold text-gray-900 dark:text-white focus:outline-none hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                {item.q}
                                {openFaq === index ? <ChevronUp className="w-5 h-5 text-emerald-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </button>
                            {openFaq === index && (
                                <div className="px-5 pb-5 text-gray-600 dark:text-slate-400 text-sm leading-relaxed border-t border-gray-100 dark:border-slate-700 pt-4 bg-gray-50 dark:bg-slate-900/30">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden mx-4 md:mx-0 shadow-2xl mt-12 border border-slate-700">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Siap Membangun Desa?</h2>
                    <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg">
                        Jangan biarkan masalah lingkungan berlarut. Partisipasi aktif Anda adalah kunci perubahan desa yang lebih baik dan transparan.
                    </p>
                    <Link to="/lapor">
                        <button className="px-12 py-5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 text-lg">
                            Laporkan Masalah Sekarang hehe
                        </button>
                    </Link>
                </div>
            </section>

            <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-12 mt-20 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center gap-3">
                                <img 
                                    src="/Brebes.svg"  
                                    alt="Logo"
                                    className="w-12 h-12 object-contain" 
                                />
                                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    Sistem Informasi Gangguan & Anggaran Perbaikan Desa
                                </span>
                            </div>
                            
                            <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                                Sistem terpadu untuk pelaporan masalah lingkungan dan transparansi anggaran desa. Memudahkan warga berpartisipasi aktif dalam pembangunan desa yang lebih baik.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://www.facebook.com/share/1CxjXGgtwK/" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 group">
                                    <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                                <a href="https://www.instagram.com/fatkhul.png?igsh=MTlxamRuNWM3MXF0Mw==" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 group">
                                    <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                                <a href="https://x.com/MasFatkhul?s=09" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 group">
                                    <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-bold mb-6 text-lg">Tautan Cepat</h3>
                            <ul className="space-y-4">
                                <li><a href="#transparansi" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Transparansi</a></li>
                                <li><Link to="/login" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Masuk</Link></li>
                                <li><Link to="/register" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Daftar</Link></li>
                                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Bantuan</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-bold mb-6 text-lg">Kontak</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400 group">
                                    <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">fatkhuldisini@gmail.com</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400 group">
                                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">+62 831 8221 0690</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400 group">
                                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        Desa Cipelem Kecamatan Bulakamba, Brebes, Jawa Tengah
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}