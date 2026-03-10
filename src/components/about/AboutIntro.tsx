import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export default function AboutIntro() {
  return (
    <section className="section-padding bg-white dark:bg-slate-900 py-16 md:py-24">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Content Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-6 leading-tight">
              Câu chuyện thương hiệu <span className="text-secondary"></span>
            </h2>
            <p className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed text-justify">
              Khởi đầu từ một mỏ khai thác đá quy mô nhỏ tại Bình Thuận, Khoáng Sản Rạng Đông đã không ngừng nỗ lực để mở rộng quy mô và nâng cao chất lượng sản phẩm. Chúng tôi hiểu rằng, mỗi viên đá, mỗi mét khối bê tông đều là nền tảng cho sự an toàn và thịnh vượng của các công trình.
            </p>
            <p className="text-gray-600 dark:text-slate-300 mb-8 leading-relaxed text-justify">
              Với phương châm 'Chất lượng tạo niềm tin', chúng tôi đã đầu tư mạnh mẽ vào dây chuyền nghiền sàng hiện đại của Nhật Bản và hệ thống trạm trộn bê tông tự động hóa hoàn toàn. Đến nay, Rạng Đông tự hào là đối tác chiến lược của nhiều dự án hạ tầng trọng điểm quốc gia.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Công nghệ khai thác hiện đại",
                "Đội ngũ kỹ sư chuyên nghiệp",
                "Quy trình kiểm soát chất lượng ISO",
                "Cam kết bảo vệ môi trường"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="text-secondary w-5 h-5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-200 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Images Grid Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 grid grid-cols-[3fr_2fr] grid-rows-2 gap-4 h-[400px] md:h-[500px]"
          >
            <div className="row-span-2 rounded-2xl overflow-hidden shadow-lg relative group">
              <img 
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop" 
                alt="Khai thác khoáng sản" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-bold text-lg">Khai thác mỏ</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg relative group">
              <img 
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop" 
                alt="Công trình xây dựng" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-bold text-lg">Công trình xây dựng</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg relative group">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop" 
                alt="Vật liệu xây dựng" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-bold text-lg">Vật liệu xây dựng</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
