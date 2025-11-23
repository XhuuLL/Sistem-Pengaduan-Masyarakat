import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
    FileText, Search, Filter, Calendar, 
    MapPin, Loader2, AlertCircle 
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const savedUser = localStorage.getItem('user_session');
        if (savedUser) {
            fetchMyComplaints();
        } else {
            setLoading(false);
        }
    }, []);
    const fetchMyComplaints = async () => {
        try {
            const { data, error } = await supabase
                .from('complaints')
                .select(`
                    *,
                    categories ( name )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setComplaints(data);
        } catch (error) {
            console.error("Gagal ambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredComplaints = useMemo(() => {
        let result = complaints;

        if (statusFilter !== 'all') {
            result = result.filter(c => c.status === statusFilter);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(c =>
                c.title.toLowerCase().includes(term) ||
                c.ticket_id.toLowerCase().includes(term) ||
                c.location.toLowerCase().includes(term)
            );
        }

        return result;
    }, [complaints, searchTerm, statusFilter]);

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800",
            verified: "bg-blue-100 text-blue-800",
            in_progress: "bg-purple-100 text-purple-800",
            completed: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800"
        };
        return <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || "bg-gray-100"}`}>{status}</span>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pengaduan Saya</h1>
                    <p className="text-gray-600 mt-1">Total {complaints.length} laporan tersimpan</p>
                </div>
                <Link to="/lapor">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors">
                        <FileText className="w-4 h-4 mr-2" /> Buat Laporan Baru
                    </button>
                </Link>
            </div>

            <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        placeholder="Cari judul, tiket, atau lokasi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full md:w-48 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="in_progress">Proses</option>
                    <option value="completed">Selesai</option>
                    <option value="rejected">Ditolak</option>
                </select>
            </div>

            {/* List */}
            {filteredComplaints.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Belum ada data pengaduan.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredComplaints.map((complaint) => (
                        <div key={complaint.id} className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                    {complaint.photo_url ? (
                                        <img src={complaint.photo_url} alt="Bukti" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{complaint.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">{complaint.ticket_id}</span>
                                                {getStatusBadge(complaint.status)}
                                            </div>
                                        </div>
                                        {complaint.categories && (
                                            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                                                {complaint.categories.name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{complaint.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-3">
                                        <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {complaint.location}</span>
                                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {formatDate(complaint.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}