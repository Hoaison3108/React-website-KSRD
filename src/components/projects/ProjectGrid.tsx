import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, MapPin, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import SkeletonGrid from '../SkeletonGrid';
import { projects as localProjects } from '../../data/projects';

interface Project {
  id: string | number;
  title: string;
  category: string;
  image: string;
  location: string;
  year: string;
  desc: string;
  scale: string;
}

interface ProjectGridProps {
  hideHeader?: boolean;
}

export default function ProjectGrid({ hideHeader = false }: ProjectGridProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectCategories, setProjectCategories] = useState<string[]>(['Tất cả']);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const filterRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const fetchedProjects = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            category: data.category,
            image: data.image,
            location: data.location,
            year: data.year,
            desc: data.description || data.desc,
            scale: data.scale
          } as Project;
        });
        
        // Combine local projects with fetched projects
        const combined = [...localProjects];
        fetchedProjects.forEach(fp => {
          if (!combined.find(lp => lp.title === fp.title)) {
            combined.push(fp as any);
          }
        });

        setProjects(combined as any);

        // Generate categories
        const categories = Array.from(new Set(combined.map(p => p.category).filter(Boolean) as string[]));
        setProjectCategories(['Tất cả', ...categories]);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects(localProjects as any);
        const categories = Array.from(new Set(localProjects.map(p => p.category)));
        setProjectCategories(['Tất cả', ...categories]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === 'Tất cả' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid with offset
    const gridElement = document.getElementById('project-grid');
    if (gridElement) {
      const yOffset = -100; // Offset to account for fixed header
      const y = gridElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Reset to page 1 when category changes
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
      <div className={hideHeader ? '' : 'container-custom py-16'}>
        <SkeletonGrid count={6} />
      </div>
    );
  }

  return (
    <section id="project-grid" className={`${hideHeader ? '' : 'section-padding bg-gray-50 dark:bg-slate-900'}`}>
      <div className={hideHeader ? '' : 'container-custom'}>
        {/* Filter Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 ${hideHeader ? 'mb-8 relative z-20' : 'mb-16 relative z-20'}`}>
          {!hideHeader && (
            <div>
              <span className="text-subtitle">DANH MỤC THỰC THI</span>
              <h2 className="heading-xl dark:text-white mb-0">
                CÁC DỰ ÁN <span className="text-secondary">ĐÃ TRIỂN KHAI</span>
              </h2>
            </div>
          )}

          <div className="flex flex-col items-end ml-auto" ref={filterRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md ${
                showFilters 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {showFilters ? <X size={18} /> : <Filter size={18} />}
              <span>Bộ lọc dự án</span>
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
                  {projectCategories.map((cat) => (
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
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-700 h-full"
              >
                <Link to={`/projects/${project.id}`} className="flex flex-col h-full">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
                    
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                        {project.category}
                      </span>
                    </div>

                    <div className="absolute bottom-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center shadow-xl">
                        <ArrowUpRight size={24} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-secondary" />
                        {project.location}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                      {project.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed min-h-[4.5rem]">
                      {project.desc}
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Quy mô</p>
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{project.scale}</p>
                        </div>
                        <span className="text-xs font-bold text-primary dark:text-blue-400 hover:text-secondary transition-colors uppercase tracking-wider">
                          Chi tiết
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
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
      </div>
    </section>
  );
}
