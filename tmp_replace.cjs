const fs = require('fs');
const filepath = 'd:/CODE/React-website-KSRD/src/pages/Gallery.tsx';
let content = fs.readFileSync(filepath, 'utf8');

const newImportsAndData = `import { Play, Image as ImageIcon, X, Filter, ExternalLink } from 'lucide-react';
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
    id: \`product-\${product.id}-\${index}\`,
    type: 'image',
    category: 'Sản phẩm',
    src,
    title: product.title,
    link: \`/products/\${product.slug}\`
  }));
});

const projectGalleryItems: GalleryItemType[] = projects.flatMap(project => {
  const images = project.details?.gallery && project.details.gallery.length > 0 
    ? project.details.gallery 
    : (project.image ? [project.image] : []);
    
  return images.map((src, index) => ({
    id: \`project-\${project.id}-\${index}\`,
    type: 'image',
    category: 'Dự án',
    src,
    title: project.title,
    link: \`/projects/\${project.slug}\`
  }));
});

const newsGalleryItems: GalleryItemType[] = news.flatMap(item => {
  const images = [item.image];
  if (item.detailImages) {
    images.push(...item.detailImages);
  }
  
  return images.filter(Boolean).map((src, index) => ({
    id: \`news-\${item.id}-\${index}\`,
    type: 'image',
    category: 'Tin tức',
    src,
    title: item.title,
    link: \`/news/\${item.slug}\`
  }));
});

const galleryItems: GalleryItemType[] = [
  ...staticGalleryItems,
  ...productGalleryItems,
  ...projectGalleryItems,
  ...newsGalleryItems
];

const categories = ['Tất cả', ...Array.from(new Set(galleryItems.map(item => item.category)))];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [selectedItem, setSelectedItem] = useState<GalleryItemType | null>(null);`;

const importsStart = content.indexOf("import { Play, Image as ImageIcon, X, Filter } from 'lucide-react';");
const setupEnd = content.indexOf("const [showFilters, setShowFilters] = useState(false);");

const newContentPart1 = content.slice(0, importsStart) + newImportsAndData + '\n  ' + content.slice(setupEnd);

const originalLightbox = `{/* Lightbox Modal */}
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
            >
              <X size={40} />
            </button>
            
            <div 
              className="max-w-5xl w-full max-h-[90vh] relative rounded-2xl overflow-hidden bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'video' && selectedItem.videoUrl ? (
                <div className="aspect-video w-full">
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
                  className="w-full h-full object-contain max-h-[85vh]"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-xl font-bold">{selectedItem.title}</h3>
                <span className="text-secondary text-sm font-bold uppercase">{selectedItem.category}</span>
              </div>
            </div>
          </motion.div>
        )}`;

const newLightbox = `{/* Lightbox Modal */}
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
                  >
                    <span>Xem bài viết</span>
                    <ExternalLink size={18} />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}`;

const updatedContent = newContentPart1.replace(originalLightbox, newLightbox);
fs.writeFileSync(filepath, updatedContent);
console.log("Successfully updated Gallery.tsx");
