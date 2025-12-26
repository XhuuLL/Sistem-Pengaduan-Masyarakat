import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, MapPin, Calendar, User, FileText, Phone, Tag,
    Wallet, Save, CheckCircle2, Clock, AlertCircle, Image as ImageIcon, Loader2
} from 'lucide-react';
import CommentSection from '../Components/CommentSection'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { supabase } from '../supabaseClient';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function ComplaintDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [responses, setResponses] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState('');
    const [cost, setCost] = useState('');
    const [savingCost, setSavingCost] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem('user_session');
        if (session) {
            const user = JSON.parse(session);
            setCurrentUserRole(user.role);
        }
        const fetchData = async () => {
            try {
                setLoading(true);

                const { data: reportData, error: reportError } = await supabase
                    .from('complaints')
                    .select('*, categories(name)')
                    .eq('id', id)
                    .single();
                
                if (reportError) throw reportError;
                setComplaint(reportData);
                if (reportData.cost_amount) setCost(reportData.cost_amount);
                setResponses([]); 

            } catch (error) {
                console.error("Error:", error);
                alert("Gagal memuat data.");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleSaveCost = async () => {
        try {
            setSavingCost(true);
            const { error } = await supabase
                .from('complaints')
                .update({ cost_amount: parseInt(cost) || 0 })
                .eq('id', id);

            if (error) throw error;
            
            setComplaint(prev => ({...prev, cost_amount: parseInt(cost) || 0}));
            alert("Estimasi biaya berhasil disimpan!");
        } catch (err) {
            alert("Gagal simpan: " + err.message);
        } finally {
            setSavingCost(false);
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
    };

    const handleAddComment = (text) => {
        const newChat = {
            id: Date.now(),
            user: currentUserRole === 'warga' ? "Pelapor" : "Petugas/Admin",
            role: currentUserRole, 
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setResponses([...responses, newChat]);
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: Clock, label: 'Menunggu' },
            verified: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: CheckCircle2, label: 'Terverifikasi' },
            in_progress: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', icon: Loader2, label: 'Diproses' },
            completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: CheckCircle2, label: 'Selesai' },
            rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: AlertCircle, label: 'Ditolak' },
        };
        const style = styles[status] || styles.pending;
        const Icon = style.icon;

        return (
            <div className={`flex items-center px-4 py-2 rounded-lg border border-transparent ${style.bg} ${style.text}`}>
                <Icon className="w-5 h-5 mr-2" />
                <span className="font-bold uppercase tracking-wider text-sm">{style.label}</span>
            </div>
        );
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-600"/></div>;
    if (!complaint) return <div className="p-10 text-center">Data tidak ditemukan.</div>;

    const position = [complaint.latitude || -6.879, complaint.longitude || 109.03];
    const canEdit = currentUserRole === 'admin' || currentUserRole === 'petugas';

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
            {/* Tombol Kembali */}
            <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-500 hover:text-emerald-600 dark:text-slate-400 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </button>

            {/* Header Detail */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <span className="font-mono bg-white dark:bg-slate-800 border dark:border-slate-600 text-gray-600 dark:text-slate-300 px-3 py-1 rounded text-xs font-bold w-fit">
                            #{complaint.ticket_id}
                        </span>
                        {getStatusBadge(complaint.status)}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{complaint.title}</h1>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        {/* Foto */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                            <div className="p-3 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 font-bold text-sm text-gray-700 dark:text-slate-300 uppercase">Bukti Foto</div>
                            <div className="aspect-video bg-gray-100 dark:bg-slate-900 flex items-center justify-center relative group">
                                {complaint.photo_url ? (
                                    <a href={complaint.photo_url} target="_blank" rel="noreferrer">
                                        <img src={complaint.photo_url} alt="Bukti" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    </a>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <ImageIcon className="w-10 h-10 mb-2 opacity-50"/>
                                        <span className="text-sm">Tidak ada foto</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Peta */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                            <div className="p-3 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 font-bold text-sm text-gray-700 dark:text-slate-300 uppercase">Lokasi Kejadian</div>
                            <div className="h-56 relative z-0">
                                {complaint.latitude ? (
                                    <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={position}><Popup>{complaint.location}</Popup></Marker>
                                    </MapContainer>
                                ) : (
                                    <div className="h-full bg-gray-100 dark:bg-slate-900 flex items-center justify-center text-gray-400 text-sm">Peta tidak tersedia</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        {canEdit && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
                                <h3 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center mb-4 text-lg">
                                    <Wallet className="w-6 h-6 mr-2" /> Estimasi Biaya Perbaikan
                                </h3>
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="text-xs text-emerald-600 dark:text-emerald-500 mb-1 block font-bold uppercase tracking-wide">Input Anggaran (Rp)</label>
                                        <input 
                                            type="number" 
                                            value={cost}
                                            onChange={(e) => setCost(e.target.value)}
                                            placeholder=""
                                            className="w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-800 dark:text-white transition-all font-mono text-lg"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleSaveCost}
                                        disabled={savingCost}
                                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors flex items-center shadow-lg shadow-emerald-600/20 disabled:opacity-70 h-[52px]"
                                    >
                                        {savingCost ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Simpan</>}
                                    </button>
                                </div>
                                {complaint.cost_amount > 0 && (
                                    <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800/50 flex justify-between items-center">
                                        <span className="text-sm text-emerald-700 dark:text-emerald-500">Terbilang:</span>
                                        <span className="text-lg font-bold text-emerald-800 dark:text-emerald-400">{formatRupiah(complaint.cost_amount)}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Deskripsi & Info */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                            <div className="mb-6">
                                <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Deskripsi Masalah</span>
                                <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-base bg-gray-50 dark:bg-[#1a1f2c] p-4 rounded-lg border border-gray-100 dark:border-slate-700">
                                    {complaint.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl">
                                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Kategori</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                        <Tag className="w-3 h-3 mr-1"/> {complaint.categories?.name || 'Umum'}
                                    </span>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl">
                                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Pelapor</span>
                                    <div className="flex items-center text-gray-900 dark:text-white font-medium">
                                        <User className="w-4 h-4 mr-2 text-gray-400"/>
                                        {complaint.is_anonymous ? "Anonim" : complaint.reporter_name}
                                    </div>
                                    <div className="flex items-center text-gray-500 dark:text-slate-400 text-sm mt-1">
                                        <Phone className="w-3 h-3 mr-2"/>
                                        {complaint.is_anonymous ? "-" : complaint.reporter_contact}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat Section */}
                        <CommentSection 
                            comments={responses} 
                            onAddComment={handleAddComment}
                            currentUserRole={currentUserRole}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}