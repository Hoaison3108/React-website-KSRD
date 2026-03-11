import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Filter, X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import SkeletonGrid from './SkeletonGrid';
import { products as localProducts, productCategories as localCategories } from '../data/products';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface Product {
  id: string | number;
  title: string;
  category?: string;
  desc: string;
  image: string;
  badge: string;
  color: string;
  price?: number;
  details?: {
    features: string[];
    specifications: { label: string; value: string | string[]; }[];
    applications: string;
  };
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const imageUrl = typeof product.image === 'string'
    ? product.image 
    : '';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full group border border-gray-100 dark:border-slate-700"
    >
      <Link to={`/products/${product.id}`} className="flex flex-col h-full">
        <div className="relative h-64 shrink-0 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <span className={`absolute bottom-8 left-8 px-3 py-1 rounded text-white text-xs font-bold uppercase ${
            product.color === 'blue' ? 'bg-primary' : 
            product.color === 'orange' ? 'bg-secondary' : 'bg-green-600'
          }`}>
            {product.badge || 'Mới'}
          </span>
        </div>
        
        <div className="p-8 flex flex-col flex-1">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-gray-600 dark:text-slate-400 text-sm mb-6 line-clamp-3">
            {product.desc}
          </p>
          
          <ul className="mt-auto mb-8 space-y-3">
            {['Tiêu chuẩn ISO', 'Giá cạnh tranh', 'Vận chuyển tận nơi'].map((item, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-slate-400 pl-6 relative">
                <span className="absolute left-0 top-1 w-3.5 h-3.5 bg-secondary rounded-sm"></span>
                {item}
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mt-auto">
             {product.price && (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {product.price.toLocaleString()} đ
                </span>
             )}
            <span className="inline-flex items-center text-xs font-extrabold text-primary dark:text-blue-400 uppercase tracking-wide hover:text-secondary transition-colors ml-auto">
              XEM CHI TIẾT <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

interface ProductsProps {
  viewMode?: 'slider' | 'grid';
  hideHeader?: boolean;
}

export default function Products({ viewMode = 'slider', hideHeader = false }: ProductsProps) {
  const { data: rawProducts, loading } = useFirestoreCollection('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const filterRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    if (rawProducts && rawProducts.length > 0) {
      const formattedProducts = rawProducts.map((p: any) => ({
        id: p.id,
        title: p.title || p.name,
        category: p.category,
        desc: p.desc || p.description,
        image: p.image || (p.images && p.images.length > 0 ? p.images[0] : ''),
        badge: p.badge || 'Mới',
        color: p.color || 'blue',
        price: p.price,
        details: p.details || {
          features: p.features || [],
          specifications: p.specifications ? Object.entries(p.specifications).map(([key, value]) => ({ label: key, value: String(value) })) : [],
          applications: p.applications || ''
        }
      })) as Product[];
      
      // Merge unique based on Title
      const combined = [...localProducts];
      formattedProducts.forEach(fp => {
        if (!combined.find(lp => lp.title === fp.title)) {
          combined.push(fp as any);
        }
      });
      setProducts(combined as any);
    } else if (!loading) {
      setProducts(localProducts as any);
    }
  }, [rawProducts, loading]);



  // Generate categories dynamically
  const productCategories = ['Tất cả', ...Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]];

  const filteredProducts = activeCategory === 'Tất cả' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = viewMode === 'grid' 
    ? filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredProducts;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('products');
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className={hideHeader ? '' : 'container-custom py-20'}>
        <SkeletonGrid count={viewMode === 'grid' ? 6 : 3} />
      </div>
    );
  }

  return (
    <section id="products" className={`${hideHeader ? '' : 'section-padding bg-gray-50 dark:bg-slate-800'} overflow-hidden`}>
      <div className={hideHeader ? '' : 'container-custom'}>
        <div className={`flex flex-col items-center text-center gap-8 ${hideHeader ? 'mb-8 relative z-20' : 'mb-12 relative z-20'}`}>
          {!hideHeader && (
            <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
              <span className="text-subtitle">DANH MỤC CUNG ỨNG</span>
              <h2 className="heading-xl dark:text-white mb-4 lg:whitespace-nowrap">
                SẢN PHẨM & <span className="text-secondary">NĂNG LỰC CUNG ỨNG</span>
              </h2>
              <div className="w-24 h-1 bg-secondary mb-6 mx-auto"></div>
              <p className="text-gray-600 dark:text-slate-300">
                Chúng tôi đầu tư hệ thống máy móc hiện đại nhất để đáp ứng các yêu cầu kỹ thuật phức tạp từ các dự án trọng điểm quốc gia.
              </p>
            </div>
          )}

          {/* Filter Button - Only show in grid mode or if specifically requested */}
          {viewMode === 'grid' && (
            <div className={`flex flex-col items-end ${hideHeader ? 'ml-auto' : 'md:ml-auto'}`} ref={filterRef}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md ${
                  showFilters 
                    ? 'bg-primary text-white' 
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {showFilters ? <X size={18} /> : <Filter size={18} />}
                <span>Bộ lọc sản phẩm</span>
                {activeCategory !== 'Tất cả' && (
                  <span className="flex items-center justify-center bg-secondary text-white text-[10px] w-5 h-5 rounded-full ml-1">
                    1
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 flex flex-wrap gap-2 min-w-[280px] max-w-[90vw] right-0 justify-end z-30"
                  >
                    {productCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setShowFilters(false);
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                          activeCategory === cat 
                            ? 'bg-primary text-white shadow-md' 
                            : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {viewMode === 'slider' ? (
          <div className="relative group/slider">
            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 bg-white dark:bg-slate-700 p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all text-primary dark:text-white opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-0 md:group-hover/slider:-translate-x-12">
              <ChevronLeft size={24} />
            </button>
            
            <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 bg-white dark:bg-slate-700 p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all text-primary dark:text-white opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-0 md:group-hover/slider:translate-x-12">
              <ChevronRight size={24} />
            </button>

            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              loop={products.length > 3}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              speed={800}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="!pb-12 !px-4 -mx-4"
            >
              {products.map((product, index) => (
                <SwiperSlide key={product.id} className="h-auto">
                  <ProductCard product={product} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {displayedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500">Đang cập nhật dữ liệu cho danh mục này...</p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                    currentPage === 1
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed dark:border-slate-700 dark:text-slate-600'
                      : 'border-gray-300 text-gray-600 hover:bg-primary hover:text-white hover:border-primary dark:border-slate-600 dark:text-slate-300'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white shadow-lg shadow-blue-900/20'
                        : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                    currentPage === totalPages
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed dark:border-slate-700 dark:text-slate-600'
                      : 'border-gray-300 text-gray-600 hover:bg-primary hover:text-white hover:border-primary dark:border-slate-600 dark:text-slate-300'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
