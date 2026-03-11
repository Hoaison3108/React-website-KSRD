export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
}

export interface Category {
  id?: string; // Document ID
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: any; // Firestore Timestamp
  updatedAt: any;
}

export interface Product {
  id?: string; // Document ID
  name: string;
  slug: string;
  categoryId: string; // Tham chiếu tới Category
  price: number;
  unit: string;
  description?: string;
  images: string[];
  stock: number;
  isActive: boolean;
  seo?: SEOData;
  createdAt: any;
  updatedAt: any;
}

export interface Article {
  id?: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  authorId: string;
  tags?: string[];
  isPublished: boolean;
  publishedAt?: any;
  seo?: SEOData;
  createdAt: any;
  updatedAt: any;
}

export interface User {
  uid: string; // Document ID === Auth UID
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'admin' | 'editor' | 'customer';
  address?: string;
  createdAt: any;
  lastLoginAt: any;
}

export interface QuoteRequest {
  id?: string;
  customerName: string;
  phone: string;
  email?: string;
  message: string;
  status: 'pending' | 'contacted' | 'resolved';
  createdAt: any;
}
