import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Upload, FileText, CheckCircle2, Loader2, X, User, Phone } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function ComplaintForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [photoFile, setPhotoFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '', description: '', category_id: '', location: '', photo_preview: '', reporter_name: '', reporter_contact: '', 
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*');
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handlePhotoSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { alert("Ukuran foto terlalu besar (Maks 5MB)"); return; }
        setUploadingPhoto(true);
        setPhotoFile(file);
        setTimeout(() => {
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, photo_preview: previewUrl }));
            setUploadingPhoto(false);
        }, 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Judul wajib diisi';
        if (!formData.description) newErrors.description = 'Deskripsi wajib diisi';
        if (!formData.category_id) newErrors.category_id = 'Pilih kategori';
        if (!formData.location) newErrors.location = 'Lokasi wajib diisi';
        if (!formData.reporter_name) newErrors.reporter_name = 'Nama wajib diisi';
        if (!formData.reporter_contact) newErrors.reporter_contact = 'No HP wajib diisi';

        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setLoading(true);

        try {
            let finalPhotoUrl = null;
            if (photoFile) {
                const fileExt = photoFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('complaint-photos').upload(fileName, photoFile);
                if (uploadError) throw uploadError;
                const { data: urlData } = supabase.storage.from('complaint-photos').getPublicUrl(fileName);
                finalPhotoUrl = urlData.publicUrl;
            }

            const { error } = await supabase.from('complaints').insert([{
                ticket_id: `CPLM-${Date.now().toString().slice(-6)}`,
                title: formData.title,
                description: formData.description,
                category_id: parseInt(formData.category_id),
                location: formData.location,
                photo_url: finalPhotoUrl,
                is_anonymous: false,
                reporter_name: formData.reporter_name,
                reporter_contact: formData.reporter_contact,
                status: 'pending',
                priority: 'medium'
            }]);

            if (error) throw error;
            setSuccess(true);
            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
            alert('Gagal kirim: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto pt-10 px-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Laporan Terkirim!</h2>
                    <p className="text-gray-600 dark:text-slate-300 mb-6">Data Anda sudah tersimpan aman di server.</p>
                    <button onClick={() => navigate('/')} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Kembali ke Beranda</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Formulir Pengaduan</h1>
                <p className="text-gray-600 dark:text-slate-400">Isi data dengan lengkap dan sertakan foto bukti kejadian.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg overflow-hidden transition-colors">
                <div className="p-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Identitas */}
                        <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-xl border border-gray-100 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center">
                                <User className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400"/> Identitas Pelapor
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                                    <input className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white ${errors.reporter_name ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`}
                                        value={formData.reporter_name} onChange={e => handleChange('reporter_name', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">No. HP / WA</label>
                                    <input className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white ${errors.reporter_contact ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`}
                                        value={formData.reporter_contact} onChange={e => handleChange('reporter_contact', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Detail */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400"/> Detail Masalah
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Judul Laporan</label>
                                    <input className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`}
                                        value={formData.title} onChange={e => handleChange('title', e.target.value)} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Kategori</label>
                                        <select className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white ${errors.category_id ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`}
                                            value={formData.category_id} onChange={e => handleChange('category_id', e.target.value)}>
                                            <option value="">Pilih Kategori...</option>
                                            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Lokasi Kejadian</label>
                                        <input className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white ${errors.location ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`}
                                            value={formData.location} onChange={e => handleChange('location', e.target.value)} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Deskripsi Lengkap</label>
                                    <textarea rows={5} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}`}
                                        value={formData.description} onChange={e => handleChange('description', e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Bukti Foto (Wajib/Opsional)</label>
                                    {formData.photo_preview ? (
                                        <div className="relative w-fit"><img src={formData.photo_preview} alt="Preview" className="h-48 rounded-lg border border-gray-300 dark:border-slate-600 shadow-sm object-cover" /><button type="button" onClick={() => {setFormData(prev => ({...prev, photo_preview: ''})); setPhotoFile(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"><X className="w-4 h-4" /></button></div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors relative cursor-pointer group">
                                            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handlePhotoSelect} disabled={uploadingPhoto} />
                                            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                                {uploadingPhoto ? (<><Loader2 className="w-8 h-8 animate-spin mb-2 text-emerald-500" /><span>Memproses Foto...</span></>) : (<><Upload className="w-10 h-10 mb-2" /><span className="text-sm font-medium">Klik untuk upload foto</span><span className="text-xs mt-1">Format JPG, PNG (Maks. 5MB)</span></>)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                            <button type="submit" disabled={loading || uploadingPhoto} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-70 shadow-lg shadow-emerald-500/20 text-lg">
                                {loading || uploadingPhoto ? (<><Loader2 className="w-6 h-6 mr-3 animate-spin" /> Mohon Tunggu...</>) : (<><FileText className="w-6 h-6 mr-3" /> Kirim Laporan Sekarang</>)}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}