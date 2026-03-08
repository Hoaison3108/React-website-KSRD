import React from 'react';

import { stats } from '../data/stats';

export default function Stats() {
  return (
    <section className="bg-primary py-16 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-extrabold text-secondary mb-2">
                {stat.value}
              </span>
              <span className="text-base md:text-lg font-semibold uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
