import React, { useState } from 'react';
import { addDoc, updateDoc, deleteDoc, doc, Timestamp, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { news as localNews } from '../../data/news';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useAuth } from '../../contexts/AuthContext';

interface News {
  id: string;
  title: string;
  content: string | string[];
  image: string;
  author: string;
  date: string;
  category: string;
  createdAt: any;
}

export default function NewsManager() {
  const { isAdmin } = useAuth();
  const { data: rawNews, loading, refetch } = useFirestoreCollection('news');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const newsList = React.useMemo(() => {
    if (!rawNews) return [];
    return rawNews.map((data: any) => ({
      id: data.id,
      title: data.title || '',
      content: data.content || '',
      image: data.image || data.imageUrl || '',
      author: data.author || 'Ban Biên Tập',
      date: data.date || data.publishedAt || '',
      category: data.category || 'Tin tức công ty',
      createdAt: data.createdAt
    })).sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    }) as News[];
  }, [rawNews]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    author: 'Ban Biên Tập',
    date: new Date().toISOString().split('T')[0],
    category: 'Tin tức công ty'
  });

  const handleRestoreDefaults = async () => {
    if (!window.confirm('Khôi phục dữ liệu mẫu (Tin tức xuất khẩu xỉ than, khai trương...)?')) {
      return;
    }
    
    setIsImporting(true);
    try {
      for (const item of localNews) {
        const exists = newsList.find(n => n.title === item.title);
        if (!exists) {
          const cleanData = {
            title: item.title || '',
            content: item.content || (item.excerpt ? [item.excerpt] : ['']),
            image: item.image || '',
            author: 'Ban Biên Tập',
            date: item.date || new Date().toISOString().split('T')[0],
            category: item.category || 'Tin tức công ty',
            createdAt: Timestamp.now()
          };
          await addDoc(collection(db, 'news'), cleanData);
        }
      }
      alert('Đã khôi phục dữ liệu mẫu thành công!');
      refetch();
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra');
    } finally {
      setIsImporting(false);
    }
  };

  const handleOpenModal = (item?: News) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        content: Array.isArray(item.content) ? item.content.join('\n\n') : item.content,
        image: item.image,
        author: item.author,
        date: item.date,
        category: item.category
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        content: '',
        image: '',
        author: 'Ban Biên Tập',
        date: new Date().toISOString().split('T')[0],
        category: 'Tin tức công ty'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newsData = {
        title: formData.title,
        content: formData.content.split('\n\n').map(p => p.trim()).filter(p => p !== ''),
        image: formData.image,
        author: formData.author,
        date: formData.date,
        category: formData.category,
        createdAt: editingId ? undefined : Timestamp.now()
      };
      
      if (editingId) {
        await updateDoc(doc(db, 'news', editingId), newsData);
      } else {
        await addDoc(collection(db, 'news'), newsData);
      }
      
      handleCloseModal();
      alert('Đã lưu tin tức thành công!');
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu tin tức");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Chắc chắn muốn xóa tin tức này?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
      } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa tin tức");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Danh sách Tin tức</h3>
        {isAdmin && (
          <div className="flex gap-3">
            <button 
              onClick={handleRestoreDefaults}
              disabled={isImporting}
              className="bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700 shadow-sm disabled:opacity-50"
            >
              <RotateCcw size={18} className={isImporting ? 'animate-spin' : ''} />
              <span>Sinh dữ liệu mẫu</span>
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-md"
            >
              <Plus size={18} />
              <span>Thêm bài viết</span>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-800 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {newsList.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">Chưa có tin tức nào (Vui lòng bấm Sinh dữ liệu mẫu)</div>
          ) : (
            newsList.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow group relative z-10">
                <div className="h-32 w-full md:w-48 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {item.image && item.image.trim() !== '' ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white truncate pr-4">{item.title}</h4>
                    {isAdmin && (
                      <div className="flex gap-2 flex-shrink-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 md:relative">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/60 rounded-lg transition-colors shadow-sm"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/60 rounded-lg transition-colors shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2 mt-1">
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-100 dark:border-blue-800/50">{item.category}</span>
                    <span>{item.author}</span>
                    <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>{item.date}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {Array.isArray(item.content) ? item.content[0] : item.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-100 dark:border-slate-700">
            <div className="flex justify-between items-center p-6 border-b dark:border-slate-700 shrink-0 bg-gray-50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-blue-800 dark:text-white">
                {editingId ? 'Chỉnh sửa bài viết' : 'Thêm tin tức mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tiêu đề bài viết *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white transition-all shadow-sm font-medium"
                    required
                  />
                </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tác giả</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm"
                    required
                  >
                    <option value="Tin tức công ty">Tin công ty</option>
                    <option value="Thị trường">Thị trường</option>
                    <option value="Kỹ thuật">Kỹ thuật</option>
                    <option value="Sự kiện">Sự kiện</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày xuất bản</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Cover Image (Ảnh Thumbnail) *</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm"
                  placeholder="https://..."
                  required
                />
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nội dung bài viết *</label>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 p-3 rounded-lg text-xs mb-3 border border-yellow-200 dark:border-yellow-800">
                  <span className="font-bold border-b border-yellow-400 dark:border-yellow-600 pb-0.5">Mẹo định dạng:</span> Sử dụng 2 lần xuống dòng (Enter) để tách thành các đoạn văn riêng biệt.
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm h-64 resize-none leading-relaxed"
                  placeholder="Bắt đầu viết nội dung tại đây..."
                  required
                ></textarea>
              </div>

              </div>
              
              <div className="flex justify-end gap-3 p-6 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 shrink-0">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-bold shadow-sm"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2 font-bold shadow-md"
                >
                  <Save size={18} />
                  <span>{editingId ? 'Cập nhật' : 'Đăng bài'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
