import React, { useState, useRef, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import SEO from '../components/SEO';
import { Play, Image as ImageIcon, X, Filter, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { projects } from '../data/projects';
import { news } from '../data/news';

export type GalleryItemType = {
  id: string | number;
  type: 'image' | 'video';
  category: string;
  src: string;
  title: string;
  videoUrl?: string;
  link?: string;
};

const staticGalleryItems: GalleryItemType[] = [
  { id: 'static-1', type: 'image', category: 'Sản xuất', src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop', title: 'Dây chuyền sản xuất bê tông hiện đại' },
  { id: 'static-2', type: 'image', category: 'Sản xuất', src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop', title: 'Hệ thống kiểm soát chất lượng' },
  { id: 'static-3', type: 'video', category: 'Hoạt động', src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop', title: 'Quy trình đổ bê tông tại công trình', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: 'static-5', type: 'image', category: 'Đội ngũ', src: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop', title: 'Đội ngũ kỹ sư Rạng Đông' },
  { id: 'static-6', type: 'image', category: 'Sản xuất', src: 'https://images.unsplash.com/photo-1545139224-79b176937ee9?q=80&w=1000&auto=format&fit=crop', title: 'Trạm trộn bê tông nhựa nóng' },
  { id: 'static-8', type: 'image', category: 'Đội ngũ', src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop', title: 'Họp giao ban công trường' },
  { id: 'static-10', type: 'image', category: 'Sản xuất', src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop', title: 'Khai thác đá tại mỏ' },
  { id: 'static-11', type: 'video', category: 'Hoạt động', src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop', title: 'Giới thiệu năng lực sản xuất Rạng Đông', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
];

const productGalleryItems: GalleryItemType[] = products.flatMap(product => {
  const images = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : (product.image ? [product.image] : []);
  
  return images.map((src, index) => ({
    id: `product-${product.id}-${index}`,
    type: 'image',
    category: 'Sản phẩm',
    src,
    title: product.title,
    link: `/products/${product.slug}`
  }));
});

const projectGalleryItems: GalleryItemType[] = projects.flatMap(project => {
  const images = project.details?.gallery && project.details.gallery.length > 0 
    ? project.details.gallery 
    : (project.image ? [project.image] : []);
    
  return images.map((src, index) => ({
    id: `project-${project.id}-${index}`,
    type: 'image',
    category: 'Dự án',
    src,
    title: project.title,
    link: `/projects/${project.slug}`
  }));
});

const newsGalleryItems: GalleryItemType[] = news.flatMap(item => {
  const images = [item.image];
  if (item.detailImages) {
    images.push(...item.detailImages);
  }
  
  return images.filter(Boolean).map((src, index) => ({
    id: `news-${item.id}-${index}`,
    type: 'image',
    category: 'Tin tức',
    src,
    title: item.title,
    link: `/news/${item.slug}`
  }));
});

const allItems: GalleryItemType[] = [
  ...staticGalleryItems,
  ...productGalleryItems,
  ...projectGalleryItems,
  ...newsGalleryItems
];

// Deduplicate images by src
const uniqueSrcs = new Set<string>();
const galleryItems: GalleryItemType[] = [];
for (const item of allItems) {
  if (!uniqueSrcs.has(item.src)) {
    uniqueSrcs.add(item.src);
    galleryItems.push(item);
  }
}

const categories = ['Tất cả', ...Array.from(new Set(galleryItems.map(item => item.category)))];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [selectedItem, setSelectedItem] = useState<GalleryItemType | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const filteredItems = activeCategory === 'Tất cả' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

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

  return (
    <div className="pt-[78px] min-h-screen bg-gray-50 dark:bg-slate-900">
      <SEO 
        title="Thư viện hình ảnh" 
        description="Hình ảnh và video thực tế về hoạt động sản xuất, dự án tiêu biểu và đội ngũ nhân sự của Khoáng Sản Rạng Đông."
      />
      <Breadcrumb />

      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop" 
            alt="Gallery Hero" 
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/70" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 border border-secondary/50 text-secondary text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
            Tư liệu thực tế
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Thư Viện <span className="text-secondary">Hình Ảnh</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Góc nhìn chân thực về năng lực sản xuất và quy mô hoạt động của Rạng Đông.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 container-custom">
        {/* Filters */}
        <div className="flex justify-end mb-8 relative z-20" ref={filterRef}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md ${
              showFilters 
                ? 'bg-primary text-white' 
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700'
            }`}
          >
            {showFilters ? <X size={18} /> : <Filter size={18} />}
            <span>Bộ lọc</span>
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
                {categories.map((cat) => (
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

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                onClick={() => setSelectedItem(item)}
              >
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  {item.type === 'video' ? (
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white mb-3 border border-white/50">
                      <Play size={24} fill="currentColor" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white mb-3 border border-white/50">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                  <span className="text-secondary text-xs font-bold uppercase mt-2">{item.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              onClick={() => setSelectedItem(null)}
              style={{ zIndex: 110 }}
            >
              <X size={40} />
            </button>
            
            <div 
              className="max-w-5xl w-full max-h-[90vh] relative rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'video' && selectedItem.videoUrl ? (
                <div className="aspect-video w-full h-auto">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={selectedItem.videoUrl} 
                    title={selectedItem.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <img 
                  src={selectedItem.src} 
                  alt={selectedItem.title} 
                  className="w-full h-auto object-contain max-h-[85vh]"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold">{selectedItem.title}</h3>
                  <span className="text-secondary text-sm font-bold uppercase block mt-1">{selectedItem.category}</span>
                </div>
                {selectedItem.link && (
                  <Link 
                    to={selectedItem.link}
                    className="flex items-center gap-2 bg-secondary hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold transition-transform hover:-translate-y-1 ml-4 shadow-xl shadow-orange-900/20"
                    onClick={() => setSelectedItem(null)}
                  >
                    <span>Xem bài viết</span>
                    <ExternalLink size={18} />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
