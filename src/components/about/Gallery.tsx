import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import { galleryImages } from '../../data/gallery';

export default function Gallery() {
  return (
    <section className="section-padding bg-white dark:bg-slate-900 py-16 md:py-24">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Thư viện hình ảnh</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4">
            HÌNH ẢNH <span className="text-secondary">HOẠT ĐỘNG</span>
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="pb-4"
        >
          {galleryImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="rounded-2xl overflow-hidden h-[280px] shadow-lg group cursor-pointer relative">
                <img 
                  src={img} 
                  alt={`Hoạt động ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
