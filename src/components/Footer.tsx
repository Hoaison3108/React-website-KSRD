import React, { useState } from 'react';
import { Facebook, Youtube, MessageCircle, ChevronRight, MapPin, Phone, Mail, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import Toast from './Toast';

export default function Footer() {
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  const links = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Giới thiệu', path: '/about' },
    { label: 'Sản phẩm', path: '/products' },
    { label: 'Dự án', path: '/projects' },
    { label: 'Tin tức', path: '/news' },
    { label: 'Liên hệ', path: '/contact' },
  ];

  const contactInfo = settings?.footerInfo || {
    address: 'Km09 QL28B - xã Lương Sơn - tỉnh Lâm Đồng',
    phone: '0252 652 6666',
    email: 'khoangsanrangdong@rangdonggroup.vn',
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);

    try {
      await addDoc(collection(db, 'messages'), {
        name: 'Khách hàng nhận báo giá',
        email: email,
        phone: 'N/A',
        subject: 'Yêu cầu nhận báo giá từ Footer',
        message: `Khách hàng muốn nhận báo giá qua email: ${email}`,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      
      setToast({
        show: true,
        message: 'Yêu cầu nhận báo giá của bạn đã được gửi thành công!',
        type: 'success'
      });
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      setToast({
        show: true,
        message: 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-bg-footer text-white pt-24 pb-8">
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
      <div className="container-custom">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          {/* Col 1: Logo & Desc */}
          <div className="lg:col-span-3 lg:pr-8">
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
          <div className="lg:col-span-2">
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
          <div className="lg:col-span-4">
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
                <span className="break-all">{contactInfo.email}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 lg:pl-4">
            <h4 className="text-lg font-extrabold text-secondary uppercase tracking-wider mb-8">NHẬN BÁO GIÁ</h4>
            <p className="text-gray-400 text-sm mb-4">
              Nhận thông tin báo giá và ưu đãi mới nhất từ chúng tôi.
            </p>
            <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
              <div className="flex">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn..." 
                  className="flex-1 bg-white p-4 rounded-l-md text-gray-800 text-sm outline-none"
                  disabled={loading}
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary-dark text-white px-5 rounded-r-md transition-colors flex items-center justify-center min-w-[60px]"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <ChevronRight size={20} />}
                </button>
              </div>
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
