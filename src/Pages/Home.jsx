import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FileText, CheckCircle2, TrendingUp, ArrowRight, 
    Shield, Activity, ChevronDown, ChevronUp, 
    Loader2, Megaphone, Wallet, Building2, Banknote, Users,
    Facebook, Instagram, Twitter, Mail, Phone, MapPin, Globe
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
            <section id="transparansi" className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 text-xs font-bold mb-6 backdrop-blur-sm">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Fitur Unggulan
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                        Teknologi Modern <br className="hidden sm:block" />
                        <span className="text-emerald-700 dark:text-slate-400">untuk Transparansi</span>
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400 max-w-2xl text-base md:text-lg leading-relaxed">
                        Sistem SIGAP dirancang khusus untuk memudahkan pemantauan anggaran desa 
                        dan penanganan gangguan secara real-time dengan teknologi terdepan.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    <div className="group flex flex-col h-full p-6 lg:p-8 rounded-[2rem] transition-all duration-500
                                    bg-white border-[3px] border-gray-100 shadow-xl shadow-gray-200/50 hover:border-emerald-500
                                    dark:bg-slate-800/40 dark:backdrop-blur-md dark:border-slate-700/50 dark:shadow-none dark:hover:border-emerald-500/50">
                        
                        <div className="w-14 h-14 bg-emerald-600 dark:bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Activity className="w-7 h-7 text-white" />
                        </div>

                        <h3 className="text-sm md:text-base font-bold text-gray-400 dark:text-slate-400 mb-2 uppercase tracking-[0.2em]">
                            Laporan Masuk
                        </h3>

                        <div className="flex items-baseline gap-2 mb-4 mt-auto">
                            <span className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
                                {stats.complaintTotal}
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-500 text-xs font-black uppercase tracking-widest">
                                Berkas
                            </span>
                        </div>

                        <p className="text-gray-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed font-medium">
                            Total aduan masyarakat yang telah masuk dan sedang dalam antrean verifikasi.
                        </p>
                    </div>

                    <div className="group flex flex-col h-full p-6 lg:p-8 rounded-[2rem] transition-all duration-500
                                    bg-white border-[3px] border-gray-100 shadow-xl shadow-gray-200/50 hover:border-emerald-500
                                    dark:bg-slate-800/40 dark:backdrop-blur-md dark:border-slate-700/50 dark:shadow-none dark:hover:border-emerald-500/50">
                        <div className="w-14 h-14 bg-emerald-600 dark:bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle2 className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-gray-400 dark:text-slate-400 mb-2 uppercase tracking-[0.2em]">Laporan Selesai</h3>
                        <div className="flex items-baseline gap-2 mb-4 mt-auto">
                            <span className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">{stats.complaintResolved}</span>
                            <span className="text-emerald-600 dark:text-emerald-500 text-xs font-black uppercase tracking-widest">Selesai</span>
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed font-medium">Masalah yang telah berhasil ditangani oleh petugas lapangan.</p>
                    </div>

                    <div className="group flex flex-col h-full p-6 lg:p-8 rounded-[2rem] transition-all duration-500
                                    bg-white border-[3px] border-gray-100 shadow-xl shadow-gray-200/50 hover:border-emerald-500
                                    dark:bg-slate-800/40 dark:backdrop-blur-md dark:border-slate-700/50 dark:shadow-none dark:hover:border-emerald-500/50">
                        <div className="w-14 h-14 bg-emerald-600 dark:bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-gray-400 dark:text-slate-400 mb-2 uppercase tracking-[0.2em]">Pemasukan Dana</h3>
                        <div className="mb-4 mt-auto">
                            <span className="text-xl xl:text-2xl font-black text-emerald-600 dark:text-emerald-500 block whitespace-nowrap">
                                {formatRupiah(stats.totalIncome)}
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed font-medium">Akumulasi dana masuk dari berbagai sumber anggaran desa.</p>
                    </div>

                    <div className="group flex flex-col h-full p-6 lg:p-8 rounded-[2rem] transition-all duration-500
                                    bg-white border-[3px] border-gray-100 shadow-xl shadow-gray-200/50 hover:border-emerald-500
                                    dark:bg-slate-800/40 dark:backdrop-blur-md dark:border-slate-700/50 dark:shadow-none dark:hover:border-emerald-500/50">
                        <div className="w-14 h-14 bg-emerald-600 dark:bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-gray-400 dark:text-slate-400 mb-2 uppercase tracking-[0.2em]">Realisasi Dana</h3>
                        <div className="mb-4 mt-auto">
                            <span className="text-xl xl:text-2xl font-black text-emerald-600 dark:text-emerald-500 block whitespace-nowrap">
                                {formatRupiah(stats.totalExpense)}
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed font-medium">Dana yang telah digunakan untuk perbaikan fasilitas umum desa.</p>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-50/50 dark:bg-slate-900/20 rounded-[3rem] mx-4 md:mx-0 border border-gray-100 dark:border-slate-800/50">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                            Alur <span className="text-emerald-600 dark:text-emerald-500">Layanan</span>
                        </h2>
                        <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            Proses yang mudah, cepat, dan transparan untuk setiap laporan warga demi kemajuan desa kita bersama.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                        <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-[70%] h-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-green-500/20 dark:from-emerald-500/10 dark:via-blue-500/10 dark:to-green-500/10 rounded-full"></div>
                        <div className="group relative flex flex-col items-center text-center h-full p-8 md:p-10 rounded-[2.5rem] transition-all duration-500 shadow-xl
                                        bg-white border-2 border-gray-100 hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2
                                        dark:bg-slate-800/40 dark:backdrop-blur-md dark:border-slate-700/50 dark:hover:bg-slate-800/60 dark:hover:border-emerald-500/50">
                            <div className="w-20 h-20 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30 text-white group-hover:scale-110 transition-transform duration-300 z-10">
                                <FileText className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">1. Tulis Laporan</h3>
                            <p className="text-gray-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                                Isi formulir pengaduan dengan detail masalah, lokasi yang akurat, dan foto bukti pendukung.
                            </p>
                        </div>

                        <div className="group relative flex flex-col items-center text-center h-full p-8 md:p-10 rounded-[2.5rem] transition-all duration-500 shadow-xl
                                        bg-white border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-2
                                        dark:bg-slate-800/40 dark:backdrop-blur-md dark:border-slate-700/50 dark:hover:bg-slate-800/60 dark:hover:border-blue-500/50">
                            <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 text-white group-hover:scale-110 transition-transform duration-300 z-10">
                                <Users className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">2. Disposisi & Proses</h3>
                            <p className="text-gray-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                                Admin memverifikasi laporan dan segera meneruskannya ke petugas lapangan untuk ditangani.
                            </p>
                        </div>

                        <div className="group relative flex flex-col items-center text-center h-full p-8 md:p-10 rounded-[2.5rem] transition-all duration-500 shadow-xl
                                        bg-white border-2 border-gray-100 hover:border-green-500 hover:shadow-2xl hover:-translate-y-2
                                        dark:bg-slate-800/40 dark:backdrop-blur-md dark:border-slate-700/50 dark:hover:bg-slate-800/60 dark:hover:border-green-500/50">
                            <div className="w-20 h-20 bg-green-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-lg shadow-green-500/30 text-white group-hover:scale-110 transition-transform duration-300 z-10">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">3. Selesai & Transparan</h3>
                            <p className="text-gray-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                                Laporan selesai ditangani. Seluruh rincian biaya perbaikan dicatat secara transparan di sistem.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <section className="max-w-[1000px] mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 text-xs font-bold mb-6 backdrop-blur-sm">
                        Bantuan & Panduan
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                        Pertanyaan <span className="text-emerald-600 dark:text-emerald-500">Umum</span>
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
                        Temukan jawaban cepat seputar penggunaan sistem SIGAP dan transparansi data desa.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div 
                            key={index} 
                            className="group overflow-hidden transition-all duration-300 rounded-[2rem] shadow-sm
                                    bg-white border-2 border-gray-100 hover:border-emerald-500/50 hover:shadow-xl
                                    dark:bg-slate-800/40 dark:backdrop-blur-md dark:border-slate-700/50 dark:hover:border-emerald-500/50"
                        >
                            <button 
                                onClick={() => toggleFaq(index)} 
                                className="w-full flex justify-between items-center p-6 md:p-8 text-left focus:outline-none transition-colors"
                            >
                                <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {item.q}
                                </span>
                                <div className={`p-2 rounded-xl transition-all duration-300 ${openFaq === index ? 'bg-emerald-600 text-white rotate-180' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
                                    <ChevronDown className="w-5 h-5" />
                                </div>
                            </button>
                            <div 
                                className={`transition-all duration-500 ease-in-out overflow-hidden ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-6 md:px-8 pb-8 pt-2 text-gray-600 dark:text-slate-400 text-sm md:text-base leading-relaxed border-t border-gray-50 dark:border-slate-700/50">
                                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/10">
                                        {item.a}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="relative overflow-hidden mx-4 md:mx-0 mt-20 group">
                <div className="max-w-[1400px] mx-auto">
                    <div className="relative rounded-[3rem] p-12 md:p-24 text-center overflow-hidden transition-all duration-500 shadow-2xl
                                    bg-gradient-to-br from-emerald-600 to-emerald-800 
                                    dark:from-slate-900 dark:to-slate-800 dark:border dark:border-slate-700">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold mb-8 backdrop-blur-md uppercase tracking-widest">
                                Aksi Nyata Warga
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                                Siap Membangun <br className="hidden sm:block" />
                                Desa Lebih <span className="text-emerald-200">Maju?</span>
                            </h2>

                            <p className="text-emerald-50 dark:text-slate-400 mb-12 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-medium">
                                Jangan biarkan masalah lingkungan berlarut. Partisipasi aktif Anda melalui Sistem Informasi Gangguan & Anggaran Perbaikan adalah kunci perubahan desa yang lebih transparan dan akuntabel.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link to="/lapor" className="w-full sm:w-auto">
                                    <button className="group/btn relative w-full sm:w-auto px-12 py-5 bg-white text-emerald-700 font-black rounded-2xl shadow-xl hover:shadow-white/20 transition-all hover:-translate-y-1 text-lg flex items-center justify-center gap-3">
                                        <FileText className="w-6 h-6 transition-transform group-hover/btn:scale-110" />
                                        Laporkan Sekarang
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
                    </div>
                </div>
            </section>

<footer className="relative mt-20 overflow-hidden bg-white dark:bg-slate-950 border-t-4 border-emerald-600 dark:border-slate-800 rounded-none shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.05)] transition-colors duration-300">
    <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-sm">
                        <img 
                            src="/Brebes.svg"  
                            alt="Logo Brebes"
                            className="w-12 h-12 object-contain" 
                        />
                    </div>
                    <div>
                        <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter block leading-none">
                            SIGAP
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em]">
                            Sistem Informasi Gangguan & Anggaran Perbaikan
                        </span>
                    </div>
                </div>
                
                <p className="text-gray-600 dark:text-slate-400 max-w-md text-lg leading-relaxed font-medium">
                    Platform terintegrasi untuk pelaporan gangguan lingkungan dan transparansi anggaran desa demi terwujudnya tata kelola desa yang akuntabel.
                </p>
                <div className="flex gap-4">
                    {[
                        { icon: Facebook, link: "https://www.facebook.com/share/1CxjXGgtwK/" },
                        { icon: Instagram, link: "https://www.instagram.com/fatkhul.png?igsh=MTlxamRuNWM3MXF0Mw==" },
                        { icon: Twitter, link: "https://x.com/MasFatkhul?s=09" },
                        { icon: Globe, link: "https://my-portofolio-xhuull.vercel.app/" }
                    ].map((social, i) => (
                        <a 
                            key={i}
                            href={social.link} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 group shadow-sm hover:shadow-emerald-500/20 hover:-translate-y-1"
                        >
                            <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-gray-900 dark:text-white font-black mb-8 text-xl uppercase tracking-widest">Tautan Cepat</h3>
                <ul className="space-y-4">
                    {[
                        { name: "Transparansi", path: "#transparansi" },
                        { name: "Alur Layanan", path: "#prosedur" },
                        { name: "Buat Laporan", path: "/lapor" },
                        { name: "Pusat Bantuan", path: "#" }
                    ].map((link, i) => (
                        <li key={i}>
                            <a href={link.path} className="text-gray-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 font-bold transition-all flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-gray-900 dark:text-white font-black mb-8 text-xl uppercase tracking-widest">Kontak Kami</h3>
                <ul className="space-y-6">
                    <li className="flex items-start gap-4 group cursor-pointer">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-sm">
                            <Mail className="w-5 h-5" />
                        </div>
                        <span className="text-gray-600 dark:text-slate-400 font-bold text-sm leading-tight break-all">fatkhuldisini@gmail.com</span>
                    </li>
                    <li className="flex items-start gap-4 group cursor-pointer">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-sm">
                            <Phone className="w-5 h-5" />
                        </div>
                        <span className="text-gray-600 dark:text-slate-400 font-bold text-sm">+62 831 8221 0690</span>
                    </li>
                    <li className="flex items-start gap-4 group cursor-pointer">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform shadow-sm">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <span className="text-gray-600 dark:text-slate-400 font-bold text-sm leading-relaxed">
                            Desa Cipelem Kec. Bulakamba, Brebes, Jawa Tengah
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div className="pt-8 border-t border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 dark:text-slate-500 text-sm font-bold text-center md:text-left">
                © 2025 SIGAP By 
                <a 
                    href="https://github.com/XhuuLL" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-600 hover:text-emerald-500 hover:underline transition-all ml-1"
                >
                    Akhmad Fatkhul Arifin
                </a>. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-bold text-gray-400 dark:text-slate-600">
                <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
            </div>
        </div>
    </div>
</footer>
        </div>
    );
}