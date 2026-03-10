import React from 'react';
import { motion } from 'motion/react';
import { FileDown } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="section-padding bg-white dark:bg-slate-900">
      <div className="container-custom flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        {/* Media Side */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 relative"
        >
          <div className="relative max-w-[536px] mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-square">
              <img 
                src="https://github.com/Hoaison3108/khoangsanrangdongdemov3/blob/main/assets/images/DJI_0057.JPG?raw=true" 
                alt="Về chúng tôi" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Quote Box */}
            <div className="hidden md:flex flex-col justify-center absolute -bottom-8 -right-8 lg:-bottom-10 lg:-right-10 bg-primary p-6 lg:p-8 rounded-3xl border-8 border-white dark:border-slate-800 shadow-xl w-48 lg:w-64 aspect-square z-10">
              <span className="text-4xl lg:text-5xl text-secondary font-extrabold leading-none">“</span>
              <p className="text-white italic text-xs lg:text-sm mb-1 lg:mb-2 leading-relaxed">
                "Chúng tôi không chỉ bán vật liệu, chúng tôi xây dựng sự an tâm cho khách hàng."
              </p>
              <p className="text-secondary font-bold text-[10px] lg:text-xs uppercase tracking-wider">— TỔNG GIÁM ĐỐC</p>
            </div>
          </div>
        </motion.div>

        {/* Content Side */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2"
        >
          <span className="text-subtitle">VỀ CHÚNG TÔI</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
            Công Ty TNHH Khoáng Sản <br /> Rạng Đông
          </h2>
          
          <p className="text-gray-600 dark:text-slate-300 text-base leading-relaxed mb-8 text-justify">
            Công ty TNHH Khoáng sản Rạng Đông được thành lập và hoạt động theo giấy chứng nhận đăng ký kinh doanh số 3401063933 do Sở kế hoạch và Đầu tư tỉnh Bình Thuận cấp. Hoạt động trong lĩnh vực Khai thác khoáng sản; Sản xuất vật liệu xây dựng; Sản xuất bê tông... Chúng tôi cam kết mang lại những giá trị thực chất thông qua chất lượng sản phẩm và tinh thần phục vụ tận tâm.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <span className="w-4 h-4 rounded-full bg-primary"></span>
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white font-bold mb-1">TIÊU CHUẨN ISO</strong>
                <span className="text-sm text-gray-600 dark:text-slate-400">Đạt chứng chỉ ISO 9001:2015 cho mọi quy trình.</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <span className="w-4 h-4 rounded-full bg-secondary"></span>
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white font-bold mb-1">KHAI THÁC XANH</strong>
                <span className="text-sm text-gray-600 dark:text-slate-400">Giảm thiểu tác động môi trường theo tiêu chuẩn.</span>
              </div>
            </div>
          </div>

          <a 
            href="/files/HoSoNangLuc_RangDong.pdf" 
            download="HoSoNangLuc_RangDong.pdf"
            className="btn btn-primary gap-2"
          >
            <FileDown size={18} />
            TẢI HỒ SƠ NĂNG LỰC
          </a>
        </motion.div>
      </div>
    </section>
  );
}
