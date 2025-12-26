import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Upload, FileText, CheckCircle2, Loader2, X, User, 
    ChevronRight as BreadcrumbIcon, MapPin, Send 
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import LocationPicker from '../Components/LocationPicker';

export default function ComplaintForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [photoFile, setPhotoFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '', 
        description: '', 
        category_id: '', 
        location: '', 
        latitude: null,
        longitude: null,
        photo_preview: '', 
        reporter_name: '', 
        reporter_contact: '', 
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

    const handleLocationSelect = (coords) => {
        setFormData(prev => ({
            ...prev,
            latitude: coords.lat,
            longitude: coords.lng
        }));
        if (errors.map) setErrors(prev => ({ ...prev, map: '' }));
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
        if (!formData.location) newErrors.location = 'Nama lokasi wajib diisi';
        if (!formData.reporter_name) newErrors.reporter_name = 'Nama wajib diisi';
        if (!formData.reporter_contact) newErrors.reporter_contact = 'No HP wajib diisi';
        
        if (!formData.latitude || !formData.longitude) {
            alert("Mohon klik pada peta untuk menandai lokasi kejadian!");
            return;
        }

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
                latitude: formData.latitude,
                longitude: formData.longitude,
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
            <div className="flex items-center justify-center min-h-[60vh] px-4 animate-in fade-in duration-500">
                <div className="bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-12 text-center shadow-xl max-w-lg w-full">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Laporan Terkirim!</h2>
                    <p className="text-gray-600 dark:text-slate-300 mb-8">Terima kasih atas laporan Anda. Kami akan segera memverifikasi dan menindaklanjutinya.</p>
                    <button onClick={() => navigate('/')} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30">
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-300">
            
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 dark:text-slate-400 mb-6">
                <button onClick={() => navigate('/')} className="hover:text-emerald-500 transition-colors">Beranda</button>
                <BreadcrumbIcon className="w-4 h-4 mx-2 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Buat Pengaduan</span>
            </div>

            <div className="border-b border-gray-200 dark:border-slate-700 pb-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Formulir Pengaduan</h1>
                <p className="text-gray-600 dark:text-slate-400">Silakan isi data laporan dengan lengkap dan valid.</p>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 border-l-4 border-emerald-500 pl-3">
                            Identitas Pelapor
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Nama sesuai KTP"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 dark:bg-[#1a1f2c] dark:border-slate-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${errors.reporter_name ? 'border-red-500' : 'border-gray-300'}`}
                                        value={formData.reporter_name}
                                        onChange={e => handleChange('reporter_name', e.target.value)}
                                    />
                                </div>
                                {errors.reporter_name && <p className="text-red-500 text-xs mt-1">{errors.reporter_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    No. HP / WhatsApp <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Masukkan nomor yang aktif"
                                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-[#1a1f2c] dark:border-slate-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${errors.reporter_contact ? 'border-red-500' : 'border-gray-300'}`}
                                    value={formData.reporter_contact}
                                    onChange={e => handleChange('reporter_contact', e.target.value)}
                                />
                                {errors.reporter_contact && <p className="text-red-500 text-xs mt-1">{errors.reporter_contact}</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 border-l-4 border-blue-500 pl-3">
                            Detail Masalah
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    Judul Laporan <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Masukkan judul laporan"
                                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-[#1a1f2c] dark:border-slate-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                    value={formData.title}
                                    onChange={e => handleChange('title', e.target.value)}
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                        Kategori Masalah <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-[#1a1f2c] dark:border-slate-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer appearance-none ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
                                        value={formData.category_id}
                                        onChange={e => handleChange('category_id', e.target.value)}
                                    >
                                        <option value="">-- Pilih Kategori --</option>
                                        {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                    </select>
                                    {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                        Lokasi (Patokan) <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="Masukan nama lokasi atau patokan"
                                        className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-[#1a1f2c] dark:border-slate-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                                        value={formData.location}
                                        onChange={e => handleChange('location', e.target.value)}
                                    />
                                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    Deskripsi Lengkap <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    rows={4} 
                                    placeholder="Jelaskan kronologi atau detail masalah..."
                                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-[#1a1f2c] dark:border-slate-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                    value={formData.description}
                                    onChange={e => handleChange('description', e.target.value)}
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 border-l-4 border-purple-500 pl-3">
                            Media & Lokasi
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Upload Foto */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Foto Bukti</label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors relative cursor-pointer group bg-gray-50 dark:bg-[#1a1f2c]">
                                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handlePhotoSelect} disabled={uploadingPhoto} />
                                    
                                    {uploadingPhoto ? (
                                        <div className="flex flex-col items-center py-8">
                                            <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-2" />
                                            <span className="text-sm text-gray-500 dark:text-slate-400">Sedang memproses...</span>
                                        </div>
                                    ) : formData.photo_preview ? (
                                        <div className="relative">
                                            <img src={formData.photo_preview} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
                                            <button type="button" onClick={(e) => {e.preventDefault(); setFormData(prev => ({...prev, photo_preview: ''})); setPhotoFile(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 z-10">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-8">
                                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 mb-3">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <span className="font-medium text-gray-700 dark:text-white">Klik untuk upload foto</span>
                                            <span className="text-xs text-gray-500 dark:text-slate-400 mt-1">Format JPG, PNG (Max 5MB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Peta */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                    Titik Lokasi (Klik Peta) <span className="text-red-500">*</span>
                                </label>
                                <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-slate-600 h-[250px] relative z-0">
                                    <LocationPicker onLocationSelect={handleLocationSelect} />
                                </div>
                                {formData.latitude ? (
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center font-medium">
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1"/> Koordinat terkunci: {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}
                                    </p>
                                ) : (
                                    <p className="text-xs text-red-500 mt-2 flex items-center">
                                        <MapPin className="w-3.5 h-3.5 mr-1"/> Wajib pilih titik di peta
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-slate-700">
                        <button 
                            type="submit" 
                            disabled={loading || uploadingPhoto}
                            className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center disabled:opacity-70 text-lg"
                        >
                            {loading || uploadingPhoto ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5 mr-2"/> Kirim Laporan</>}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/')}
                            className="px-8 py-3.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                        >
                            Batal
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}