import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Lock, User, Mail, ShieldAlert, Loader2, Phone, KeyRound, 
    AlertCircle, CheckCircle2, Sun, Moon, ArrowLeft 
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    const [formData, setFormData] = useState({
        full_name: '', email: '', password: '', confirmPassword: '', no_hp: '', secret_code: ''
    });

    const KODE_PETUGAS = 'PSIGAP2025';
    const KODE_BENDAHARA = 'BSIGAP2025';
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };
    const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        if (formData.password !== formData.confirmPassword) throw new Error('Konfirmasi kata sandi tidak cocok!');
        let roleFinal = '';

        if (formData.secret_code === KODE_PETUGAS) {
            roleFinal = 'petugas';
        } else if (formData.secret_code === KODE_BENDAHARA) {
            roleFinal = 'bendahara';
        } else {
            throw new Error('Kode Registrasi Desa salah atau tidak terdaftar!');
        }

        const { data: existingUser } = await supabase.from('users').select('email').eq('email', formData.email).single();
        if (existingUser) throw new Error('Email ini sudah terdaftar.');

        const { error: insertError } = await supabase.from('users').insert([{
            full_name: formData.full_name, 
            email: formData.email, 
            password: formData.password, 
            role: roleFinal,
            no_hp: formData.no_hp, 
            nik: '-'
        }]);

        if (insertError) throw insertError;
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 p-4 transition-colors duration-300">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border border-gray-100 dark:border-slate-700 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pendaftaran Berhasil!</h2>
                    <p className="text-gray-600 dark:text-slate-400 mb-8 text-lg">Akun petugas Anda telah dibuat. Silakan login untuk melanjutkan.</p>
                    <div className="flex justify-center">
                        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mr-2" />
                        <span className="text-emerald-600 font-medium">Mengalihkan ke halaman login...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/balaidesa.jpg" 
                        alt="Background" 
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-slate-900/90"></div>
                </div>
                
                <div className="relative z-10 text-center px-10">
                    <img 
                        src="/Brebes.svg" 
                        alt="Logo Brebes" 
                        className="w-32 h-32 object-contain mx-auto mb-8 animate-in zoom-in duration-500 drop-shadow-2xl" 
                    />
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tight">SIGAP</h1>
                    <p className="text-emerald-200 text-xl font-medium tracking-wide uppercase">Sistem Informasi Gangguan & <br/> Anggaran Pembangunan</p>
                    <div className="mt-12 w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto relative">
                <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className="absolute top-6 right-6 p-3 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 hover:scale-110 transition-all z-20"
                    title="Ganti Tema"
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="w-full max-w-lg space-y-8 animate-in slide-in-from-right duration-500 py-10">
                    <div className="lg:hidden text-center mb-8">
                        <img src="/Brebes.svg" alt="Logo Brebes" className="w-20 h-20 object-contain mx-auto mb-4 drop-shadow-lg" />
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">SIGAP</h2>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Daftar Petugas</h2>
                        <p className="text-gray-500 dark:text-slate-400 mt-2">Bergabung dengan tim pelayanan Desa.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 border border-red-200 dark:border-red-800 text-sm animate-pulse">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input 
                                    name="full_name" required 
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" 
                                    placeholder="Nama Sesuai KTP" 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Grid: Email & HP */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input 
                                        type="email" name="email" required 
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                                        placeholder="Masukkan email Anda" 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">No. HP</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input 
                                        name="no_hp" required 
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                                        placeholder="08xxx" 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Grid: Password & Confirm */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Kata Sandi</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input 
                                        type="password" name="password" required 
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                                        placeholder="******" 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Ulangi Sandi</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input 
                                        type="password" name="confirmPassword" required 
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                                        placeholder="******" 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Kode Rahasia */}
                        <div>
                            <label className="flex items-center text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                                <KeyRound className="w-4 h-4 mr-1" /> Kode Registrasi Desa
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <ShieldAlert className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                                </div>
                                <input 
                                    name="secret_code" required 
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-emerald-100 dark:border-emerald-900 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/20 text-gray-900 dark:text-white placeholder-emerald-400/70 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                                    placeholder="Masukkan Kode Rahasia" 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 duration-200 mt-6"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftar Sekarang"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                            Sudah punya akun? <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Login di sini</Link>
                        </p>
                        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}