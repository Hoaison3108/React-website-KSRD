import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Navigation, CheckCircle2 } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { saveContactMessage } from '../utils/firestoreUtils';

export default function Contact() {
  const { settings } = useSiteSettings();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: ''
  });

  const contactInfo = settings?.contactInfo || {
    address: 'Km09 QL28B - xã Lương Sơn - tỉnh Lâm Đồng',
    phone: '091.7630.863',
    email: 'chautm@rangdonggroup.vn'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      await saveContactMessage({
        ...formData,
        email: '' // Home page form doesn't have email field in current UI, adding empty string
      });
      setFormStatus('success');
      setFormData({ name: '', phone: '', service: '', message: '' });
      // Reset after 5 seconds
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="section-padding bg-gray-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="heading-xl dark:text-white mb-4">
            KẾT NỐI VỚI <span className="text-secondary">CHÚNG TÔI</span>
          </h2>
          <p className="text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và cung cấp những giải pháp vật liệu tối ưu nhất cho công trình của bạn.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Info & Map */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Info Cards */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
              <div className="space-y-8">
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Phone size={24} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1 tracking-wider">Hotline kinh doanh</span>
                    <a href={`tel:${contactInfo.phone.replace(/\./g, '')}`} className="text-xl text-gray-800 dark:text-white font-bold hover:text-primary transition-colors">
                      {contactInfo.phone} <span className="text-sm font-normal text-gray-500">(Mr.Châu)</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Mail size={24} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1 tracking-wider">Email tư vấn</span>
                    <a href={`mailto:${contactInfo.email}`} className="text-lg text-gray-800 dark:text-white font-bold hover:text-primary transition-colors break-all">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1 tracking-wider">Trụ sở chính</span>
                    <p className="text-lg text-gray-800 dark:text-white font-bold leading-snug">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="flex-grow min-h-[300px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-700 relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18729.250193309705!2d108.3445424!3d11.263886950000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3176b914d0ff59ff%3A0x78d91f4b843fe477!2zQ8OUTkcgVFkgS0hPw4FORyBT4bqiTiBS4bqgTkcgxJDDlE5HLiAoTeG7jyDEkcOhIE7DumkgRMOieSk!5e1!3m2!1svi!2s!4v1767688366248!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full transition-all duration-500"
              ></iframe>
              
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=Khoáng+Sản+Rạng+Đông+78CR%2BC2+Bắc+Bình+Bình+Thuận"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto hover:bg-primary hover:text-white border border-gray-100 dark:border-slate-700"
                >
                  <Navigation size={14} /> CHỈ ĐƯỜNG
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Gửi yêu cầu báo giá</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
                Điền thông tin vào biểu mẫu bên dưới, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
              </p>
              
              {formStatus === 'success' ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-300">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Gửi thành công!</h4>
                  <p className="text-green-700 dark:text-green-400">
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.
                  </p>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {formStatus === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
                      Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Họ và tên <span className="text-red-500">*</span></label>
                      <input 
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text" 
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-primary/10 transition-all dark:text-white placeholder:text-gray-400" 
                        placeholder="Nguyễn Văn A" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Số điện thoại <span className="text-red-500">*</span></label>
                      <input 
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        type="tel" 
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-primary/10 transition-all dark:text-white placeholder:text-gray-400" 
                        placeholder="090 123 4567" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Dịch vụ quan tâm</label>
                    <div className="relative">
                      <select 
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-primary/10 transition-all dark:text-white appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Chọn dịch vụ...</option>
                        <option value="be-tong">Bê tông thương phẩm</option>
                        <option value="da-xay-dung">Đá xây dựng các loại</option>
                        <option value="gach-khong-nung">Gạch không nung</option>
                        <option value="khac">Khác</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Lời nhắn</label>
                    <textarea 
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-primary/10 transition-all h-40 resize-none dark:text-white placeholder:text-gray-400" 
                      placeholder="Tôi cần báo giá 500m3 bê tông M300 tại..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={formStatus === 'submitting'}
                    className={`w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl uppercase transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transform hover:-translate-y-1 flex items-center justify-center gap-2 ${formStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ĐANG GỬI...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> GỬI YÊU CẦU NGAY
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
