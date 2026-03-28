import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishDate?: string;
  robots?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Vật Liệu Xây Dựng - Chất Lượng & Uy Tín',
  description = 'Cung cấp vật liệu xây dựng chất lượng cao, Bê tông thương phẩm, Bê tông nhựa nóng, Cống bê tông ly tâm - Cấu kiện đúc sẵn, Gạch bê tông, Đá xây dựng cho mọi công trình.',
  keywords = 'vật liệu xây dựng, Bê tông tươi, Bê tông nhựa nóng, Cống bê tông ly tâm - Cấu kiện đúc sẵn, Gạch bê tông, Đá xây dựng, xây dựng',
  image = 'https://picsum.photos/seed/construction/1200/630', // Lưu ý: Cần đường dẫn tuyệt đối (http...)
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  author = 'Công ty Khoáng sản Rạng Đông',
  publishDate,
  robots = 'index, follow', // Mặc định cho phép bot index và theo dõi link
}) => {
  // Tránh việc lặp lại tên thương hiệu nếu title đã chứa
  const siteTitle = title.includes('Công ty Khoáng Sản Rạng Đông') || title.includes('KSRD') 
    ? title 
    : `${title} | Công ty Khoáng Sản Rạng Đông`;
  const defaultTitle = 'Công ty Khoáng Sản Rạng Đông - Vật Liệu Xây Dựng';

  // Cấu trúc dữ liệu JSON-LD (Schema.org) tăng độ chuẩn SEO chuyên nghiệp
  const schemaOrgJSONLD = {
    '@context': 'http://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebSite',
    url: url,
    name: title,
    alternateName: defaultTitle,
    headline: title,
    description: description,
    image: image,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Công ty Khoáng sản Rạng Đông',
    },
    ...(publishDate && { datePublished: publishDate }),
  };

  return (
    <Helmet>
      {/* Chuẩn thẻ Meta cơ bản */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />

      {/* Canonical URL - Rất quan trọng để tránh trùng lặp nội dung */}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph / Facebook / Zalo */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Công ty Khoáng sản Rạng Đông" />
      <meta property="og:locale" content="vi_VN" />
      {type === 'article' && publishDate && <meta property="article:published_time" content={publishDate} />}
      {type === 'article' && author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@KhoangSanRangDong" />

      {/* Schema.org / JSON-LD - Giúp Google hiểu nội dung trang dễ hơn */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
    </Helmet>
  );
};

export default SEO;
