import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import SEO from '../components/SEO';
import { Briefcase, MapPin, Clock, DollarSign, Send, Phone, ArrowRight } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { jobs as localJobs } from '../data/recruitment';

interface Job {
  id: string | number;
  title: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  desc: string;
  requirements: string[];
  benefits: string[];
  experience: string;
  education: string;
  quantity: number;
  gender: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, 'recruitment'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedJobs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Job[];
        
        // Combine local jobs with fetched jobs
        const combined = [...localJobs];
        fetchedJobs.forEach(fj => {
          if (!combined.find(lj => lj.title === fj.title)) {
            combined.push(fj as any);
          }
        });

        setJobs(combined as any);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs(localJobs as any);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50 dark:bg-slate-900">
      <SEO 
        title="Tuyển dụng" 
        description="Cơ hội nghề nghiệp tại Khoáng Sản Rạng Đông. Chúng tôi luôn chào đón những ứng viên tài năng gia nhập đội ngũ."
      />
      <Breadcrumb />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop" 
            alt="Recruitment Hero" 
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/70" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 border border-secondary/50 text-secondary text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
            Gia nhập đội ngũ
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Tuyển Dụng <span className="text-secondary">Nhân Tài</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Cùng Rạng Đông kiến tạo những giá trị bền vững. Môi trường làm việc chuyên nghiệp, chế độ đãi ngộ hấp dẫn.
          </p>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-16 container-custom">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Briefcase className="text-primary" /> Vị trí đang tuyển
            </h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <Link to={`/recruitment/${job.id}`} className="hover:text-primary transition-colors">
                      <h3 className="text-xl font-bold text-primary dark:text-blue-400">{job.title}</h3>
                    </Link>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full w-fit">
                      Hạn nộp: {job.deadline}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-secondary" /> {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-secondary" /> {job.type}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-secondary" /> {job.salary}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-sm uppercase">Mô tả công việc:</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">{job.desc}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-sm uppercase">Yêu cầu:</h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm space-y-1">
                      {job.requirements.slice(0, 3).map((req, idx) => (
                        <li key={idx} className="line-clamp-1">{req}</li>
                      ))}
                    </ul>
                  </div>

                  <Link 
                    to={`/recruitment/${job.id}`}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-bold transition-colors text-sm"
                  >
                    Ứng tuyển ngay <ArrowRight size={16} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl text-center border border-gray-100 dark:border-slate-700">
                <p className="text-gray-500 dark:text-gray-400">Hiện tại chưa có vị trí tuyển dụng nào.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Thông tin liên hệ</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Vui lòng gửi CV về email hoặc liên hệ trực tiếp phòng nhân sự.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-primary shrink-0">
                    <Send size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 uppercase font-bold">Email nhận CV</p>
                    <a href="mailto:khoangsanrangdong@rangdonggroup.vn" className="font-semibold text-gray-800 dark:text-white hover:text-primary text-[14px] sm:text-sm lg:text-[15px] xl:text-base tracking-tight transition-colors block break-all">
                      khoangsanrangdong@rangdonggroup.vn
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-primary shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Hotline Tuyển dụng</p>
                    <a href="tel:0917630863" className="font-semibold text-gray-800 dark:text-white hover:text-primary">091.7630.863</a>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
                <h4 className="font-bold text-gray-800 dark:text-white mb-3 text-sm">Quyền lợi chung</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-secondary rounded-full"></div> BHXH, BHYT theo quy định</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-secondary rounded-full"></div> Thưởng lễ, tết, lương tháng 13</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-secondary rounded-full"></div> Du lịch hàng năm</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-secondary rounded-full"></div> Môi trường làm việc năng động</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
