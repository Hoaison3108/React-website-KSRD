import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Building2, Ruler, Target, Lightbulb, ChevronRight, ChevronLeft, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Breadcrumb from '../components/Breadcrumb';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { projects as localProjects } from '../data/projects';

interface Project {
  id: string | number;
  title: string;
  category: string;
  location: string;
  year: string;
  scale: string;
  desc: string;
  image: string;
  featured: boolean;
  details?: {
    client: string;
    scope: string;
    challenge: string;
    solution: string;
    gallery: string[];
  };
}

import SEO from '../components/SEO';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProject = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Try fetching from Firestore first
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);

        let fetchedProject: Project | null = null;

        if (docSnap.exists()) {
          const data = docSnap.data();
          fetchedProject = {
            id: docSnap.id,
            title: data.title,
            category: data.category,
            location: data.location,
            year: data.year,
            scale: data.scale,
            desc: data.description || data.desc,
            image: data.image,
            featured: data.featured || false,
            details: {
              client: data.client || '',
              scope: data.scope || '',
              challenge: data.challenge || '',
              solution: data.solution || '',
              gallery: data.gallery || []
            }
          };
        } else {
          // Fallback to local data
          const local = localProjects.find(p => p.id.toString() === id);
          if (local) {
            fetchedProject = {
              ...local,
              id: local.id.toString()
            } as any;
          }
        }

        if (fetchedProject) {
          setProject(fetchedProject);

          // Fetch other projects
          const projectsRef = collection(db, 'projects');
          const q = query(projectsRef, limit(6));
          const querySnapshot = await getDocs(q);
          const othersFromFirestore = querySnapshot.docs
            .map(d => {
              const dData = d.data();
              return {
                id: d.id,
                title: dData.title,
                category: dData.category,
                location: dData.location,
                year: dData.year,
                scale: dData.scale,
                desc: dData.description || dData.desc,
                image: dData.image,
                featured: dData.featured || false
              } as Project;
            })
            .filter(p => p.id !== id);
          
          // Combine with local projects for "Other Projects"
          const combinedOthers = [...othersFromFirestore];
          localProjects.forEach(lp => {
            if (lp.id.toString() !== id && !combinedOthers.find(co => co.title === lp.title)) {
              combinedOthers.push({ ...lp, id: lp.id.toString() } as any);
            }
          });

          setOtherProjects(combinedOthers.slice(0, 5));
        } else {
          setProject(null);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        // Fallback to local data on error
        const local = localProjects.find(p => p.id.toString() === id);
        if (local) {
          setProject({ ...local, id: local.id.toString() } as any);
          setOtherProjects(localProjects.filter(p => p.id.toString() !== id).slice(0, 5) as any);
        }
      } finally {
        setLoading(false);
        setCurrentImageIndex(0);
      }
    };

    fetchProject();
  }, [id]);

  const getImageUrl = (image: any) => {
    if (typeof image === 'string' && image.trim() !== '') return image;
    return undefined;
  };

  const nextImage = () => {
    if (project?.details?.gallery && project.details.gallery.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === project.details!.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project?.details?.gallery && project.details.gallery.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.details!.gallery.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy dự án</h2>
        <Link to="/projects" className="text-primary hover:underline flex items-center">
          <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách dự án
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[72px] bg-gray-50 dark:bg-slate-900 min-h-screen">
      <SEO 
        title={project.title} 
        description={project.desc}
      />
      <Breadcrumb customLastSegment={project.title} />
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img 
          src={getImageUrl(project.image)} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <Link 
                to="/projects" 
                className="inline-flex items-center text-secondary mb-6 hover:gap-2 transition-all font-bold uppercase text-xs tracking-widest"
              >
                <ArrowLeft size={16} className="mr-2" /> Quay lại dự án
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-secondary" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-secondary" />
                  <span>{project.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-secondary/20 text-secondary border border-secondary/30 rounded text-[10px] font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container-custom -mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {/* Top Row: Overview and Technical Info */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-slate-700 h-full">
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 flex items-center gap-3">
                <Building2 className="text-secondary" />
                Tổng quan dự án
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                {project.desc}
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                      <Target className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-white mb-1">Thách thức</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.details?.challenge}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                      <Lightbulb className="text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-white mb-1">Giải pháp</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.details?.solution}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-4">Phạm vi cung ứng</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {project.details?.scope}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-primary text-white rounded-3xl p-8 shadow-xl relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-xl font-bold mb-6 relative z-10">Thông tin kỹ thuật</h3>
              <div className="space-y-6 relative z-10 flex-grow">
                <div>
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Chủ đầu tư</p>
                  <p className="font-medium">{project.details?.client}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Quy mô</p>
                  <p className="font-medium">{project.scale}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Hạng mục</p>
                  <p className="font-medium">{project.category}</p>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-white/10 relative z-10">
                <Link to="/contact" className="w-full btn bg-secondary text-white hover:bg-orange-600 flex items-center justify-center gap-2">
                  Liên hệ hợp tác <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Gallery and Other Projects */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch mt-12">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-slate-700 h-full">
              {project.details?.gallery && project.details.gallery.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-primary dark:text-white flex items-center gap-3 mb-4">
                    Hình ảnh thi công
                  </h3>
                  
                  <div 
                    className="relative group rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-900 shadow-lg cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <div className="aspect-video relative">
                      <AnimatePresence mode='wait'>
                        <motion.img 
                          key={currentImageIndex}
                          src={getImageUrl(project.details.gallery[currentImageIndex])} 
                          alt={`Construction image ${currentImageIndex + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </AnimatePresence>
                      
                      {/* Overlay Controls */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        {project.details.gallery.length > 1 && (
                          <>
                            <button 
                              onClick={(e) => { e.stopPropagation(); prevImage(); }}
                              className="pointer-events-auto p-3 rounded-full bg-white/90 hover:bg-white text-primary shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95"
                              aria-label="Previous image"
                            >
                              <ChevronLeft size={24} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); nextImage(); }}
                              className="pointer-events-auto p-3 rounded-full bg-white/90 hover:bg-white text-primary shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95"
                              aria-label="Next image"
                            >
                              <ChevronRight size={24} />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Zoom Indicator */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                         <div className="bg-black/50 backdrop-blur-md text-white p-2 rounded-lg">
                            <Maximize2 size={20} />
                         </div>
                      </div>

                      {/* Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium border border-white/10 z-10">
                        {currentImageIndex + 1} / {project.details.gallery.length}
                      </div>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {project.details.gallery.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x pt-2">
                      {project.details.gallery.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative w-24 h-24 shrink-0 rounded-xl overflow-hidden transition-all snap-start border-2 ${
                            currentImageIndex === idx 
                              ? 'border-primary scale-105 shadow-md' 
                              : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                          }`}
                        >
                          <img 
                            src={getImageUrl(img)} 
                            alt={`Thumbnail ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 italic">
                  Hình ảnh đang được cập nhật...
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 h-full">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Dự án khác</h3>
              <div className="space-y-6">
                {otherProjects
                  .map((other) => (
                    <Link key={other.id} to={`/projects/${other.id}`} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <img src={getImageUrl(other.image)} alt={other.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-1">
                          {other.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{other.category}</p>
                      </div>
                    </Link>
                  ))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
                <Link to="/projects" className="flex items-center justify-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors group">
                  Xem tất cả dự án <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="mt-20 py-16 bg-gradient-to-r from-primary to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bạn muốn thực hiện dự án tương tự?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
            Với kinh nghiệm và năng lực đã được khẳng định qua nhiều công trình lớn, chúng tôi sẵn sàng đồng hành cùng bạn kiến tạo những giá trị bền vững.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact" 
              className="btn bg-secondary text-white hover:bg-orange-600 flex items-center gap-2 shadow-xl shadow-orange-900/20 px-8 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-1"
            >
              Liên hệ tư vấn ngay <ArrowLeft size={20} className="rotate-180" />
            </Link>
            <Link 
              to="/products" 
              className="btn bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white hover:text-primary px-8 py-3 rounded-xl font-bold transition-all"
            >
              Xem năng lực sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && project?.details?.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={32} />
            </button>
            
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft size={32} />
            </button>

            <motion.img
              key={currentImageIndex}
              src={getImageUrl(project.details.gallery[currentImageIndex])}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />

            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight size={32} />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {currentImageIndex + 1} / {project.details.gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
