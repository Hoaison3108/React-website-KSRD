import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Mail, Trash2, CheckCircle, Clock, Search, Eye, X } from 'lucide-react';
import Pagination from '../../components/Pagination';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type?: 'contact' | 'quote';
  status: 'new' | 'read' | 'replied';
  createdAt: any;
}

const ITEMS_PER_PAGE = 10;

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'contact' | 'quote'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(list);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'read' | 'replied') => {
    try {
      await updateDoc(doc(db, 'messages', id), { status });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) {
      try {
        await deleteDoc(doc(db, 'messages', id));
        setMessages(prev => prev.filter(m => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || m.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Mới</span>;
      case 'read':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">Đã đọc</span>;
      case 'replied':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Đã trả lời</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type?: string) => {
    if (type === 'quote') {
      return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full uppercase">Báo giá</span>;
    }
    return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase">Liên hệ</span>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tin nhắn liên hệ</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý các yêu cầu và phản hồi từ khách hàng</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm tin nhắn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {(['all', 'contact', 'quote'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  filterType === type 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {type === 'all' ? 'Tất cả' : type === 'contact' ? 'Liên hệ' : 'Báo giá'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thông tin</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ngày gửi</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedMessages.map((m) => (
                  <tr key={m.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${m.status === 'new' ? 'bg-blue-50/30 dark:bg-blue-900/10 font-medium' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(m.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{m.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{m.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">{m.phone}</div>
                      <div className="text-xs text-gray-400 max-w-[200px] truncate">{m.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(m.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedMessage(m)} 
                          className="p-2 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(m.id)} 
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedMessages.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      Không có tin nhắn nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="p-6 border-t dark:border-gray-700">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Chi tiết tin nhắn</h2>
                {getTypeBadge(selectedMessage.type)}
              </div>
              <button 
                onClick={() => setSelectedMessage(null)} 
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Họ tên</label>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Trạng thái</label>
                  <div>{getStatusBadge(selectedMessage.status)}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <p className="text-gray-700 dark:text-gray-300">{selectedMessage.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số điện thoại</label>
                  <p className="text-gray-700 dark:text-gray-300">{selectedMessage.phone}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dịch vụ/Sản phẩm quan tâm</label>
                  <p className="text-gray-700 dark:text-gray-300 font-bold">{selectedMessage.subject || 'Liên hệ chung'}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nội dung tin nhắn</label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-200 leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 border-t dark:border-gray-700">
                {selectedMessage.status !== 'read' && selectedMessage.status !== 'replied' && (
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-all dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    <Clock size={18} /> Đánh dấu đã đọc
                  </button>
                )}
                {selectedMessage.status !== 'replied' && (
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-bold transition-all dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                  >
                    <CheckCircle size={18} /> Đánh dấu đã trả lời
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold transition-all dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 ml-auto"
                >
                  <Trash2 size={18} /> Xóa tin nhắn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
