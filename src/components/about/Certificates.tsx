import React from 'react';
import { Award, ShieldCheck, FileCheck, Star } from 'lucide-react';
import { motion } from 'motion/react';

import { certificates } from '../../data/certificates';

export default function Certificates() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-slate-800">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Uy tín & Chất lượng</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4">
            CHỨNG CHỈ & <span className="text-secondary">CHỨNG NHẬN</span>
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-700 relative"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-slate-700">
                <img 
                  src={cert.image} 
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-xs font-medium leading-relaxed">
                    {cert.issuer} - {cert.year}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 text-center bg-white dark:bg-slate-900 relative z-10">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-slate-800 shadow-inner flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                    {React.cloneElement(cert.icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5 text-primary' })}
                  </div>
                </div>
                <h3 className="text-base font-bold text-primary dark:text-white group-hover:text-secondary transition-colors duration-300 leading-tight mb-1">
                  {cert.title}
                </h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cert.year}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 pt-12 border-t border-gray-200 dark:border-slate-700 flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tighter">ISO 9001:2015</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tighter">TCVN 7570</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tighter">TOP BRAND 2023</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
