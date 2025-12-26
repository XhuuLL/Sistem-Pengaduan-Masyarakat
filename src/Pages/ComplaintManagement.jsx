import React, { useState, useEffect, useMemo } from 'react';
import { 
    Search, Filter, Edit, Loader2, CheckCircle2, X, Calendar, 
    MapPin, Image as ImageIcon, ExternalLink, Trash2, MessageSquare,
    ChevronRight as BreadcrumbIcon, Save, ArrowLeft
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import toast from 'react-hot-toast';


let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function ComplaintManagement() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list', 'detail'
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [actionData, setActionData] = useState({ status: '', priority: '' });
    const [submitting, setSubmitting] = useState(false);
    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('complaints')
                .select('*, categories(name)')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setComplaints(data);
        } catch (error) {
            toast.error("Gagal memuat data laporan: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);
    const openDetail = (complaint) => {
        setSelectedComplaint(complaint);
        setActionData({ status: complaint.status, priority: complaint.priority });
        setViewMode('detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const backToList = () => {
        setViewMode('list');
        setSelectedComplaint(null);
    };

    const handleSaveStatus = async () => {
    setSubmitting(true);

    const loadingToast = toast.loading("Menyimpan perubahan...");

    try {
        const { error } = await supabase
            .from('complaints')
            .update({ 
                status: actionData.status, 
                priority: actionData.priority 
            })
            .eq('id', selectedComplaint.id);

        if (error) throw error;

        setComplaints(prev =>
            prev.map(c =>
                c.id === selectedComplaint.id
                    ? { ...c, status: actionData.status, priority: actionData.priority }
                    : c
            )
        );

        toast.success("Status berhasil diperbarui", { id: loadingToast });

    } catch (error) {
        toast.error("Gagal update: " + error.message, { id: loadingToast });
    } finally {
        setSubmitting(false);
    }
};



    const handleDelete = async (id) => {
    const confirm = await new Promise(resolve => {
        toast((t) => (
            <div className="space-y-3">
                <p className="font-semibold">Hapus laporan ini secara permanen?</p>
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve(false);
                        }}
                        className="px-3 py-1 rounded bg-gray-200 text-sm"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve(true);
                        }}
                        className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    });

    if (!confirm) return;

    const loadingToast = toast.loading("Menghapus laporan...");

    try {
        const { error } = await supabase
            .from('complaints')
            .delete()
            .eq('id', id);

        if (error) throw error;

        setComplaints(prev => prev.filter(c => c.id !== id));

        if (viewMode === 'detail') backToList();

        toast.success("Laporan berhasil dihapus", { id: loadingToast });

    } catch (error) {
        toast.error("Gagal menghapus: " + error.message, { id: loadingToast });
    }
};



    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900',
            verified: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900',
            in_progress: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900',
            completed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900',
            rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900'
        };
        return colors[status] || 'bg-gray-100';
    };

    const filteredComplaints = useMemo(() => {
        return complaints.filter(c => {
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
            const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    c.ticket_id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [complaints, searchTerm, statusFilter]);

    if (loading && viewMode === 'list') return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600"/></div>;

    if (viewMode === 'detail' && selectedComplaint) {
        return (
            <div className="space-y-6 pb-20 animate-in fade-in duration-300">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400 mb-4">
                    <button onClick={backToList} className="hover:text-emerald-500 transition-colors">Daftar Pengaduan</button>
                    <BreadcrumbIcon className="w-4 h-4 mx-2 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Detail Laporan</span>
                </div>

                {/* Header Detail */}
                <div className="border-b border-gray-200 dark:border-slate-700 pb-4 mb-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-1 rounded text-xs font-medium border dark:border-slate-600">
                                {selectedComplaint.ticket_id}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(selectedComplaint.status)}`}>
                                {selectedComplaint.status}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedComplaint.title}</h1>
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(selectedComplaint.id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Hapus Laporan Ini"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                            <label className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-4 block">Bukti Foto</label>
                            <div className="rounded-lg bg-gray-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center min-h-[250px] border dark:border-slate-700 relative group">
                                {selectedComplaint.photo_url ? (
                                    <a href={selectedComplaint.photo_url} target="_blank" rel="noreferrer" className="w-full h-full">
                                        <img src={selectedComplaint.photo_url} alt="Bukti Full" className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <ExternalLink className="text-white w-8 h-8" />
                                        </div>
                                    </a>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400 dark:text-slate-500">
                                        <ImageIcon className="w-10 h-10 mb-2 opacity-50"/>
                                        <span className="text-sm">Tidak ada foto bukti</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Peta GIS */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Lokasi Kejadian</label>
                                <span className={`text-xs ${selectedComplaint.latitude ? 'text-emerald-600' : 'text-gray-400'}`}>
                                    {selectedComplaint.latitude ? 'Koordinat Tersedia' : 'Tanpa Koordinat'}
                                </span>
                            </div>
                            <div className="h-64 w-full rounded-lg overflow-hidden border dark:border-slate-700 relative z-0">
                                {selectedComplaint.latitude && selectedComplaint.longitude ? (
                                    <MapContainer 
                                        center={[selectedComplaint.latitude, selectedComplaint.longitude]} 
                                        zoom={15} 
                                        style={{ height: '100%', width: '100%' }}
                                        scrollWheelZoom={false}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={[selectedComplaint.latitude, selectedComplaint.longitude]}>
                                            <Popup>{selectedComplaint.location}</Popup>
                                        </Marker>
                                    </MapContainer>
                                ) : (
                                    <div className="w-full h-full bg-gray-100 dark:bg-slate-900 flex items-center justify-center text-gray-400 text-sm">
                                        Peta tidak tersedia
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-emerald-500 pl-3">Tindakan</h3>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1 uppercase">Update Status</label>
                                    <select 
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                                        value={actionData.status} 
                                        onChange={e => setActionData({...actionData, status: e.target.value})}
                                    >
                                        <option value="pending">Menunggu</option>
                                        <option value="verified">Valid / Terverifikasi</option>
                                        <option value="in_progress">Sedang Diproses</option>
                                        <option value="completed">Selesai</option>
                                        <option value="rejected">Ditolak</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1 uppercase">Prioritas</label>
                                    <select 
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                                        value={actionData.priority} 
                                        onChange={e => setActionData({...actionData, priority: e.target.value})}
                                    >
                                        <option value="low">Rendah</option>
                                        <option value="medium">Sedang</option>
                                        <option value="high">Tinggi</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                onClick={handleSaveStatus}
                                disabled={submitting}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center disabled:opacity-70"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin"/> : "Simpan Perubahan"}
                            </button>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm space-y-4">
                            <div>
                                <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-1">Kategori</span>
                                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg text-sm border border-emerald-100 dark:border-emerald-900 inline-block">
                                    {selectedComplaint.categories?.name || 'Umum'}
                                </span>
                            </div>
                            
                            <div>
                                <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-1">Deskripsi Lengkap</span>
                                <div className="text-sm text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-[#1a1f2c] p-4 rounded-lg border border-gray-100 dark:border-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedComplaint.description}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-1">Pelapor</span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {selectedComplaint.is_anonymous ? "Anonim (Dirahasiakan)" : selectedComplaint.reporter_name}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase block mb-1">Tanggal Lapor</span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {new Date(selectedComplaint.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tombol Chat Room */}
                        <Link to={`/laporan/${selectedComplaint.id}`} className="block">
                            <button className="w-full py-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold rounded-xl border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 mr-2"/> Buka Ruang Diskusi / Chat
                            </button>
                        </Link>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-300">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Pengaduan</h1>
                <p className="text-gray-600 dark:text-slate-400 mt-1">Daftar laporan masuk dari warga.</p>
            </div>
            
            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-900 dark:text-white transition-colors"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    className="border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-900 dark:text-white outline-none cursor-pointer"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="verified">Terverifikasi</option>
                    <option value="in_progress">Diproses</option>
                    <option value="completed">Selesai</option>
                    <option value="rejected">Ditolak</option>
                </select>
            </div>

            {/* List Grid */}
            <div className="grid gap-4">
                {filteredComplaints.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-slate-500 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                        Tidak ada laporan yang sesuai.
                    </div>
                )}
                
                {filteredComplaints.map(complaint => (
                    <div key={complaint.id} onClick={() => openDetail(complaint)} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-all cursor-pointer group">
                        
                        {/* Thumbnail */}
                        <div className="w-full md:w-48 h-32 bg-gray-100 dark:bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200 dark:border-slate-600 relative">
                            {complaint.photo_url ? (
                                <img src={complaint.photo_url} alt="Thumbnail" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-slate-500">
                                    <ImageIcon className="w-8 h-8 mb-1 opacity-50" /><span className="text-xs">No Foto</span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded text-xs font-bold border border-gray-200 dark:border-slate-600">
                                            #{complaint.ticket_id}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(complaint.status)}`}>
                                            {complaint.status}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">
                                        {new Date(complaint.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                    {complaint.title}
                                </h3>
                                <p className="text-gray-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                                    {complaint.description}
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-slate-500 border-t border-gray-100 dark:border-slate-700 pt-3">
                                <span className="flex items-center font-medium truncate max-w-[150px]">
                                    <MapPin className="w-3 h-3 mr-1 text-gray-400"/> {complaint.location}
                                </span>
                                {complaint.categories && (
                                    <span className="ml-auto bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900">
                                        {complaint.categories.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}