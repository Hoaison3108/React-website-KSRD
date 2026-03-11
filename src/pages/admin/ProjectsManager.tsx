import React, { useState } from 'react';
import { addDoc, updateDoc, deleteDoc, doc, Timestamp, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { projects as localProjects } from '../../data/projects';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useAuth } from '../../contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  desc: string;
  image: string;
  location: string;
  year: string;
  category: string;
  scale: string;
  featured?: boolean;
  details?: {
    client: string;
    scope: string;
    challenge: string;
    solution: string;
    gallery: string[];
  };
  createdAt: any;
}

export default function ProjectsManager() {
  const { isAdmin } = useAuth();
  const { data: rawProjects, loading, refetch } = useFirestoreCollection('projects');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const projects = React.useMemo(() => {
    if (!rawProjects) return [];
    return rawProjects.map((data: any) => ({
      id: data.id,
      title: data.title || '',
      desc: data.desc || data.description || '',
      image: data.image || data.imageUrl || '',
      location: data.location || '',
      year: data.year || '',
      category: data.category || 'Công nghiệp',
      scale: data.scale || '',
      featured: data.featured || false,
      details: data.details || {},
      createdAt: data.createdAt
    })).sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)) as Project[];
  }, [rawProjects]);

  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    image: '',
    location: '',
    year: '',
    category: 'Công nghiệp',
    scale: '',
    featured: false,
    client: '',
    scope: '',
    challenge: '',
    solution: '',
    gallery: ''
  });

  const handleRestoreDefaults = async () => {
    if (!window.confirm('Khôi phục dữ liệu mẫu (Nhà máy Bỉm Sơn, Sân bay Long Thành...)?')) return;
    setIsImporting(true);
    try {
      for (const project of localProjects) {
        const exists = projects.find(p => p.title === project.title);
        if (!exists) {
          const { id, ...projectData } = project;
          const cleanData = JSON.parse(JSON.stringify(projectData)); // Remove all undefined fields safely
          await addDoc(collection(db, 'projects'), { ...cleanData, createdAt: Timestamp.now() });
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

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingId(project.id);
      setFormData({
        title: project.title,
        desc: project.desc,
        image: project.image,
        location: project.location,
        year: project.year,
        category: project.category,
        scale: project.scale || '',
        featured: project.featured || false,
        client: project.details?.client || '',
        scope: project.details?.scope || '',
        challenge: project.details?.challenge || '',
        solution: project.details?.solution || '',
        gallery: project.details?.gallery ? project.details.gallery.join('\n') : ''
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        desc: '',
        image: '',
        location: '',
        year: new Date().getFullYear().toString(),
        category: 'Công nghiệp',
        scale: '',
        featured: false,
        client: '',
        scope: '',
        challenge: '',
        solution: '',
        gallery: ''
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
      const projectData = {
        title: formData.title,
        desc: formData.desc,
        image: formData.image,
        location: formData.location,
        year: formData.year,
        category: formData.category,
        scale: formData.scale,
        featured: formData.featured,
        details: {
          client: formData.client,
          scope: formData.scope,
          challenge: formData.challenge,
          solution: formData.solution,
          gallery: formData.gallery.split('\n').map(url => url.trim()).filter(url => url !== '')
        },
        createdAt: editingId ? undefined : Timestamp.now()
      };
      
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), projectData);
      } else {
        await addDoc(collection(db, 'projects'), projectData);
      }
      
      handleCloseModal();
      alert('Đã lưu dự án thành công!');
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu dự án");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Chắc chắn muốn xóa dự án này?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
      } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Danh sách Dự án</h3>
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
              <span>Thêm dự án</span>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-800 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">Chưa có dự án nào (Vui lòng bấm Sinh dữ liệu mẫu)</div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-100 dark:bg-slate-700 relative group">
                  {project.image && project.image.trim() !== '' ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 z-10">
                    {project.featured && (
                      <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase">Nổi bật</span>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                      <button 
                        onClick={() => handleOpenModal(project)}
                        className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 shadow-sm backdrop-blur-sm"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 shadow-sm backdrop-blur-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-4 relative bg-white dark:bg-slate-800 z-20">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate" title={project.title}>{project.title}</h4>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{project.location}</span>
                    <span>{project.year}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-bold uppercase border border-blue-100 dark:border-blue-800">{project.category}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{project.desc}</p>
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
                {editingId ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider mb-2 border-b dark:border-slate-700 pb-2">1. Thông tin cơ bản</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên dự án *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none text-gray-900 dark:text-white transition-all shadow-sm"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Địa điểm *</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Năm hoàn thành *</label>
                      <input
                        type="text"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quy mô *</label>
                      <input
                        type="text"
                        value={formData.scale}
                        onChange={(e) => setFormData({...formData, scale: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm"
                        required
                      >
                        <option value="Công nghiệp">Công nghiệp</option>
                        <option value="Dân dụng">Dân dụng</option>
                        <option value="Hạ tầng">Hạ tầng</option>
                        <option value="Giao thông">Giao thông</option>
                        <option value="Thủy lợi">Thủy lợi</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="w-4 h-4 text-blue-800 border-gray-300 rounded focus:ring-blue-800"
                    />
                    <label htmlFor="featured" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Cắm cờ Phát ưu tiên (Dự án nổi bật)</label>
                  </div>
                </div>

                {/* Media */}
                <div className="space-y-4 pt-4 mt-2 border-t border-gray-100 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider mb-2 border-b dark:border-slate-700 pb-2">2. Truyền thông & Hình ảnh</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Hình ảnh Cover *</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm"
                      placeholder="https://.../cover.jpg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thư viện ảnh Gallery (Mỗi URL một dòng)</label>
                    <textarea
                      value={formData.gallery}
                      onChange={(e) => setFormData({...formData, gallery: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm h-24 resize-none"
                      placeholder="https://.../img1.jpg&#10;https://.../img2.jpg"
                    ></textarea>
                  </div>
                </div>

                {/* Extended Details */}
                <div className="space-y-4 pt-4 mt-2 border-t border-gray-100 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider mb-2 border-b dark:border-slate-700 pb-2">3. Bài viết chi tiết</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chủ đầu tư</label>
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => setFormData({...formData, client: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phạm vi công việc</label>
                      <input
                        type="text"
                        value={formData.scope}
                        onChange={(e) => setFormData({...formData, scope: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đoạn tóm tắt (Mô tả ngắn) *</label>
                    <textarea
                      value={formData.desc}
                      onChange={(e) => setFormData({...formData, desc: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm h-20 resize-none"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thách thức</label>
                      <textarea
                        value={formData.challenge}
                        onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm h-24 resize-none"
                        placeholder="Có khúc mắc khó khăn nào ở dự án."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giải pháp thi công</label>
                      <textarea
                        value={formData.solution}
                        onChange={(e) => setFormData({...formData, solution: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none text-gray-900 dark:text-white shadow-sm h-24 resize-none"
                        placeholder="Thép Rạng Đông đã xử lý thế nào."
                      ></textarea>
                    </div>
                  </div>
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
                  <span>{editingId ? 'Cập nhật' : 'Thêm mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
