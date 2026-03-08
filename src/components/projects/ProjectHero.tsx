import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';

export default function ProjectHero() {
  const featured = projects.find(p => p.featured) || projects[0];

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={featured.image} 
          alt={featured.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      </div>

      <div className="container-custom relative h-full flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white"
        >
          <span className="inline-block px-4 py-1 bg-secondary text-white text-xs font-bold uppercase tracking-widest mb-6 rounded">
            Dự án tiêu biểu
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {featured.title}
          </h1>
          <p className="text-lg text-gray-300 mb-8 line-clamp-3">
            {featured.desc}
          </p>

          <div className="flex flex-wrap gap-8 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <MapPin size={20} className="text-secondary" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Địa điểm</p>
                <p className="font-medium">{featured.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Calendar size={20} className="text-secondary" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Thời gian</p>
                <p className="font-medium">{featured.year}</p>
              </div>
            </div>
          </div>

          <Link to={`/projects/${featured.id}`} className="btn btn-primary flex items-center gap-2 group">
            Chi tiết dự án
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 w-1/3 h-24 bg-secondary/20 backdrop-blur-md hidden lg:block" style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
    </section>
  );
}
