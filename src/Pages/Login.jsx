import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, LogIn, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';

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
            if (data.role === 'warga') throw new Error('Warga tidak perlu login. Silakan buat pengaduan di halaman depan.');
            localStorage.setItem('user_session', JSON.stringify(data));
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                
                <div className="bg-emerald-600 dark:bg-emerald-700 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <ShieldCheck className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Portal Internal</h2>
                    <p className="text-emerald-100 text-sm font-medium"> Login Petugas </p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg flex items-start gap-2 border border-red-200 dark:border-red-800">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 ml-1">Email </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                                <input 
                                    type="email" name="email" required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="nama@cipelem.desa.id"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 ml-1">Kata Sandi</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                                <input 
                                    type={showPassword ? "text" : "password"} name="password" required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-emerald-600">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center disabled:opacity-70">
                            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <LogIn className="w-5 h-5 mr-2" />}
                            {loading ? 'Memverifikasi...' : 'Masuk Dashboard'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/" className="text-sm text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline">
                            ← Kembali ke Halaman Utama
                        </a>
                        <p className="text-sm text-gray-600 dark:text-slate-400 pt-4 border-t border-gray-100 dark:border-slate-700 mt-4">
                            Petugas baru? <a href="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Daftar Akun</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}