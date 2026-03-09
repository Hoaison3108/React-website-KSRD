import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { uploadImage } from '../../utils/uploadImage';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  specifications: Record<string, string>;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Xi măng',
    images: [] as File[],
    specificationsList: [] as { key: string, value: string }[]
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: Array.from(e.target.files!)
      }));
    }
  };

  const handleAddSpec = () => {
    setFormData(prev => ({
      ...prev,
      specificationsList: [...prev.specificationsList, { key: '', value: '' }]
    }));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newList = [...formData.specificationsList];
    newList[index][field] = value;
    setFormData(prev => ({ ...prev, specificationsList: newList }));
  };

  const handleRemoveSpec = (index: number) => {
    const newList = formData.specificationsList.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, specificationsList: newList }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrls: string[] = currentProduct?.images || [];

      if (formData.images.length > 0) {
        const uploadPromises = formData.images.map(file => uploadImage(file, 'products'));
        const newUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newUrls];
      }

      const specsRecord: Record<string, string> = {};
      formData.specificationsList.forEach(item => {
        if (item.key.trim() && item.value.trim()) {
          specsRecord[item.key.trim()] = item.value.trim();
        }
      });

      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        images: imageUrls,
        specifications: specsRecord,
        updatedAt: new Date().toISOString()
      };

      if (currentProduct) {
        await updateDoc(doc(db, 'products', currentProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date().toISOString()
        });
      }

      setIsModalOpen(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Có lỗi xảy ra khi lưu sản phẩm.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm.");
      }
    }
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    
    const specsList = product.specifications 
      ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
      : [];

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: [],
      specificationsList: specsList
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setCurrentProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Xi măng',
      images: [],
      specificationsList: []
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý Sản phẩm</h1>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          title="Thêm một sản phẩm mới vào danh sách"
        >
          <Plus size={20} className="mr-2" />
          Thêm mới
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Đang tải dữ liệu...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hình ảnh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tên sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.images && product.images.length > 0 && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="h-12 w-12 object-cover rounded-md" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.price.toLocaleString()} đ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4" title="Chỉnh sửa thông tin sản phẩm này">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Xóa sản phẩm này khỏi hệ thống">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {currentProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" title="Đóng cửa sổ">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên sản phẩm</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Xi măng">Xi măng</option>
                    <option value="Sắt thép">Sắt thép</option>
                    <option value="Gạch">Gạch</option>
                    <option value="Cát đá">Cát đá</option>
                    <option value="Sơn">Sơn</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giá (VNĐ)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hình ảnh</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Bạn có thể chọn nhiều ảnh. Ảnh đầu tiên sẽ là ảnh chính.</p>
                  {currentProduct && currentProduct.images && (
                    <div className="mt-2 flex space-x-2 overflow-x-auto">
                      {currentProduct.images.map((img, idx) => (
                        img ? <img key={idx} src={img} alt={`Preview ${idx}`} className="h-16 w-16 object-cover rounded-md border" /> : null
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thông số kỹ thuật</label>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-xs flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    title="Thêm một thông số kỹ thuật mới (VD: Kích thước - 60x60)"
                  >
                    <Plus size={14} className="mr-1" /> Thêm thông số
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-2">Nhập các thông số kỹ thuật của sản phẩm (ví dụ: Kích thước, Chất liệu, Màu sắc...).</p>
                
                {formData.specificationsList.length === 0 ? (
                  <div className="text-sm text-gray-500 italic p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    Chưa có thông số kỹ thuật nào. Bấm "Thêm thông số" để bắt đầu.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.specificationsList.map((spec, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <input
                          type="text"
                          placeholder="Tên thông số (VD: Kích thước)"
                          value={spec.key}
                          onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Giá trị (VD: 60x60 cm)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(index)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Xóa thông số này"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  title="Hủy bỏ và đóng cửa sổ"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  title={currentProduct ? 'Lưu các thay đổi' : 'Lưu sản phẩm mới'}
                >
                  {uploading ? 'Đang lưu...' : (currentProduct ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
