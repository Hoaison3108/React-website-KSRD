import React from 'react';
import { Facebook, Youtube, MessageCircle, ChevronRight, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function Footer() {
  const { settings } = useSiteSettings();
  
  const links = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Về chúng tôi', path: '/about' },
    { label: 'Sản phẩm', path: '/products' },
    { label: 'Dự án', path: '/projects' },
    { label: 'Tin tức', path: '/news' },
    { label: 'Liên hệ', path: '/contact' },
  ];

  const contactInfo = settings?.contactInfo || {
    address: 'Km09 QL28B - xã Lương Sơn - tỉnh Lâm Đồng',
    phone: '091.7630.863 (Mr.Châu)',
    email: 'chautm@rangdonggroup.vn'
  };

  return (
    <footer className="bg-bg-footer text-white pt-24 pb-8">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Col 1: Logo & Desc */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-xl">
                RĐ
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-white uppercase leading-none">KHOÁNG SẢN</span>
                <span className="text-xs font-bold text-secondary uppercase leading-none mt-1">RẠNG ĐÔNG</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Khoáng Sản Rạng Đông đồng hành cùng mọi công trình trọng điểm với các sản phẩm từ khai thác khoáng sản tự nhiên và bê tông chất lượng cao.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-lg font-extrabold text-secondary uppercase tracking-wider mb-8">LIÊN KẾT</h4>
            <ul className="space-y-4">
              {links.map((item, index) => (
                <li key={index}>
                  <Link to={item.path} className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-all hover:translate-x-1">
                    <ChevronRight size={14} className="text-secondary" /> {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/recruitment" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-all hover:translate-x-1">
                  <ChevronRight size={14} className="text-secondary" /> Tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-all hover:translate-x-1">
                  <ChevronRight size={14} className="text-secondary" /> Thư viện hình ảnh
                </Link>
              </li>
              <li>
                <a href="/files/HoSoNangLuc_RangDong.pdf" download="HoSoNangLuc_RangDong.pdf" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-all hover:translate-x-1">
                  <ChevronRight size={14} className="text-secondary" /> Hồ sơ năng lực
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="text-lg font-extrabold text-secondary uppercase tracking-wider mb-8">THÔNG TIN</h4>
            <ul className="space-y-6">
              <li className="flex gap-4 text-gray-400 text-sm">
                <MapPin size={20} className="text-secondary shrink-0" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex gap-4 text-gray-400 text-sm">
                <Phone size={20} className="text-secondary shrink-0" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex gap-4 text-gray-400 text-sm">
                <Mail size={20} className="text-secondary shrink-0" />
                <span>{contactInfo.email}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-lg font-extrabold text-secondary uppercase tracking-wider mb-8">NHẬN BÁO GIÁ</h4>
            <p className="text-gray-400 text-sm mb-4">
              Nhận thông tin báo giá và ưu đãi mới nhất từ chúng tôi.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="flex-1 bg-white p-4 rounded-l-md text-gray-800 text-sm outline-none"
              />
              <button className="bg-primary hover:bg-primary-dark text-white px-5 rounded-r-md transition-colors">
                <ChevronRight size={20} />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© 2026 Công Ty TNHH Khoáng Sản Rạng Đông. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
