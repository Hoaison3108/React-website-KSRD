import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, DollarSign, Send, ArrowLeft, Calendar, User, CheckCircle2, Phone, Mail } from 'lucide-react';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import Breadcrumb from '../components/Breadcrumb';
import SEO from '../components/SEO';
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

export default function RecruitmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [otherJobs, setOtherJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Try fetching from Firestore first
        const docRef = doc(db, 'recruitment', id);
        const docSnap = await getDoc(docRef);
        
        let fetchedJob: Job | null = null;

        if (docSnap.exists()) {
          fetchedJob = { id: docSnap.id, ...docSnap.data() } as Job;
        } else {
          // Fallback to local data
          const local = localJobs.find(j => j.id.toString() === id);
          if (local) {
            fetchedJob = {
              ...local,
              id: local.id.toString()
            } as any;
          }
        }

        if (fetchedJob) {
          setJob(fetchedJob);
          
          // Fetch other jobs
          const q = query(collection(db, 'recruitment'), limit(5));
          const querySnapshot = await getDocs(q);
          const listFromFirestore = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Job))
            .filter(j => j.id !== id);
          
          // Combine with local jobs for "Other Jobs"
          const combinedOthers = [...listFromFirestore];
          localJobs.forEach(lj => {
            if (lj.id.toString() !== id && !combinedOthers.find(cr => cr.title === lj.title)) {
              combinedOthers.push({ ...lj, id: lj.id.toString() } as any);
            }
          });

          setOtherJobs(combinedOthers.slice(0, 5));
        } else {
          setJob(null);
        }
      } catch (error) {
        console.error("Error fetching job detail:", error);
        // Fallback to local data on error
        const local = localJobs.find(j => j.id.toString() === id);
        if (local) {
          setJob({ ...local, id: local.id.toString() } as any);
          setOtherJobs(localJobs.filter(j => j.id.toString() !== id).slice(0, 5) as any);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy tin tuyển dụng</h2>
        <Link to="/recruitment" className="text-primary hover:underline flex items-center">
          <ArrowLeft size={20} className="mr-2" /> Quay lại trang tuyển dụng
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50 dark:bg-slate-900 font-sans">
      <SEO 
        title={`${job.title} - Tuyển dụng`} 
        description={`Tuyển dụng ${job.title} tại ${job.location}. Lương ${job.salary}. Ứng tuyển ngay!`}
      />
      <Breadcrumb customLastSegment={job.title} />

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
              {/* Header */}
              <div className="p-8 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-800">
                <h1 className="text-3xl font-bold text-primary dark:text-blue-400 mb-4">{job.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
                    <MapPin size={18} className="text-secondary" /> {job.location}
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
                    <DollarSign size={18} className="text-secondary" /> {job.salary}
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
                    <Clock size={18} className="text-secondary" /> {job.type}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8">
                {/* General Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Kinh nghiệm</p>
                    <p className="font-bold text-gray-800 dark:text-white">{job.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bằng cấp</p>
                    <p className="font-bold text-gray-800 dark:text-white">{job.education}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Số lượng tuyển</p>
                    <p className="font-bold text-gray-800 dark:text-white">{job.quantity} người</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Giới tính</p>
                    <p className="font-bold text-gray-800 dark:text-white">{job.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hạn nộp hồ sơ</p>
                    <p className="font-bold text-red-500">{job.deadline}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 border-l-4 border-primary pl-3">
                    Mô tả công việc
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {job.desc}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 border-l-4 border-primary pl-3">
                    Yêu cầu ứng viên
                  </h3>
                  <ul className="space-y-3">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                        <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 border-l-4 border-primary pl-3">
                    Quyền lợi được hưởng
                  </h3>
                  <ul className="space-y-3">
                    {job.benefits.map((ben, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                        <CheckCircle2 size={20} className="text-secondary shrink-0 mt-0.5" />
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Info in Content */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-bold text-primary dark:text-blue-400 mb-4">Cách thức ứng tuyển</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Ứng viên quan tâm vui lòng gửi CV về email hoặc liên hệ trực tiếp:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <User size={20} className="text-secondary" />
                      <span className="font-bold">{job.contactName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <Mail size={20} className="text-secondary" />
                      <a href={`mailto:${job.contactEmail}`} className="hover:text-primary font-medium">{job.contactEmail}</a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <Phone size={20} className="text-secondary" />
                      <a href={`tel:${job.contactPhone.replace(/\./g, '')}`} className="hover:text-primary font-medium">{job.contactPhone}</a>
                    </div>
                  </div>
                  <div className="mt-6">
                    <a 
                      href={`mailto:${job.contactEmail}?subject=Ứng tuyển vị trí ${job.title}`}
                      className="inline-flex items-center justify-center w-full md:w-auto gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 transform hover:-translate-y-1"
                    >
                      <Send size={18} /> GỬI CV NGAY
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Summary Card */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Tóm tắt công việc</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Ngày đăng</span>
                    <span className="font-medium text-gray-800 dark:text-white">06/03/2026</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Cấp bậc</span>
                    <span className="font-medium text-gray-800 dark:text-white">Nhân viên</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Ngành nghề</span>
                    <span className="font-medium text-gray-800 dark:text-white">Xây dựng</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Hình thức</span>
                    <span className="font-medium text-gray-800 dark:text-white">{job.type}</span>
                  </div>
                </div>
                <a 
                  href={`mailto:${job.contactEmail}?subject=Ứng tuyển vị trí ${job.title}`}
                  className="mt-6 w-full btn bg-secondary hover:bg-orange-600 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Send size={18} /> ỨNG TUYỂN NGAY
                </a>
              </div>

              {/* Other Jobs */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Vị trí khác</h3>
                <div className="space-y-4">
                  {otherJobs.map(otherJob => (
                    <Link key={otherJob.id} to={`/recruitment/${otherJob.id}`} className="block group">
                      <div className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <h4 className="font-bold text-gray-800 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{otherJob.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin size={12} /> {otherJob.location}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-secondary font-medium mt-1">
                          <DollarSign size={12} /> {otherJob.salary}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/recruitment" className="block text-center text-sm text-primary font-bold mt-4 hover:underline">
                  Xem tất cả việc làm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
