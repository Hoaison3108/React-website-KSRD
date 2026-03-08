import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, limit, where } from 'firebase/firestore';
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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // Try to fetch featured projects first
        let q = query(collection(db, 'projects'), where('featured', '==', true), limit(3));
        let querySnapshot = await getDocs(q);

        // If no featured projects, fetch recent ones
        if (querySnapshot.empty) {
          q = query(collection(db, 'projects'), limit(3));
          querySnapshot = await getDocs(q);
        }

        const fetchedProjects = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
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
          } as Project;
        });

        // Combine local projects with fetched projects
        const combined = [...localProjects];
        fetchedProjects.forEach(fp => {
          if (!combined.find(lp => lp.title === fp.title)) {
            combined.push(fp as any);
          }
        });

        // Filter for featured projects to display on home
        const featured = combined.filter(p => p.featured).slice(0, 3);
        setProjects(featured as any);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects(localProjects.filter(p => p.featured).slice(0, 3) as any);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getImageUrl = (image: any) => {
    if (typeof image === 'string') return image;
    return '';
  };

  if (loading) {
    return (
      <section id="projects" className="section-padding bg-white dark:bg-slate-900">
        <div className="container-custom text-center">
          <p>Đang tải dự án...</p>
        </div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="section-padding bg-white dark:bg-slate-900">
      <div className="container-custom flex flex-col lg:flex-row gap-12 lg:gap-28">
        {/* Info Side */}
        <div className="lg:w-[42%] flex flex-col">
          <span className="text-subtitle">NIỀM TỰ HÀO NGHỀ NGHIỆP</span>
          <h2 className="heading-xl dark:text-white">
            DẤU ẤN TRÊN MỌI <br /> <span className="text-secondary">CÔNG TRÌNH</span>
          </h2>

          <div className="flex flex-col gap-6 mb-8">
            {projects.map((project, index) => (
              <Link to={`/projects/${project.id}`} key={index} className="border border-gray-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-800 hover:border-primary hover:shadow-md transition-all cursor-pointer group block">
                <h4 className="text-sm font-bold text-primary dark:text-blue-400 uppercase mb-2 group-hover:text-secondary transition-colors">
                  {project.title}
                </h4>
                <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                  {project.desc}
                </p>
              </Link>
            ))}
          </div>

          <Link to="/projects" className="inline-flex items-center gap-4 group mt-auto">
            <span className="font-extrabold text-xs text-primary dark:text-blue-400 uppercase group-hover:text-secondary transition-colors">
              XEM TẤT CẢ DỰ ÁN
            </span>
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:bg-primary-dark">
              <ChevronRight size={18} />
            </div>
          </Link>
        </div>

        {/* Gallery Side */}
        <div className="lg:w-[58%] flex gap-4 h-[500px] lg:h-[600px]">
          {projects[0] && (
            <Link to={`/projects/${projects[0].id}`} className="flex-[1.5] h-full rounded-xl overflow-hidden shadow-xl relative group block">
              <img 
                src={getImageUrl(projects[0].image)} 
                alt="Project Large" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-white font-bold text-lg mb-2">{projects[0].title}</span>
                <span className="text-white text-sm opacity-50 line-clamp-3">{projects[0].desc}</span>
              </div>
            </Link>
          )}
          <div className="flex-1 flex flex-col gap-4 h-full">
            {projects[1] && (
              <Link to={`/projects/${projects[1].id}`} className="flex-1 rounded-xl overflow-hidden shadow-xl relative group block">
                <img 
                  src={getImageUrl(projects[1].image)} 
                  alt="Project Small 1" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-white font-bold text-lg mb-2">{projects[1].title}</span>
                  <span className="text-white text-sm opacity-50 line-clamp-3">{projects[1].desc}</span>
                </div>
              </Link>
            )}
            {projects[2] && (
              <Link to={`/projects/${projects[2].id}`} className="flex-1 rounded-xl overflow-hidden shadow-xl relative group block">
                <img 
                  src={getImageUrl(projects[2].image)} 
                  alt="Project Small 2" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-white font-bold text-lg mb-2">{projects[2].title}</span>
                  <span className="text-white text-sm opacity-50 line-clamp-3">{projects[2].desc}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
