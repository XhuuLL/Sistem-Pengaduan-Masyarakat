import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
    User, Mail, Phone, MapPin, Loader2, AlertCircle, Camera, LogOut, 
    ChevronRight as BreadcrumbIcon, Upload, X, Save
} from 'lucide-react';

export default function Profile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false); 
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '', no_hp: '', nik: '', alamat: '', avatar_url: null
    });

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const sessionUser = JSON.parse(localStorage.getItem('user_session'));
                if (!sessionUser || !sessionUser.id) {
                    navigate('/login');
                    return;
                }
                setUserId(sessionUser.id);

                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', sessionUser.id)
                    .single();

                if (error) throw error;
                
                setUser(data);
                setFormData({
                    full_name: data.full_name || '',
                    no_hp: data.no_hp || '',
                    nik: data.nik || '',
                    alamat: data.alamat || '',
                    avatar_url: data.avatar_url
                });

            } catch (err) {
                console.error("Error:", err);
                setError("Gagal memuat data profil.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);
    const handleImageUpload = async (event) => {
        try {
            setUploadingImage(true);
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;
            setFormData({ ...formData, avatar_url: publicUrl });

                } catch (error) {
                    alert('Gagal upload gambar: ' + error.message);
                } finally {
                    setUploadingImage(false);
                }
            };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setUpdating(true);

        try {
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    full_name: formData.full_name,
                    no_hp: formData.no_hp,
                    alamat: formData.alamat,
                    avatar_url: formData.avatar_url 
                })
                .eq('id', userId);

            if (updateError) throw updateError;

            const updatedUser = { ...user, ...formData };
            setUser(updatedUser);
            localStorage.setItem('user_session', JSON.stringify(updatedUser));
            
            setSuccess('Profil berhasil diperbarui!');
            window.dispatchEvent(new Event('userSessionUpdated')); 
            
            setTimeout(() => {
                setSuccess('');
                setEditMode(false);
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleLogout = () => {
        if(window.confirm("Apakah Anda yakin ingin keluar?")) {
            localStorage.removeItem('user_session');
            navigate('/login');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;
    if (editMode) {
        return (
            <div className="space-y-6 pb-20 animate-in fade-in duration-300">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400 mb-4">
                    <button onClick={() => setEditMode(false)} className="hover:text-emerald-500 transition-colors">Profil Saya</button>
                    <BreadcrumbIcon className="w-4 h-4 mx-2 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Edit Profil</span>
                </div>

                <div className="border-b border-gray-200 dark:border-slate-700 pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profil</h1>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-4">Foto Profil</label>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-slate-600 flex-shrink-0 bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                                    {uploadingImage ? (
                                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                                    ) : formData.avatar_url ? (
                                        <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium text-sm">
                                        <Upload className="w-4 h-4 mr-2" /> Upload Foto
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">Format: JPG, PNG. Maksimal 2MB.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
                                <input 
                                    type="text" required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    value={formData.full_name}
                                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Email (Read Only)</label>
                                <input 
                                    type="email" disabled
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-200 dark:bg-slate-900 text-gray-500 cursor-not-allowed"
                                    value={user.email}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">No. Handphone</label>
                                <input 
                                    type="text" required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    value={formData.no_hp}
                                    onChange={e => setFormData({...formData, no_hp: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">NIK / ID</label>
                                <input 
                                    type="text" disabled
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-200 dark:bg-slate-900 text-gray-500 cursor-not-allowed"
                                    value={formData.nik || '-'}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Alamat Lengkap</label>
                            <textarea 
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all"
                                value={formData.alamat}
                                onChange={e => setFormData({...formData, alamat: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                            <button 
                                type="submit" 
                                disabled={updating || uploadingImage}
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all flex items-center justify-center shadow-lg shadow-emerald-500/20 disabled:opacity-70"
                            >
                                {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2"/> Simpan Perubahan</>}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setEditMode(false)}
                                className="px-6 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-300">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profil Saya</h1>
                    <p className="text-gray-600 dark:text-slate-400 mt-1">Informasi data diri Anda.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors shadow-lg shadow-emerald-600/20">
                        Edit Profil
                    </button>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 font-medium flex items-center transition-colors">
                        <LogOut className="w-4 h-4 mr-2" /> Keluar
                    </button>
                </div>
            </div>
            
            {success && <div className="bg-emerald-100 text-emerald-700 p-4 rounded-lg flex items-center"><User className="w-5 h-5 mr-2"/> {success}</div>}
            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center"><AlertCircle className="w-5 h-5 mr-2"/>{error}</div>}

            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-100 dark:border-emerald-900 bg-gray-100 dark:bg-slate-700 flex items-center justify-center shadow-inner">
                        {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.full_name}</h2>
                        <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full">
                            {user.role}
                        </span>
                        {user.nik && user.nik !== '-' && <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm font-mono">ID: {user.nik}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl"><MapPin className="w-6 h-6" /></div>
                        <div><h3 className="font-bold text-gray-900 dark:text-white mb-1">Alamat</h3><p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{user.alamat || '-'}</p></div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl"><Phone className="w-6 h-6" /></div>
                        <div><h3 className="font-bold text-gray-900 dark:text-white mb-1">Telepon</h3><p className="text-gray-600 dark:text-slate-400 text-sm">{user.no_hp || '-'}</p></div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl"><Mail className="w-6 h-6" /></div>
                        <div><h3 className="font-bold text-gray-900 dark:text-white mb-1">Email</h3><p className="text-gray-600 dark:text-slate-400 text-sm break-all">{user.email}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}