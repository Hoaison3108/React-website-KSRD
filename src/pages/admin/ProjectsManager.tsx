import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { projects as localProjects } from '../../data/projects';

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  // Form state
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          desc: data.desc || data.description,
          image: data.image || data.imageUrl,
          location: data.location,
          year: data.year,
          category: data.category || 'Công nghiệp',
          scale: data.scale || '',
          featured: data.featured || false,
          details: data.details,
          createdAt: data.createdAt
        };
      }) as Project[];
      setProjects(projectsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (error) {
      console.error("Error fetching projects: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn khôi phục dữ liệu mặc định? Thao tác này sẽ thêm các dự án mẫu vào hệ thống.')) {
      return;
    }

    setIsImporting(true);
    try {
      for (const project of localProjects) {
        const exists = projects.find(p => p.title === project.title);
        if (!exists) {
          const { id, ...projectData } = project;
          await addDoc(collection(db, 'projects'), {
            ...projectData,
            createdAt: Timestamp.now()
          });
        }
      }
      alert('Đã khôi phục dữ liệu mặc định thành công!');
      fetchProjects();
    } catch (error) {
      console.error("Error restoring defaults: ", error);
      alert('Có lỗi xảy ra khi khôi phục dữ liệu');
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
      fetchProjects();
      alert('Đã lưu dự án thành công!');
    } catch (error) {
      console.error("Error saving project: ", error);
      alert("Có lỗi xảy ra khi lưu dự án");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project: ", error);
        alert("Có lỗi xảy ra khi xóa dự án");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Danh sách Dự án</h3>
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
            <span>Thêm dự án</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">Chưa có dự án nào</div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-100 relative">
                  {project.image && project.image.trim() !== '' ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    {project.featured && (
                      <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase">Nổi bật</span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(project)}
                      className="p-2 bg-white/90 rounded-full text-blue-600 hover:text-blue-800 shadow-sm"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-white/90 rounded-full text-red-600 hover:text-red-800 shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg text-gray-900 mb-1 truncate" title={project.title}>{project.title}</h4>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>{project.location}</span>
                    <span>{project.year}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">{project.category}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{project.desc}</p>
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
                {editingId ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên dự án</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Năm hoàn thành</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quy mô</label>
                  <input
                    type="text"
                    value={formData.scale}
                    onChange={(e) => setFormData({...formData, scale: e.target.value})}
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
                    <option value="Công nghiệp">Công nghiệp</option>
                    <option value="Dân dụng">Dân dụng</option>
                    <option value="Hạ tầng">Hạ tầng</option>
                    <option value="Giao thông">Giao thông</option>
                    <option value="Thủy lợi">Thủy lợi</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Dự án nổi bật</label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh chính</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đầu tư</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({...formData, client: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phạm vi công việc</label>
                  <input
                    type="text"
                    value={formData.scope}
                    onChange={(e) => setFormData({...formData, scope: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thách thức</label>
                  <textarea
                    value={formData.challenge}
                    onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-20 resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giải pháp</label>
                  <textarea
                    value={formData.solution}
                    onChange={(e) => setFormData({...formData, solution: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-20 resize-none"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thư viện ảnh (mỗi URL một dòng)</label>
                <textarea
                  value={formData.gallery}
                  onChange={(e) => setFormData({...formData, gallery: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24 resize-none"
                  placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24 resize-none"
                  required
                ></textarea>
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
