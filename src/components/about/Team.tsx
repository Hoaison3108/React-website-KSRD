import React from 'react';
import { motion } from 'motion/react';

import { teamMembers } from '../../data/team';

export default function Team() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-slate-800 py-16 md:py-24">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Đội ngũ lãnh đạo</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4">
            BAN <span className="text-secondary">LÃNH ĐẠO</span>
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-700 relative"
            >
              <div className="relative h-[300px] overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                </div>
              </div>
              
              <div className="p-6 text-center relative z-10 bg-white dark:bg-slate-900">
                <h3 className="text-xl font-bold text-primary dark:text-white mb-1 group-hover:text-secondary transition-colors">
                  {member.name}
                </h3>
                <div className="w-8 h-0.5 bg-gray-300 mx-auto mb-2 group-hover:w-12 group-hover:bg-secondary transition-all duration-300"></div>
                <span className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">
                  {member.role}
                </span>
              </div>
              
              {/* Bottom Line Animation */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
