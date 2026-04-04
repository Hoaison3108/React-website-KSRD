import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { products as localProducts } from '../../data/products';
import { generateSlug } from '../../utils/stringUtils';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import ImageUpload from '../../components/admin/ImageUpload';
import { deleteImage } from '../../utils/uploadImage';

interface Product {
  id: string;
  slug?: string;
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
  const { showToast } = useToast();
  const { isAdmin } = useAuth();
  const { data: rawProducts, loading, refetch: fetchProducts } = useFirestoreCollection('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (rawProducts) {
      // Map data to handle missing fields and sort by createdAt
      const formatted = rawProducts.map((p: any) => ({
        id: p.id,
        slug: p.slug || generateSlug(p.title || p.name || ''),
        title: p.title || p.name,
        desc: p.desc || p.description,
        category: p.category,
        image: p.image || p.imageUrl,
        badge: p.badge,
        color: p.color,
        gallery: p.gallery || [],
        details: p.details || {},
        createdAt: p.createdAt
      })) as Product[];
      
      setProducts(formatted.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    }
  }, [rawProducts]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
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



  const handleRestoreDefaults = async () => {
    if (!window.confirm('Khôi phục dữ liệu mẫu (Xi măng Bỉm Sơn, Thép Hòa Phát...)?')) {
      return;
    }

    setIsImporting(true);
    try {
      for (const product of localProducts) {
        // Check if product already exists by title
        const exists = products.find(p => p.title === product.title);
        if (!exists) {
          const { id, ...productData } = product;
          const cleanData = JSON.parse(JSON.stringify(productData)); // Remove undefined
          cleanData.slug = cleanData.slug || generateSlug(cleanData.title || cleanData.name || '');
          await addDoc(collection(db, 'products'), {
            ...cleanData,
            createdAt: Timestamp.now()
          });
        }
      }
      showToast('Đã khôi phục dữ liệu mẫu thành công!', 'success');
      fetchProducts();
    } catch (error) {
      console.error("Error restoring defaults: ", error);
      showToast('Có lỗi xảy ra khi khôi phục dữ liệu', 'error');
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
        slug: product.slug || '',
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
        slug: '',
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

      const productData: any = {
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
        }
      };
      
      Object.keys(productData).forEach(key => productData[key as keyof typeof productData] === undefined && delete productData[key as keyof typeof productData]);

      if (editingId) {
        productData.slug = formData.slug || generateSlug(formData.title);
        await updateDoc(doc(db, 'products', editingId), productData);
      } else {
        productData.slug = generateSlug(formData.title);
        productData.createdAt = Timestamp.now();
        await addDoc(collection(db, 'products'), productData);
      }
      
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product: ", error);
      showToast("Có lỗi xảy ra khi lưu sản phẩm", 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này? (Các ảnh liên quan cũng sẽ bị xóa khỏi máy chủ)')) {
      try {
        const productToDelete = products.find(p => p.id === id);
        if (productToDelete) {
          const urlsToDelete: string[] = [];
          if (productToDelete.image) urlsToDelete.push(productToDelete.image);
          if (productToDelete.gallery && productToDelete.gallery.length > 0) {
            urlsToDelete.push(...productToDelete.gallery);
          }
          if (urlsToDelete.length > 0) {
            await deleteImage(urlsToDelete);
          }
        }

        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product: ", error);
        showToast("Có lỗi xảy ra khi xóa sản phẩm", 'error');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Danh sách Sản phẩm</h3>
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
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hình ảnh</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tên sản phẩm</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Danh mục</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mô tả</th>
                {isAdmin && <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hành động</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">Chưa có sản phẩm nào</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="h-12 w-12 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden border dark:border-gray-600">
                        {product.image && product.image.trim() !== '' ? (
                          <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{product.title}</td>
                    <td className="py-3 px-4 text-gray-500">
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-100 dark:border-blue-800/50">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 max-w-xs truncate" title={product.desc}>
                      {product.desc}
                    </td>
                    {isAdmin && (
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
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal View */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border dark:border-gray-700">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 shrink-0">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button 
                onClick={handleCloseModal} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition-colors"
                aria-label="Đóng"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                    required
                  />
                </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
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
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nhãn (Badge)</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                    placeholder="Mới, Chủ lực, Sẵn hàng..."
                  />
                </div>
              </div>
              
              <div>
                <ImageUpload
                  label="URL Hình ảnh Cover"
                  value={formData.image}
                  onChange={(val) => setFormData({...formData, image: val})}
                  folder="products/covers"
                  required={true}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Mô tả ngắn</label>
                <textarea
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white h-24 resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <ImageUpload
                  label="Thư viện ảnh"
                  value={formData.gallery}
                  onChange={(val) => setFormData({...formData, gallery: val})}
                  folder="products/gallery"
                  multiple={true}
                  helpText={<p className="text-[11px] text-gray-500 mb-2">Mỗi URL một dòng hoặc chọn tải nhiều file ảnh cùng lúc.</p>}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Đặc điểm nổi bật (Mỗi dòng 1 ý)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white h-32 resize-none"
                    placeholder="- Đặc điểm 1&#10;- Đặc điểm 2"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Thông số kỹ thuật ("Nhãn: Giá trị")</label>
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
              </div>
              
              <div className="flex justify-end gap-3 p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0 rounded-b-xl">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2 font-medium shadow-sm"
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
