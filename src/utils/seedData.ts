import { collection, doc, setDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

export const DEFAULT_SETTINGS = {
  hero: {
    title: 'Giải Pháp Vật Liệu Xây Dựng Bền Vững',
    subtitle: 'Khoáng Sản Rạng Đông - Đồng hành cùng mọi công trình trọng điểm với chất lượng vượt trội và dịch vụ chuyên nghiệp.',
    backgroundImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop'
  },
  services: [
    {
      id: '1',
      title: 'Bê Tông Tươi',
      description: 'Cung cấp bê tông thương phẩm chất lượng cao cho các công trình dân dụng và công nghiệp.',
      icon: 'Layout'
    },
    {
      id: '2',
      title: 'Gạch Không Nung',
      description: 'Sản xuất gạch block, gạch tự chèn đạt tiêu chuẩn quốc tế, thân thiện môi trường.',
      icon: 'Info'
    },
    {
      id: '3',
      title: 'Khai Thác Khoáng Sản',
      description: 'Khai thác và chế biến cát, đá xây dựng với trữ lượng lớn và quy trình hiện đại.',
      icon: 'Phone'
    }
  ],
  contactInfo: {
    address: 'Km09 QL28B - xã Lương Sơn - tỉnh Lâm Đồng',
    phone: '0252 652 6666',
    email: 'khoangsanrangdong@rangdonggroup.vn',
    workingHours: '7:00 - 17:00'
  }
};

export const DEFAULT_PRODUCTS = [
  {
    name: 'Bê Tông Thương Phẩm Mác 250',
    category: 'Bê tông tươi',
    description: 'Bê tông tươi chất lượng cao, độ sụt ổn định, phù hợp cho các công trình dân dụng và nhà cao tầng.',
    price: 1250000,
    images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2068&auto=format&fit=crop'],
    specifications: {
      'Mác bê tông': '250',
      'Độ sụt': '12±2 cm',
      'Cường độ': '25 MPa'
    },
    featured: true
  },
  {
    name: 'Gạch Block Tự Chèn',
    category: 'Gạch không nung',
    description: 'Gạch block cường độ cao, mẫu mã đa dạng, chuyên dụng cho vỉa hè và bãi đậu xe.',
    price: 150000,
    images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop'],
    specifications: {
      'Kích thước': '200x100x60 mm',
      'Cường độ nén': 'M300',
      'Màu sắc': 'Xám, Đỏ, Vàng'
    },
    featured: true
  },
  {
    name: 'Đá Xây Dựng 1x2',
    category: 'Cát đá xây dựng',
    description: 'Đá 1x2 sạch, không lẫn tạp chất, cường độ nén cao, phù hợp cho đổ bê tông sàn, dầm, cột.',
    price: 450000,
    images: ['https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=2070&auto=format&fit=crop'],
    specifications: {
      'Kích thước hạt': '10-25 mm',
      'Độ nén hao hụt': '< 15%',
      'Hàm lượng bụi': '< 1%'
    },
    featured: false
  }
];

export const DEFAULT_PROJECTS = [
  {
    title: 'Cao Tốc Bắc Nam - Đoạn Vĩnh Hảo',
    category: 'Hạ tầng giao thông',
    location: 'Bình Thuận',
    year: '2023',
    scale: '100.000 m3 bê tông',
    description: 'Cung cấp toàn bộ bê tông tươi và vật liệu đắp nền cho gói thầu XL-01 dự án cao tốc Bắc Nam.',
    image: 'https://images.unsplash.com/photo-1545139224-79b1773592c2?q=80&w=2070&auto=format&fit=crop',
    featured: true,
    client: 'Bộ Giao Thông Vận Tải',
    scope: 'Cung ứng vật liệu xây dựng',
    challenge: 'Tiến độ thi công gấp rút, yêu cầu kỹ thuật khắt khe.',
    solution: 'Thiết lập trạm trộn dã chiến ngay tại chân công trình.',
    gallery: []
  },
  {
    title: 'Khu Công Nghiệp Becamex',
    category: 'Công nghiệp',
    location: 'Bình Dương',
    year: '2022',
    scale: '50 ha',
    description: 'Cung cấp gạch block tự chèn và hệ thống cống bê tông đúc sẵn cho hạ tầng khu công nghiệp.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop',
    featured: true,
    client: 'Tập đoàn Becamex',
    scope: 'Hạ tầng kỹ thuật',
    challenge: 'Diện tích thi công lớn, yêu cầu độ bền cao cho xe tải trọng nặng.',
    solution: 'Sử dụng gạch block cường độ cao M400.',
    gallery: []
  }
];

export const DEFAULT_NEWS = [
  {
    title: 'Rạng Đông Khai Trương Trạm Trộn Bê Tông Mới Tại Phan Thiết',
    category: 'Sự kiện',
    date: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop',
    summary: 'Trạm trộn mới với công suất 120m3/h sẽ đáp ứng nhu cầu vật liệu cho các dự án du lịch nghỉ dưỡng tại khu vực.',
    content: '<p>Ngày hôm nay, Công ty Khoáng Sản Rạng Đông đã chính thức khánh thành trạm trộn bê tông tươi thứ 5 tại khu vực Phan Thiết...</p>'
  },
  {
    title: 'Xu Hướng Sử Dụng Vật Liệu Xanh Trong Xây Dựng Hiện Đại',
    category: 'Kiến thức',
    date: new Date(Date.now() - 86400000).toISOString(),
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop',
    summary: 'Gạch không nung và bê tông nhẹ đang trở thành lựa chọn ưu tiên cho các công trình đạt chứng chỉ xanh.',
    content: '<p>Trong bối cảnh biến đổi khí hậu, ngành xây dựng đang chuyển mình mạnh mẽ sang các loại vật liệu thân thiện với môi trường...</p>'
  }
];

export const resetAllData = async () => {
  const collections = ['products', 'projects', 'news', 'messages', 'site_settings'];
  
  for (const colName of collections) {
    const querySnapshot = await getDocs(collection(db, colName));
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }

  // Seed site_settings
  await setDoc(doc(db, 'site_settings', 'main'), DEFAULT_SETTINGS);

  // Seed products
  for (const item of DEFAULT_PRODUCTS) {
    await setDoc(doc(collection(db, 'products')), item);
  }

  // Seed projects
  for (const item of DEFAULT_PROJECTS) {
    await setDoc(doc(collection(db, 'projects')), item);
  }

  // Seed news
  for (const item of DEFAULT_NEWS) {
    await setDoc(doc(collection(db, 'news')), item);
  }
};
