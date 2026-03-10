import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Vật Liệu Xây Dựng - Chất Lượng & Uy Tín',
  description = 'Cung cấp vật liệu xây dựng chất lượng cao, sắt thép, xi măng, gạch đá cho mọi công trình.',
  keywords = 'vật liệu xây dựng, sắt thép, xi măng, gạch, cát đá, xây dựng',
  image = 'https://picsum.photos/seed/construction/1200/630',
  url = window.location.href,
  type = 'website',
}) => {
  const siteTitle = `KSRD | ${title}`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
