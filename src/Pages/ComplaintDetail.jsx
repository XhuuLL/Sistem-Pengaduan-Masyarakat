import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ArrowLeft, MapPin, Calendar, User, 
    MessageSquare, CheckCircle2, Clock, FileText 
} from 'lucide-react';
import StatusBadge from '../Components/Shared/StatusBadge';
import PriorityBadge from '../Components/Shared/PriorityBadge';

// Import Data Dummy
import { complaints } from '../Entities/Complaint';
import { complaintResponses } from '../Entities/ComplaintResponse';

export default function ComplaintDetail() {
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newResponse, setNewResponse] = useState('');

    useEffect(() => {
        setTimeout(() => {
            const foundComplaint = complaints.find(c => c.id === parseInt(id));
            const foundResponses = complaintResponses.filter(r => r.complaint_id === parseInt(id));

            setComplaint(foundComplaint);
            setResponses(foundResponses);
            setLoading(false);
        }, 500);
    }, [id]);

    const handleSendResponse = (e) => {
        e.preventDefault();
        if (!newResponse.trim()) return;
        const newMsg = {
            id: Date.now(),
            complaint_id: parseInt(id),
            message: newResponse,
            is_official: false,
            responder_name: "Saya (Warga)",
            responder_role: "warga",
            created_at: new Date().toISOString()
        };

        setResponses([...responses, newMsg]);
        setNewResponse('');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="p-10 text-center">Loading detail...</div>;
    }

    if (!complaint) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-gray-800">Pengaduan Tidak Ditemukan</h2>
                <Link to="/riwayat" className="text-emerald-600 hover:underline mt-2 block">Kembali ke Riwayat</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Tombol Kembali */}
            <Link to="/riwayat" className="inline-flex items-center text-gray-500 hover:text-emerald-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Riwayat
            </Link>

            {/* Header Detail */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-gray-50 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-mono rounded">
                                {complaint.ticket_id}
                            </span>
                            <StatusBadge status={complaint.status} />
                            <PriorityBadge priority={complaint.priority} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Info Utama */}
                    <div className="md:col-span-2 space-y-6">
                        {complaint.photo_url && (
                            <div className="rounded-lg overflow-hidden border">
                                <img src={complaint.photo_url} alt="Bukti" className="w-full h-auto object-cover max-h-96" />
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                <FileText className="w-4 h-4 mr-2" /> Deskripsi Laporan
                            </h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {complaint.description}
                            </p>
                        </div>
                    </div>

                    {/* Kolom Kanan: Metadata */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg h-fit">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Lokasi</p>
                            <div className="flex items-start text-sm text-gray-700">
                                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-emerald-600" />
                                {complaint.location}
                            </div>
                        </div>
                        <hr className="border-gray-200"/>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tanggal Lapor</p>
                            <div className="flex items-center text-sm text-gray-700">
                                <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                                {formatDate(complaint.created_at)}
                            </div>
                        </div>
                        <hr className="border-gray-200"/>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Pelapor</p>
                            <div className="flex items-center text-sm text-gray-700">
                                <User className="w-4 h-4 mr-2 text-emerald-600" />
                                {complaint.is_anonymous ? "Anonim" : complaint.reporter_name}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Tanggapan / Diskusi */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-emerald-600" />
                    Aktivitas & Tanggapan
                </h3>

                <div className="space-y-6 mb-8">
                    {responses.length === 0 ? (
                        <p className="text-gray-500 text-center italic py-4">Belum ada tanggapan.</p>
                    ) : (
                        responses.map((resp) => (
                            <div key={resp.id} className={`flex gap-4 ${resp.is_official ? 'bg-emerald-50 p-4 rounded-lg border border-emerald-100' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${resp.is_official ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`font-semibold text-sm ${resp.is_official ? 'text-emerald-700' : 'text-gray-900'}`}>
                                            {resp.responder_name}
                                            {resp.is_official && <span className="ml-2 text-xs bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">Petugas</span>}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(resp.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{resp.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Form Balasan */}
                <form onSubmit={handleSendResponse} className="flex gap-4 items-start border-t pt-6">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <textarea 
                            rows={3}
                            placeholder="Tulis balasan atau tambahan informasi..."
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            value={newResponse}
                            onChange={(e) => setNewResponse(e.target.value)}
                        />
                        <button 
                            type="submit"
                            disabled={!newResponse.trim()}
                            className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Kirim Tanggapan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}