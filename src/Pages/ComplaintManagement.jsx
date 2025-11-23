import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Edit, Loader2, CheckCircle2, X, Calendar, MapPin, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function ComplaintManagement() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [actionData, setActionData] = useState({ status: '', priority: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('complaints').select('*, categories(name)').order('created_at', { ascending: false });
            if (error) throw error;
            setComplaints(data);
        } catch (error) {
            console.error("Gagal ambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);

    const handleSaveStatus = async () => {
        setSubmitting(true);
        try {
            const { error } = await supabase.from('complaints').update({ status: actionData.status, priority: actionData.priority }).eq('id', selectedComplaint.id);
            if (error) throw error;
            setComplaints(complaints.map(c => c.id === selectedComplaint.id ? { ...c, status: actionData.status, priority: actionData.priority } : c));
            setIsDialogOpen(false);
        } catch (error) {
            alert("Gagal update status: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const openDialog = (complaint) => {
        setSelectedComplaint(complaint);
        setActionData({ status: complaint.status, priority: complaint.priority });
        setIsDialogOpen(true);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
            verified: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
        };
        return colors[status] || 'bg-gray-100';
    };

    const filteredComplaints = useMemo(() => {
        return complaints.filter(c => {
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
            const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.ticket_id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [complaints, searchTerm, statusFilter]);

    if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600"/></div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Pengaduan</h1>
                <p className="text-gray-600 dark:text-slate-400">Daftar laporan warga beserta bukti fotonya.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-900 dark:text-white"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    className="border dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-900 dark:text-white outline-none"
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

            {/* List */}
            <div className="grid gap-4">
                {filteredComplaints.map(complaint => (
                    <div key={complaint.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
                        <div className="w-full md:w-48 h-32 bg-gray-100 dark:bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden border dark:border-slate-600 relative group cursor-pointer" onClick={() => openDialog(complaint)}>
                            {complaint.photo_url ? (
                                <>
                                    <img src={complaint.photo_url} alt="Bukti" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all"><ImageIcon className="text-white opacity-0 group-hover:opacity-100 w-8 h-8" /></div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-slate-500"><ImageIcon className="w-8 h-8 mb-2 opacity-50" /><span className="text-xs">No Foto</span></div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-2 py-1 rounded text-xs font-medium border dark:border-slate-600">{complaint.ticket_id}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(complaint.status)}`}>{complaint.status}</span>
                                    {complaint.categories && <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-xs border border-emerald-100 dark:border-emerald-900">{complaint.categories.name}</span>}
                                </div>
                                <button onClick={() => openDialog(complaint)} className="bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-600 border border-emerald-200 dark:border-slate-600 px-4 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm ml-auto">
                                    <Edit className="w-4 h-4 mr-2"/> Kelola
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{complaint.title}</h3>
                            <p className="text-gray-600 dark:text-slate-400 text-sm line-clamp-2 mb-3 flex-1">{complaint.description}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-slate-500 border-t dark:border-slate-700 pt-3 mt-auto">
                                <span className="flex items-center font-medium"><MapPin className="w-3 h-3 mr-1 text-gray-400"/> {complaint.location}</span>
                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 text-gray-400"/> {new Date(complaint.created_at).toLocaleDateString()}</span>
                                <span className="flex items-center ml-auto"><span className="text-gray-400 mr-1">Pelapor:</span> <span className="font-semibold text-gray-700 dark:text-slate-300">{complaint.is_anonymous ? "Anonim" : complaint.reporter_name}</span></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isDialogOpen && selectedComplaint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900">
                            <div><h3 className="text-lg font-bold text-gray-900 dark:text-white">Detail Pengaduan</h3><p className="text-xs text-gray-500 dark:text-slate-400 font-mono mt-0.5">Tiket: {selectedComplaint.ticket_id}</p></div>
                            <button onClick={() => setIsDialogOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500 dark:text-slate-400"/></button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-2 block">Bukti Foto</label>
                                    <div className="rounded-xl border dark:border-slate-700 bg-gray-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center min-h-[200px]">
                                        {selectedComplaint.photo_url ? (
                                            <a href={selectedComplaint.photo_url} target="_blank" rel="noreferrer"><img src={selectedComplaint.photo_url} alt="Bukti Full" className="w-full h-auto object-contain" /></a>
                                        ) : (
                                            <span className="text-gray-400 dark:text-slate-500 text-sm flex items-center"><ImageIcon className="w-4 h-4 mr-2"/> Tidak ada foto bukti</span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 space-y-3">
                                        <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm border-b border-blue-200 dark:border-blue-800 pb-2 mb-3">Info Laporan</h4>
                                        <div><span className="text-xs text-blue-500 dark:text-blue-400 uppercase font-bold">Judul</span><p className="text-sm font-medium text-gray-900 dark:text-white">{selectedComplaint.title}</p></div>
                                        <div><span className="text-xs text-blue-500 dark:text-blue-400 uppercase font-bold">Deskripsi</span><p className="text-sm text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-900 p-3 rounded-lg border dark:border-slate-700">{selectedComplaint.description}</p></div>
                                    </div>
                                    <div className="space-y-4 pt-2 border-t dark:border-slate-700">
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white">Tindakan Admin</label>
                                        <div>
                                            <span className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 block">Update Status</span>
                                            <select className="w-full border-gray-300 dark:border-slate-600 border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-900 dark:text-white" value={actionData.status} onChange={e => setActionData({...actionData, status: e.target.value})}>
                                                <option value="pending">⏳ Menunggu Verifikasi</option>
                                                <option value="verified">✅ Terverifikasi (Valid)</option>
                                                <option value="in_progress">🛠️ Sedang Dikerjakan</option>
                                                <option value="completed">🎉 Selesai Tuntas</option>
                                                <option value="rejected">❌ Ditolak (Tidak Valid)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <span className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 block">Prioritas</span>
                                            <select className="w-full border-gray-300 dark:border-slate-600 border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-900 dark:text-white" value={actionData.priority} onChange={e => setActionData({...actionData, priority: e.target.value})}>
                                                <option value="low">🟢 Rendah</option>
                                                <option value="medium">🟡 Sedang</option>
                                                <option value="high">🔴 Tinggi (Urgent)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex justify-end gap-3">
                            <button onClick={() => setIsDialogOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Batal</button>
                            <button onClick={handleSaveStatus} disabled={submitting} className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 flex items-center transition-colors shadow-lg shadow-emerald-200">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <CheckCircle2 className="w-4 h-4 mr-2"/>} Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}