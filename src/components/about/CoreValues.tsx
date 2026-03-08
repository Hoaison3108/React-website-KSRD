import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Users, Leaf, Lightbulb } from 'lucide-react';

import { coreValues } from '../../data/coreValues';

export default function CoreValues() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-slate-800 py-16 md:py-24">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Triết lý kinh doanh</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4">
            GIÁ TRỊ <span className="text-secondary">CỐT LÕI</span>
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 group hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-blue-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                <item.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-primary dark:text-white mb-3 group-hover:text-secondary transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
