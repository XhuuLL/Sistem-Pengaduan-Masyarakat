import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, LogIn, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

        const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.from('users').select('*').eq('email', formData.email).eq('password', formData.password).single();
            
            if (error || !data) throw new Error('Email atau kata sandi salah!');

            localStorage.setItem('user_session', JSON.stringify(data));
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                    <p className="text-emerald-200 text-xl font-medium tracking-wide uppercase">Sistem Informasi Gangguan & <br/> Anggaran Perbaikan</p>
                    <div className="mt-12 w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 animate-in slide-in-from-right duration-500">
                <div className="w-full max-w-md space-y-8">
                    <div className="lg:hidden text-center mb-8">
                        <img 
                            src="/Brebes.svg" 
                            alt="Logo Brebes" 
                            className="w-24 h-24 object-contain mx-auto mb-4 drop-shadow-lg" 
                        />
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">SIGAP</h2>
                    </div>

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Selamat Datang</h2>
                        <p className="text-gray-500 dark:text-slate-400 mt-2">Silakan masuk untuk layanan SIGAP.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        
                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 border border-red-200 dark:border-red-800 text-sm animate-pulse">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input 
                                        type="email" name="email" required
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Masukkan email Anda"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Kata Sandi</label>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input 
                                        type={showPassword ? "text" : "password"} name="password" required
                                        className="w-full pl-12 pr-12 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 duration-200"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center">Masuk <LogIn className="ml-2 w-5 h-5"/></span>}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center space-y-4">
                        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Beranda
                        </Link>
                        
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            Belum Punya Akun? <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Daftar Akun di sini</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}