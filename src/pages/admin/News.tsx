import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { uploadImage } from '../../utils/uploadImage';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Search } from 'lucide-react';
import ReactQuill from 'react-quill';
import Pagination from '../../components/Pagination';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  image: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 5;

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Admin',
    image: null as File | null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const newsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsItem[];
      setNews(newsList);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = currentNews?.image || '';

      if (formData.image) {
        imageUrl = await uploadImage(formData.image, 'news');
      }

      const newsData = {
        title: formData.title,
        content: formData.content,
        author: formData.author,
        image: imageUrl,
        updatedAt: new Date().toISOString()
      };

      if (currentNews) {
        await updateDoc(doc(db, 'news', currentNews.id), newsData);
      } else {
        await addDoc(collection(db, 'news'), {
          ...newsData,
          createdAt: new Date().toISOString()
        });
      }

      setIsModalOpen(false);
      fetchNews();
      resetForm();
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Có lỗi xảy ra khi lưu tin tức.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
        fetchNews();
      } catch (error) {
        console.error("Error deleting news:", error);
        alert("Có lỗi xảy ra khi xóa bài viết.");
      }
    }
  };

  const openEditModal = (item: NewsItem) => {
    setCurrentNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      author: item.author || 'Admin',
      image: null
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setCurrentNews(null);
    setFormData({
      title: '',
      content: '',
      author: 'Admin',
      image: null
    });
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Quản lý Tin tức</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Đăng tải và cập nhật các bài viết mới nhất</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 font-bold"
          title="Tạo một bài viết tin tức mới"
        >
          <Plus size={20} className="mr-2" />
          Thêm bài viết
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
            />
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
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hình ảnh</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tác giả</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ngày đăng</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedNews.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.image && item.image.trim() !== '' ? (
                        <img src={item.image} alt={item.title} className="h-14 w-14 object-cover rounded-xl border border-gray-100 dark:border-gray-600" />
                      ) : (
                        <div className="h-14 w-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white max-w-xs truncate">{item.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{item.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(item)} 
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Chỉnh sửa bài viết này"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Xóa bài viết này"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedNews.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      Không tìm thấy bài viết nào.
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {currentNews ? 'Cập nhật tin tức' : 'Thêm tin tức mới'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                title="Đóng cửa sổ"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Tiêu đề bài viết</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập tiêu đề..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Tác giả</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Hình ảnh đại diện</label>
                  <p className="text-xs text-gray-500 mb-2">Chọn một hình ảnh đẹp để làm ảnh bìa cho bài viết.</p>
                  <div className="relative group">
                    <div className="w-full h-40 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-emerald-500/50">
                      {formData.image || (currentNews && currentNews.image && currentNews.image.trim() !== '') ? (
                        <img 
                          src={formData.image ? URL.createObjectURL(formData.image) : currentNews?.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <>
                          <ImageIcon size={32} className="text-gray-300 mb-2" />
                          <span className="text-xs text-gray-400">Chọn ảnh từ máy tính</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Nội dung bài viết</label>
                <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 min-h-[300px]">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleQuillChange}
                    modules={quillModules}
                    className="h-[250px] dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-all dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  title="Hủy bỏ và đóng cửa sổ"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-8 py-3 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                  title={currentNews ? 'Lưu các thay đổi' : 'Đăng bài viết mới'}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang lưu...
                    </>
                  ) : (currentNews ? 'Cập nhật bài viết' : 'Đăng bài viết')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
