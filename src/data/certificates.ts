import React from 'react';
import { ShieldCheck, FileCheck, Award, Star } from 'lucide-react';

export const certificates = [
  {
    id: 1,
    title: "Chứng nhận ISO 9001:2015",
    issuer: "Tổ chức Tiêu chuẩn hóa Quốc tế",
    year: "2023",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&h=800&auto=format&fit=crop",
    icon: React.createElement(ShieldCheck, { className: "w-6 h-6 text-primary" })
  },
  {
    id: 2,
    title: "Chứng nhận TCVN 7570:2006",
    issuer: "Bộ Khoa học và Công nghệ Việt Nam",
    year: "2022",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&h=800&auto=format&fit=crop",
    icon: React.createElement(FileCheck, { className: "w-6 h-6 text-secondary" })
  },
  {
    id: 3,
    title: "Bằng khen Doanh nghiệp Tiêu biểu",
    issuer: "UBND Tỉnh Bình Thuận",
    year: "2023",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&h=800&auto=format&fit=crop",
    icon: React.createElement(Award, { className: "w-6 h-6 text-yellow-500" })
  },
  {
    id: 4,
    title: "Chứng nhận Sản phẩm Chất lượng Cao",
    issuer: "Hiệp hội Vật liệu Xây dựng Việt Nam",
    year: "2021",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&h=800&auto=format&fit=crop",
    icon: React.createElement(Star, { className: "w-6 h-6 text-orange-500" })
  }
];
