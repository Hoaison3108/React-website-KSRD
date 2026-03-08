import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const routeNameMap: Record<string, string> = {
  'about': 'Giới thiệu',
  'products': 'Sản phẩm',
  'projects': 'Dự án',
  'news': 'Tin tức',
  'contact': 'Liên hệ',
  'recruitment': 'Tuyển dụng',
  'gallery': 'Thư viện ảnh',
};

interface BreadcrumbProps {
  customLastSegment?: string;
}

export default function Breadcrumb({ customLastSegment }: BreadcrumbProps) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't render on home page
  if (pathnames.length === 0) return null;

  return (
    <div className="bg-gray-100 dark:bg-slate-800 py-3 border-b border-gray-200 dark:border-slate-700">
      <div className="container-custom">
        <nav className="flex items-center text-sm text-gray-500 dark:text-slate-400">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            let name = routeNameMap[value] || value;

            if (isLast && customLastSegment) {
              name = customLastSegment;
            }

            return (
              <React.Fragment key={to}>
                <span className="mx-2">/</span>
                {isLast ? (
                  <span className="font-bold text-primary dark:text-blue-400">
                    {name}
                  </span>
                ) : (
                  <Link to={to} className="hover:text-primary transition-colors">
                    {name}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
