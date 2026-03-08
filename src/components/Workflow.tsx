import React from 'react';
import { motion } from 'motion/react';

import { workflowSteps } from '../data/workflow';

export default function Workflow() {
  return (
    <section className="section-padding bg-white dark:bg-slate-900">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-subtitle">CHUYÊN NGHIỆP VÀ TẬN TÂM</span>
            <h2 className="heading-xl text-gray-900 mb-0 dark:text-white">QUY TRÌNH LÀM VIỆC</h2>
          </div>
          <p className="text-gray-600 dark:text-slate-300 max-w-md text-left md:text-right">
            Chúng tôi tối ưu hóa mọi công đoạn để đảm bảo chất lượng vật liệu tốt nhất đến chân công trình.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-800 p-8 rounded-lg relative hover:-translate-y-2 hover:bg-blue-100 dark:hover:bg-slate-700 hover:shadow-xl transition-all duration-300 group"
            >
              <span className="absolute top-1 left-5 text-7xl font-black text-primary/5 dark:text-white/5 select-none transition-all duration-300 group-hover:-top-7 group-hover:text-primary/10">
                {step.id}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 relative z-10 pt-4">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm relative z-10">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
