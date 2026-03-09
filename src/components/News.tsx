import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, ArrowRight, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import SkeletonGrid from './SkeletonGrid';
import { news as localNews, newsCategories as localCategories } from '../data/news';

interface NewsItem {
  id: string | number;
  title: string;
  category?: string;
  date: string;
  displayDate: string;
  image: string;
  excerpt: string;
  content?: string[];
  detailImages?: string[];
}

interface NewsProps {
  isPaginationEnabled?: boolean;
  hideHeader?: boolean;
}

export default function News({ isPaginationEnabled = false, hideHeader = false }: NewsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsCategories, setNewsCategories] = useState<string[]>(['Tất cả']);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const filterRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'news'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedNews = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Format date for display
          const dateObj = new Date(data.date);
          const displayDate = `${dateObj.getDate()} Th${dateObj.getMonth() + 1}`;

          return {
            id: doc.id,
            title: data.title,
            category: data.category,
            date: data.date,
            displayDate: displayDate,
            image: data.image,
            excerpt: data.summary || data.excerpt,
            content: data.content ? (Array.isArray(data.content) ? data.content : [data.content]) : [],
          } as NewsItem;
        });
        
        // Combine local news with fetched news
        const combined = [...localNews];
        fetchedNews.forEach(fn => {
          if (!combined.find(ln => ln.title === fn.title)) {
            combined.push(fn as any);
          }
        });
        
        // Sort by date desc
        combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setNews(combined as any);

        // Generate categories
        const categories = Array.from(new Set(combined.map(n => n.category).filter(Boolean) as string[]));
        setNewsCategories(['Tất cả', ...categories]);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews(localNews as any);
        setNewsCategories(localCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter news based on category
  const filteredNews = activeCategory === 'Tất cả'
    ? news
    : news.filter(item => item.category === activeCategory);

  // Sort news by date descending (already sorted by query, but good to keep)
  const sortedNews = [...filteredNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Pagination logic
  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);
  const displayedNews = isPaginationEnabled 
    ? sortedNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : sortedNews.slice(0, 3);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('news');
    if (element) {
      const yOffset = -100; // Offset to account for fixed header
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

  const getImageUrl = (image: any) => {
    if (typeof image === 'string' && image.trim() !== '') return image;
    return undefined;
  };

  if (loading) {
    return (
      <div className={hideHeader ? '' : 'container-custom py-16'}>
        <SkeletonGrid count={isPaginationEnabled ? 6 : 3} />
      </div>
    );
  }

  return (
    <section id="news" className={`${hideHeader ? '' : 'section-padding bg-gray-50 dark:bg-slate-900'} transition-colors duration-300`}>
      <div className={hideHeader ? '' : 'container-custom'}>
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 ${hideHeader ? 'mb-8 relative z-20' : 'mb-12 relative z-20'}`}>
          {!hideHeader && (
            <div className="max-w-2xl">
              <h2 className="heading-xl mb-4 dark:text-white">
                TIN TỨC & <span className="text-secondary">SỰ KIỆN</span>
              </h2>
              <p className="text-gray-600 dark:text-slate-300">
                Cập nhật những chuyển động mới nhất của Chúng tôi và ngành vật liệu xây dựng.
              </p>
            </div>
          )}

          {/* Filter Button - Only show if pagination is enabled (News Page) or if specifically requested */}
          {isPaginationEnabled && (
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
                <span>Bộ lọc tin tức</span>
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
                    {newsCategories.map((cat) => (
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

          {!isPaginationEnabled && !hideHeader && (
            <Link to="/news" className="inline-flex items-center gap-2 text-sm font-bold text-primary dark:text-blue-400 uppercase hover:text-secondary transition-colors group">
              XEM TẤT CẢ <ExternalLink size={18} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {displayedNews.map((item, index) => (
              <motion.div 
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 h-full"
              >
                <Link to={`/news/${item.id}`} className="flex flex-col h-full">
                  <div className="relative h-52 overflow-hidden shrink-0">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded text-xs font-bold uppercase shadow-md">
                      {item.displayDate}
                    </span>
                    {/* {item.category && (
                      <span className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded text-xs font-bold uppercase shadow-md z-10">
                        {item.category}
                      </span>
                    )} */}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug line-clamp-2 hover:text-primary dark:hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                      {item.excerpt}
                    </p>
                    <span className="mt-auto inline-flex items-center text-xs font-bold text-secondary uppercase hover:translate-x-1 transition-transform self-start">
                      XEM CHI TIẾT <ArrowRight size={14} className="ml-2" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredNews.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">Đang cập nhật dữ liệu cho danh mục này...</p>
          </div>
        )}

        {/* Pagination Controls */}
        {isPaginationEnabled && totalPages > 1 && (
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
      </div>
    </section>
  );
}
