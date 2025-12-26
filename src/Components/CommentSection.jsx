import React, { useState } from 'react';
import { Send } from 'lucide-react';

const CommentSection = ({ comments, onAddComment, currentUserRole }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment("");
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl mt-6">
      <h3 className="text-white font-semibold mb-4">Riwayat Tanggapan</h3>
      
      {/* List Komentar */}
      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
        {comments.map((chat, index) => (
          <div key={index} className={`flex ${chat.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              chat.role === 'admin' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-700 text-gray-200 rounded-bl-none'
            }`}>
              <p className="text-xs font-bold mb-1 opacity-75">{chat.user}</p>
              <p className="text-sm">{chat.text}</p>
              <span className="text-[10px] opacity-50 block text-right mt-1">{chat.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text" 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          // PERUBAHAN DISINI: Menggunakan currentUserRole di placeholder
          placeholder={`Tulis tanggapan sebagai ${currentUserRole || 'Pengguna'}...`}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default CommentSection;