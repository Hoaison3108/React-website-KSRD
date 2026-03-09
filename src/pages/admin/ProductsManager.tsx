import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { products as localProducts } from '../../data/products';

interface Product {
  id: string;
  title: string;
  desc: string;
  category: string;
  image: string;
  badge?: string;
  color?: string;
  gallery?: string[];
  details?: {
    features?: string[];
    specifications?: { label: string; value: string | string[] }[];
    applications?: string;
  };
  createdAt: any;
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    category: '',
    image: '',
    badge: 'Mới',
    color: 'blue',
    gallery: '',
    features: '',
    specifications: '',
    applications: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || data.name,
          desc: data.desc || data.description,
          category: data.category,
          image: data.image || data.imageUrl,
          badge: data.badge,
          color: data.color,
          gallery: data.gallery || [],
          details: data.details || {},
          createdAt: data.createdAt
        };
      }) as Product[];
      setProducts(productsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn khôi phục dữ liệu mặc định? Thao tác này sẽ thêm các sản phẩm mẫu vào hệ thống.')) {
      return;
    }

    setIsImporting(true);
    try {
      for (const product of localProducts) {
        // Check if product already exists by title
        const exists = products.find(p => p.title === product.title);
        if (!exists) {
          const { id, ...productData } = product;
          await addDoc(collection(db, 'products'), {
            ...productData,
            createdAt: Timestamp.now()
          });
        }
      }
      alert('Đã khôi phục dữ liệu mặc định thành công!');
      fetchProducts();
    } catch (error) {
      console.error("Error restoring defaults: ", error);
      alert('Có lỗi xảy ra khi khôi phục dữ liệu');
    } finally {
      setIsImporting(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      
      // Format specifications for textarea
      const specsText = product.details?.specifications
        ?.map(spec => `${spec.label}: ${Array.isArray(spec.value) ? spec.value.join(', ') : spec.value}`)
        .join('\n') || '';

      setFormData({
        title: product.title,
        desc: product.desc,
        category: product.category,
        image: product.image,
        badge: product.badge || 'Mới',
        color: product.color || 'blue',
        gallery: product.gallery?.join('\n') || '',
        features: product.details?.features?.join('\n') || '',
        specifications: specsText,
        applications: product.details?.applications || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        desc: '',
        category: '',
        image: '',
        badge: 'Mới',
        color: 'blue',
        gallery: '',
        features: '',
        specifications: '',
        applications: ''
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
      // Parse gallery images
      const gallery = formData.gallery.split('\n').map(url => url.trim()).filter(url => url);
      
      // Parse features
      const features = formData.features.split('\n').map(f => f.trim()).filter(f => f);
      
      // Parse specifications
      const specifications = formData.specifications.split('\n')
        .map(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex === -1) return null;
          const label = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          return { label, value };
        })
        .filter(item => item !== null) as { label: string; value: string }[];

      const productData = {
        title: formData.title,
        desc: formData.desc,
        category: formData.category,
        image: formData.image,
        badge: formData.badge,
        color: formData.color,
        gallery,
        details: {
          features,
          specifications,
          applications: formData.applications
        },
        createdAt: editingId ? undefined : Timestamp.now()
      };
      
      Object.keys(productData).forEach(key => productData[key as keyof typeof productData] === undefined && delete productData[key as keyof typeof productData]);

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }
      
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product: ", error);
      alert("Có lỗi xảy ra khi lưu sản phẩm");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product: ", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Danh sách Sản phẩm</h3>
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
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">Chưa có sản phẩm nào</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="h-12 w-12 rounded bg-gray-100 overflow-hidden">
                        {product.image && product.image.trim() !== '' ? (
                          <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{product.title}</td>
                    <td className="py-3 px-4 text-gray-500">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 max-w-xs truncate" title={product.desc}>
                      {product.desc}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Bê Tông & Bê Tông Nhựa">Bê Tông & Bê Tông Nhựa</option>
                    <option value="Đá & Cát">Đá & Cát</option>
                    <option value="Gạch & Ngói">Gạch & Ngói</option>
                    <option value="Xi Măng & Thép">Xi Măng & Thép</option>
                    <option value="Vật liệu khác">Vật liệu khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn (Badge)</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Mới, Chủ lực, Sẵn hàng..."
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24 resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thư viện ảnh (Mỗi dòng 1 URL)</label>
                <textarea
                  value={formData.gallery}
                  onChange={(e) => setFormData({...formData, gallery: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24 resize-none"
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đặc điểm nổi bật (Mỗi dòng 1 ý)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-32 resize-none"
                    placeholder="- Đặc điểm 1&#10;- Đặc điểm 2"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thông số kỹ thuật (Định dạng "Nhãn: Giá trị")</label>
                  <textarea
                    value={formData.specifications}
                    onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-32 resize-none"
                    placeholder="Kích thước: 300x300mm&#10;Độ dày: 30mm"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ứng dụng</label>
                <textarea
                  value={formData.applications}
                  onChange={(e) => setFormData({...formData, applications: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-20 resize-none"
                  placeholder="Mô tả ứng dụng của sản phẩm..."
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2"
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
