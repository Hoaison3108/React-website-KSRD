import React from 'react';
import { motion } from 'motion/react';

import { milestones } from '../../data/milestones';

export default function Timeline() {
  return (
    <section className="section-padding bg-white dark:bg-slate-900 py-16 md:py-24 overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Chặng đường phát triển</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4">
            LỊCH SỬ <span className="text-secondary">HÌNH THÀNH</span>
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 dark:bg-slate-700 transform md:-translate-x-1/2 rounded-full"></div>

          <div className="space-y-12">
            {milestones.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
              >
                {/* Content */}
                <div className={`w-full md:w-1/2 pl-12 mb-4 md:mb-0 ${index % 2 === 0 ? 'md:pl-0 md:pr-12' : 'md:pl-12 md:pr-0'}`}>
                  <div className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 relative hover:shadow-xl transition-shadow duration-300 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <span className={`text-4xl font-black text-gray-100 dark:text-slate-700 absolute top-2 select-none z-0 ${index % 2 === 0 ? '-right-4 md:right-4' : '-right-4 md:left-4 md:right-auto'}`}>
                      {item.year}
                    </span>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-primary dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-6 h-6 bg-white dark:bg-slate-900 border-4 border-secondary rounded-full transform -translate-x-1/2 z-10 shadow-lg"></div>

                {/* Empty Space for alignment */}
                <div className="w-full md:w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
