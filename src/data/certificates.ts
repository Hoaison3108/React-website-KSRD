import React from 'react';
import { ShieldCheck, FileCheck, Award, Star } from 'lucide-react';

export const certificates = [
  {
    id: 1,
    title: "Chứng nhận ISO 9001:2015",
    issuer: "Tổ chức Tiêu chuẩn hóa Quốc tế",
    year: "2023",
    image: "https://picsum.photos/seed/iso-9001/600/800",
    icon: React.createElement(ShieldCheck, { className: "w-6 h-6 text-primary" })
  },
  {
    id: 2,
    title: "Chứng nhận TCVN 7570:2006",
    issuer: "Bộ Khoa học và Công nghệ Việt Nam",
    year: "2022",
    image: "https://picsum.photos/seed/tcvn/600/800",
    icon: React.createElement(FileCheck, { className: "w-6 h-6 text-secondary" })
  },
  {
    id: 3,
    title: "Bằng khen Doanh nghiệp Tiêu biểu",
    issuer: "UBND Tỉnh Bình Thuận",
    year: "2023",
    image: "https://picsum.photos/seed/award-1/600/800",
    icon: React.createElement(Award, { className: "w-6 h-6 text-yellow-500" })
  },
  {
    id: 4,
    title: "Chứng nhận Sản phẩm Chất lượng Cao",
    issuer: "Hiệp hội Vật liệu Xây dựng Việt Nam",
    year: "2021",
    image: "https://picsum.photos/seed/award-2/600/800",
    icon: React.createElement(Star, { className: "w-6 h-6 text-orange-500" })
  }
];
