import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Loader2, Shield, CheckCircle2, Edit3, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [formData, setFormData] = useState({
        id: '', full_name: '', email: '', nik: '', no_hp: '', alamat: '', role: ''
    });

    useEffect(() => { fetchUserProfile(); }, []);

    const fetchUserProfile = async () => {
        try {
            const session = JSON.parse(localStorage.getItem('user_session'));
            if (!session) return;

            const { data, error } = await supabase.from('users').select('*').eq('id', session.id).single();
            if (error) throw error;

            if (data) {
                setFormData(data);
                setOriginalData(data);
            }
        } catch (error) {
            console.error("Gagal ambil profil:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(originalData); 
        setIsEditing(false); 
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    full_name: formData.full_name,
                    no_hp: formData.no_hp,
                    alamat: formData.alamat
                })
                .eq('id', formData.id);

            if (error) throw error;
            const currentSession = JSON.parse(localStorage.getItem('user_session'));
            const updatedSession = { ...currentSession, ...formData };
            localStorage.setItem('user_session', JSON.stringify(updatedSession));
            setOriginalData(formData);

            setSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSuccess(false), 3000);

        } catch (error) {
            alert("Gagal menyimpan: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profil Saya</h1>
                <p className="text-gray-600 dark:text-slate-400 mt-1">Kelola informasi pribadi dan kontak Anda</p>
            </div>

            {success && (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 p-4 rounded-xl flex items-center animate-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Data profil berhasil diperbarui!
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                
                {/* HEADER PROFIL */}
                <div className="p-8 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                            {formData.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.full_name}</h2>
                            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-500 dark:text-slate-400 text-sm">
                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-medium capitalize border border-blue-200 dark:border-blue-800">
                                    {formData.role}
                                </span>
                            </div>
                        </div>
                    </div>
                    {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-200 font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
                        >
                            <Edit3 className="w-4 h-4" /> Edit Profil
                        </button>
                    ) : (
                        <button 
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 font-medium hover:bg-red-100 transition-colors"
                        >
                            <X className="w-4 h-4" /> Batal
                        </button>
                    )}
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2"><User className="w-4 h-4" /> Nama Lengkap</label>
                            <input 
                                type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                                // Logika Disabled
                                disabled={!isEditing}
                                className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${isEditing ? 'bg-white dark:bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-gray-100 dark:bg-slate-700 border-transparent cursor-not-allowed text-gray-500 dark:text-slate-400'}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2"><Shield className="w-4 h-4" /> NIK</label>
                            <input type="text" value={formData.nik || '-'} disabled className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-500 cursor-not-allowed" title="Tidak dapat diubah"/>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</label>
                        <input type="email" value={formData.email} disabled className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-500 cursor-not-allowed" title="Tidak dapat diubah" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2"><Phone className="w-4 h-4" /> Nomor HP / WhatsApp</label>
                        <input 
                            type="tel" value={formData.no_hp || ''} onChange={(e) => setFormData({...formData, no_hp: e.target.value})} 
                            disabled={!isEditing}
                            className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${isEditing ? 'bg-white dark:bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-gray-100 dark:bg-slate-700 border-transparent cursor-not-allowed text-gray-500 dark:text-slate-400'}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2"><MapPin className="w-4 h-4" /> Alamat Lengkap</label>
                        <textarea 
                            rows={3} value={formData.alamat || ''} onChange={(e) => setFormData({...formData, alamat: e.target.value})} 
                            disabled={!isEditing}
                            className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all resize-none ${isEditing ? 'bg-white dark:bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-gray-100 dark:bg-slate-700 border-transparent cursor-not-allowed text-gray-500 dark:text-slate-400'}`}
                        />
                    </div>

                    {isEditing && (
                        <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end animate-in slide-in-from-bottom-2">
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl flex items-center font-bold transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
                            >
                                {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                                Simpan Perubahan
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}