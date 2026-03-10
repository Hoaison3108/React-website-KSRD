import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { news as localNews } from '../../data/news';

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
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    author: 'Ban Biên Tập',
    date: new Date().toISOString().split('T')[0],
    category: 'Tin tức công ty'
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'news'));
      const newsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          image: data.image || data.imageUrl,
          author: data.author,
          date: data.date || data.publishedAt,
          category: data.category || 'Tin tức công ty',
          createdAt: data.createdAt
        };
      }) as News[];
      setNews(newsData.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      }));
    } catch (error) {
      console.error("Error fetching news: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn khôi phục dữ liệu mặc định? Thao tác này sẽ thêm các bài viết mẫu vào hệ thống.')) {
      return;
    }

    setIsImporting(true);
    try {
      for (const item of localNews) {
        const exists = news.find(n => n.title === item.title);
        if (!exists) {
          const { id, ...newsData } = item;
          await addDoc(collection(db, 'news'), {
            ...newsData,
            createdAt: Timestamp.now()
          });
        }
      }
      alert('Đã khôi phục dữ liệu mặc định thành công!');
      fetchNews();
    } catch (error) {
      console.error("Error restoring defaults: ", error);
      alert('Có lỗi xảy ra khi khôi phục dữ liệu');
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
        ...formData,
        content: formData.content.split('\n\n').map(p => p.trim()).filter(p => p !== ''),
        createdAt: editingId ? undefined : Timestamp.now()
      };
      
      if (editingId) {
        await updateDoc(doc(db, 'news', editingId), newsData);
      } else {
        await addDoc(collection(db, 'news'), newsData);
      }
      
      handleCloseModal();
      fetchNews();
      alert('Đã lưu tin tức thành công!');
    } catch (error) {
      console.error("Error saving news: ", error);
      alert("Có lỗi xảy ra khi lưu tin tức");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin tức này?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
        fetchNews();
      } catch (error) {
        console.error("Error deleting news: ", error);
        alert("Có lỗi xảy ra khi xóa tin tức");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Danh sách Tin tức</h3>
        <div className="flex gap-3">
          <button 
            onClick={handleRestoreDefaults}
            disabled={isImporting}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors border border-gray-200 disabled:opacity-50"
          >
            <RotateCcw size={18} className={isImporting ? 'animate-spin' : ''} />
            <span>Khôi phục mặc định</span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-md"
          >
            <Plus size={18} />
            <span>Thêm tin tức</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {news.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Chưa có tin tức nào</div>
          ) : (
            news.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4 hover:shadow-md transition-shadow">
                <div className="h-24 w-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image && item.image.trim() !== '' ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg text-gray-900 truncate pr-4">{item.title}</h4>
                    <div className="flex gap-2 flex-shrink-0">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500 mb-2">
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{item.category}</span>
                    <span>{item.author}</span>
                    <span>{item.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b shrink-0">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  >
                    <option value="Tin tức công ty">Tin tức công ty</option>
                    <option value="Thị trường">Thị trường</option>
                    <option value="Kỹ thuật">Kỹ thuật</option>
                    <option value="Sự kiện">Sự kiện</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày xuất bản</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-48 resize-none"
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Sử dụng 2 lần xuống dòng để tách đoạn văn.</p>
              </div>
              </div>
              
              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 shrink-0">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2 font-medium shadow-sm"
                >
                  <Save size={18} />
                  <span>Lưu lại</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
