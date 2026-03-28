import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Navigation } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'motion/react';
import { saveContactMessage } from '../utils/firestoreUtils';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập họ tên'),
  phone: z.string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^\d{10,11}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  service: z.string().optional(),
  message: z.string().min(1, 'Vui lòng nhập nội dung')
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: '',
      message: ''
    }
  });

  const baseInfo = settings?.contactPageInfo || settings?.footerInfo;
  const contactInfo = {
    address: baseInfo?.address || 'Km09 QL28B - xã Lương Sơn - tỉnh Lâm Đồng',
    phone: baseInfo?.phone || '0252 652 6666',
    email: baseInfo?.email || 'khoangsanrangdong@rangdonggroup.vn',
    workingHours: (settings?.contactPageInfo as any)?.workingHours || '7:00 - 17:00'
  };

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError(null);
    try {
      await saveContactMessage({
        ...data,
        email: data.email || '',
        service: data.service || ''
      });
      setIsSuccess(true);
      reset(); // Reset form sau khi gửi thành công
      
      // Xoá thông báo thành công sau 5 giây
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
    }
  };

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqs = [
    {
      question: "Quy trình báo giá mất bao lâu?",
      answer: "Thông thường, chúng tôi sẽ phản hồi yêu cầu báo giá trong vòng 2-4 giờ làm việc. Đối với các dự án phức tạp cần khảo sát thực tế, thời gian báo giá chi tiết sẽ từ 24-48 giờ."
    },
    {
      question: "Công ty có hỗ trợ vận chuyển không?",
      answer: "Có, Khoáng sản Rạng Đông sở hữu đội xe vận chuyển chuyên dụng (xe bồn bê tông, xe tải ben) đảm bảo giao hàng tận nơi đến chân công trình tại khu vực Bình Thuận - Lâm Đồng và các tỉnh lân cận."
    },
    {
      question: "Chính sách bảo hành sản phẩm như thế nào?",
      answer: "Tất cả sản phẩm của chúng tôi đều được cam kết chất lượng theo tiêu chuẩn TCVN. Chúng tôi bảo hành chất lượng bê tông và độ bền vật liệu theo hợp đồng ký kết cụ thể cho từng dự án."
    },
    {
      question: "Tôi có thể tham quan cơ sở trước khi đặt hàng không?",
      answer: "Hoàn toàn được. Chúng tôi luôn hoan nghênh Quý khách hàng đến tham quan quy trình sản xuất và kiểm soát chất lượng tại cơ sở để thêm tin tưởng vào năng lực của chúng tôi."
    }
  ];

  return (
    <div className="pt-[78px] min-h-screen bg-gray-50 dark:bg-slate-900 font-sans">
      <SEO 
        title="Liên hệ" 
        description="Kết nối với Khoáng Sản Rạng Đông để nhận tư vấn báo giá và giải pháp vật liệu xây dựng tối ưu nhất cho công trình của bạn. Hỗ trợ 24/7."
      />
      <Breadcrumb />
      
      {/* 1. Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop" 
            alt="Contact Hero" 
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/70" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 border border-secondary/50 text-secondary text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
            Hỗ trợ 24/7
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Liên hệ với <span className="text-secondary">Rạng Đông</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe và cung cấp những giải pháp vật liệu xây dựng tối ưu nhất cho công trình của bạn. Hãy kết nối ngay hôm nay!
          </p>
        </div>
      </section>

      {/* 2. Floating Contact Cards */}
      <section className="container-custom -mt-24 relative z-20 mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Hotline */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border-b-4 border-secondary hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <Phone size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Hotline Kinh Doanh</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Tư vấn báo giá & kỹ thuật</p>
            <a href={`tel:${contactInfo.phone.replace(/\./g, '')}`} className="text-2xl font-bold text-primary dark:text-blue-400 hover:text-secondary transition-colors">
              {contactInfo.phone}
            </a>
            <p className="text-sm text-gray-400 mt-2">(Mr. Châu)</p>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border-b-4 border-primary hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <Mail size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Email Hỗ Trợ</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Gửi yêu cầu hợp tác</p>
            <a href={`mailto:${contactInfo.email}`} className="text-lg font-bold text-primary dark:text-blue-400 hover:text-secondary transition-colors break-words">
              {contactInfo.email}
            </a>
            <p className="text-sm text-gray-400 mt-2">Phản hồi trong 24h</p>
          </div>

          {/* Card 3: Address */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border-b-4 border-green-500 hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <MapPin size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Trụ Sở Chính</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Văn phòng & Khu sản xuất</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white leading-snug">
              {contactInfo.address}
            </p>
            <p className="text-sm text-gray-400 mt-2">Giờ làm việc: {contactInfo.workingHours}</p>
          </div>
        </div>
      </section>

      {/* 3. Main Content: Form & Map */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
            {/* Left: Form */}
            <div className="lg:w-5/12 p-8 md:p-12 bg-white dark:bg-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="text-secondary" />
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gửi tin nhắn</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Yêu cầu báo giá</h2>
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-8 rounded-2xl text-center mb-8"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Gửi thành công!</h3>
                    <p className="text-green-700 dark:text-green-400">
                      Cảm ơn bạn đã quan tâm. Chúng tôi sẽ liên hệ lại sớm nhất có thể.
                    </p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="mt-6 text-sm font-bold text-green-800 dark:text-green-300 underline"
                    >
                      Gửi yêu cầu khác
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                      Vui lòng điền thông tin vào biểu mẫu bên dưới. Chuyên viên tư vấn của chúng tôi sẽ liên hệ lại với bạn sớm nhất.
                    </p>

                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                      {submitError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
                          <AlertCircle size={16} />
                          {submitError}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Họ tên <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            {...register('name')}
                            className={`w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white`} 
                            placeholder="Nhập họ tên" 
                          />
                          {errors.name && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.name.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Số điện thoại <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            {...register('phone')}
                            className={`w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white`} 
                            placeholder="Nhập SĐT" 
                          />
                          {errors.phone && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.phone.message as string}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Email</label>
                        <input 
                          type="email" 
                          {...register('email')}
                          className={`w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white`} 
                          placeholder="example@gmail.com" 
                        />
                        {errors.email && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.email.message as string}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Dịch vụ quan tâm</label>
                        <select 
                          {...register('service')}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                        >
                          <option value="">Chọn dịch vụ...</option>
                          <option value="betong">Bê tông thương phẩm</option>
                          <option value="gach">Gạch không nung</option>
                          <option value="catda">Cát đá xây dựng</option>
                          <option value="khac">Khác</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Nội dung <span className="text-red-500">*</span></label>
                        <textarea 
                          {...register('message')}
                          className={`w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border ${errors.message ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-32 resize-none dark:text-white`} 
                          placeholder="Nhập nội dung cần tư vấn..."
                        ></textarea>
                        {errors.message && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.message.message as string}</p>}
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full btn bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ĐANG XỬ LÝ...
                          </>
                        ) : (
                          <>
                            <Send size={18} /> GỬI YÊU CẦU
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Map */}
            <div className="lg:w-7/12 bg-gray-200 relative min-h-[400px] lg:min-h-full">
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
              
              {/* Map Overlay Info */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 dark:border-slate-700/50 hidden md:block max-w-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-secondary text-white rounded-lg flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white text-sm">Giờ làm việc</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Thứ 2 - Chủ nhật: {contactInfo.workingHours}</p>
                  </div>
                </div>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=Khoáng+Sản+Rạng+Đông+78CR%2BC2+Bắc+Bình+Bình+Thuận"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn bg-primary hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Navigation size={14} /> CHỈ ĐƯỜNG TRÊN GOOGLE MAPS
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Câu hỏi thường gặp</h2>
            <p className="text-gray-600 dark:text-gray-400">Giải đáp những thắc mắc phổ biến của khách hàng về sản phẩm và dịch vụ</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-2xl transition-all duration-300 ${
                  activeAccordion === index 
                    ? 'border-primary bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800' 
                    : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600'
                }`}
              >
                <button 
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className={`font-bold text-lg ${activeAccordion === index ? 'text-primary dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>
                    {faq.question}
                  </span>
                  {activeAccordion === index ? (
                    <ChevronUp className="text-primary" />
                  ) : (
                    <ChevronDown className="text-gray-400" />
                  )}
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    activeAccordion === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-dashed border-gray-200 dark:border-slate-700/50 mt-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
