import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, Mail, ShieldAlert, Loader2, Phone, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        full_name: '', email: '', password: '', confirmPassword: '', no_hp: '', secret_code: ''
    });

    const KODE_RAHASIA = 'CIPELEM2025';

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
            if (formData.password.length < 6) throw new Error('Kata sandi minimal 6 karakter.');
            if (formData.secret_code !== KODE_RAHASIA) throw new Error('Kode Rahasia Desa salah! Hubungi Admin Desa.');

            const { data: existingUser } = await supabase.from('users').select('email').eq('email', formData.email).single();
            if (existingUser) throw new Error('Email ini sudah terdaftar.');

            const { error: insertError } = await supabase.from('users').insert([{
                full_name: formData.full_name, email: formData.email, password: formData.password, role: 'petugas', no_hp: formData.no_hp, nik: '-'
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
            <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-slate-900 p-4">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-emerald-100 dark:border-slate-700">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pendaftaran Berhasil!</h2>
                    <p className="text-gray-600 dark:text-slate-400 mb-6">Akun petugas Anda telah dibuat. Silakan login untuk melanjutkan.</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 animate-pulse">Mengalihkan ke halaman login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4 py-10 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                
                <div className="bg-emerald-600 dark:bg-emerald-700 p-6 text-center">
                    <h2 className="text-2xl font-bold text-white">Daftar Petugas Baru</h2>
                    <p className="text-emerald-100 text-sm">Bergabung dengan tim pelayanan Desa</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg flex items-start gap-2 border border-red-200 dark:border-red-800">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> <span>{error}</span>
                            </div>
                        )}

                        {/* Input Groups */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                                <input name="full_name" required className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Nama Petugas" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                                    <input type="email" name="email" required className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="email@desa.id" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">No. HP</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                                    <input name="no_hp" required className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="08xxx" onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Kata Sandi</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                                    <input type="password" name="password" required className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="******" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Ulangi Sandi</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                                    <input type="password" name="confirmPassword" required className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="******" onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 pt-2">
                            <label className="text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1"><KeyRound className="w-4 h-4" /> Kode Registrasi Desa</label>
                            <div className="relative">
                                <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                                <input name="secret_code" required className="w-full pl-10 pr-4 py-2 border-2 border-emerald-100 dark:border-emerald-900 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50/50 dark:bg-emerald-900/20 placeholder-emerald-300 dark:placeholder-emerald-700 text-gray-900 dark:text-white" placeholder="Kode Rahasia" onChange={handleChange} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center disabled:opacity-70 mt-4">
                            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Daftar Sekarang"}
                        </button>
                    </form>

                    <div className="mt-6 text-center pt-4 border-t border-gray-100 dark:border-slate-700">
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                            Sudah punya akun? <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Login di sini</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}