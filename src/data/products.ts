export const productCategories = [
  'Tất cả',
  'Bê Tông & Bê Tông Nhựa',
  'Đá & Cát',
  'Gạch & Ngói',
  'Xi Măng & Thép'
];

export const products = [
  {
    id: 1,
    title: 'Bê Tông Thương Phẩm',
    category: 'Bê Tông & Bê Tông Nhựa',
    desc: 'Bê tông tươi chất lượng cao, đa dạng mác từ M150 đến M600, phù hợp cho mọi loại hình công trình từ dân dụng đến công nghiệp.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'Chủ lực',
    color: 'blue',
    details: {
      features: [
        'Cường độ chịu nén cao, đạt tiêu chuẩn TCVN',
        'Độ sụt linh hoạt, dễ thi công',
        'Khả năng chống thấm, chống ăn mòn tốt',
        'Thời gian đông kết được kiểm soát chặt chẽ'
      ],
      specifications: [
        { label: 'Mác bê tông', value: 'M150 - M600' },
        { label: 'Độ sụt', value: '10±2 - 20±2 cm' },
        { label: 'Cốt liệu', value: 'Đá 1x2, Cát vàng, Xi măng PCB40' },
        { label: 'Phụ gia', value: 'Siêu dẻo, đông kết nhanh/chậm' }
      ],
      applications: 'Móng, cột, dầm, sàn nhà cao tầng, cầu đường, công trình thủy lợi...'
    }
  },
  {
    id: 2,
    title: 'Đá Xây Dựng',
    category: 'Đá & Cát',
    desc: 'Khai thác và chế biến đá xây dựng các loại: đá 1x2, 4x6, đá mi, đá hộc... đảm bảo tiêu chuẩn cơ lý.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545139224-79b176937ee9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'Sẵn hàng',
    color: 'orange',
    details: {
      features: [
        'Cường độ kháng nén cao',
        'Độ thoi dẹt thấp, hình dáng khối',
        'Hàm lượng bụi bùn sét thấp',
        'Độ bám dính nhựa đường tốt'
      ],
      specifications: [
        { label: 'Tiêu chuẩn kỹ thuật chung', value: [
          'Cường độ nén: ≥ 1000 daN/cm2',
          'Độ hút nước: < 0.5%',
          'Hàm lượng bụi bùn sét: < 1%',
          'Độ thoi dẹt: < 15%'
        ]},
        { label: 'Đá 1x2 (Đá bê tông)', value: [
          'Kích thước: 10mm - 28mm (hoặc 10mm - 25mm)',
          'Ứng dụng: Đổ bê tông nhà cao tầng, đường băng sân bay, cầu cảng, đường quốc lộ, bê tông tươi...'
        ]},
        { label: 'Đá 2x4', value: [
          'Kích thước: 20mm - 40mm',
          'Ứng dụng: Đổ bê tông nhà cao tầng, cầu cảng, đường cao tốc. Thường dùng cho các công trình cần độ chịu lực cao.'
        ]},
        { label: 'Đá 4x6 (Đá dăm)', value: [
          'Kích thước: 40mm - 60mm',
          'Ứng dụng: Làm lớp lót nền móng, kè móng, cốt nền hoặc phụ gia công nghệ bê tông đúc ống cống.'
        ]},
        { label: 'Đá 5x7', value: [
          'Kích thước: 50mm - 70mm',
          'Ứng dụng: Làm chân đế gạch bông, gạch lót sàn, phụ gia cho công nghệ bê tông đúc ống cống, thi công các công trình giao thông...'
        ]},
        { label: 'Đá 0x4 (Cấp phối đá dăm)', value: [
          'Kích thước: 0mm - 40mm (hỗn hợp đá bụi và đá dăm)',
          'Ứng dụng: Làm cấp phối nền đường, san lấp mặt bằng, dặm vá hố gà...'
        ]},
        { label: 'Đá Mi Sàng', value: [
          'Kích thước: 5mm - 10mm',
          'Ứng dụng: Làm chân đế gạch bông, gạch lót sàn, phụ gia cho công nghệ bê tông đúc ống cống, thi công các công trình giao thông...'
        ]},
        { label: 'Đá Mi Bụi', value: [
          'Kích thước: < 5mm (bột đá)',
          'Ứng dụng: San lấp mặt bằng, làm phụ gia cho công nghệ bê tông đúc ống cống, sản xuất gạch không nung...'
        ]},
        { label: 'Đá Hộc', value: [
          'Kích thước: 100mm - 300mm (không đồng nhất)',
          'Ứng dụng: Xây tường rào, kè bờ, xây móng nhà, công trình thủy lợi...'
        ]}
      ],
      applications: 'Bê tông xi măng, bê tông nhựa, cấp phối đá dăm đường giao thông...'
    }
  },
  {
    id: 3,
    title: 'Gạch Không Nung',
    category: 'Gạch & Ngói',
    desc: 'Sản phẩm gạch block, gạch terrazzo thân thiện môi trường, độ bền cao, cách âm cách nhiệt tốt.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'Tiêu chuẩn xanh',
    color: 'green',
    details: {
      features: [
        'Thân thiện với môi trường',
        'Cách âm, cách nhiệt tốt',
        'Kích thước chuẩn xác, thi công nhanh',
        'Cường độ chịu lực cao'
      ],
      specifications: [
        { label: 'Gạch Block 4 lỗ (9x19x39)', value: 'Kích thước: 390x190x90 mm. Dùng xây tường ngăn 100mm.' },
        { label: 'Gạch Block 2 lỗ (19x19x39)', value: 'Kích thước: 390x190x190 mm. Dùng xây tường bao 200mm.' },
        { label: 'Gạch Đinh (Gạch thẻ)', value: 'Kích thước: 40x80x180 mm. Dùng xây tường, hố ga, bể nước...' },
        { label: 'Gạch Cột', value: 'Kích thước: 190x190x190 mm. Dùng xây cột, bổ trụ.' },
        { label: 'Gạch Trồng Cỏ', value: 'Kích thước: 260x400x80 mm (8 lỗ). Dùng lát sân vườn, bãi xe.' },
        { label: 'Cường độ nén', value: '≥ 7.5 MPa (Gạch đặc ≥ 10 MPa)' },
        { label: 'Độ hút nước', value: '< 8%' },
        { label: 'Sai số kích thước', value: '± 2mm' }
      ],
      applications: 'Xây tường bao, tường ngăn, lát vỉa hè, sân vườn...'
    }
  },
  {
    id: 4,
    title: 'Cát Xây Dựng',
    category: 'Đá & Cát',
    desc: 'Cát vàng, cát đen đã qua sàng lọc, loại bỏ tạp chất, đảm bảo chất lượng cho vữa xây trát và bê tông.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'Chất lượng',
    color: 'orange',
    details: {
      features: [
        'Hạt đều, sạch tạp chất',
        'Mô đun độ lớn phù hợp',
        'Đảm bảo độ bền cho công trình',
        'Nguồn gốc rõ ràng'
      ],
      specifications: [
        { label: 'Loại cát', value: 'Cát vàng, Cát đen, Cát san lấp' },
        { label: 'Mô đun độ lớn', value: 'Mk > 2.0 (Cát bê tông)' },
        { label: 'Hàm lượng bùn', value: '< 3%' },
        { label: 'Tạp chất hữu cơ', value: 'Không lẫn' }
      ],
      applications: 'Bê tông, xây trát, san lấp mặt bằng...'
    }
  },
  {
    id: 5,
    title: 'Xi Măng Công Nghiệp',
    category: 'Xi Măng & Thép',
    desc: 'Cung cấp các loại xi măng PCB30, PCB40 từ các thương hiệu uy tín, đảm bảo độ kết dính và độ bền cao.',
    image: 'https://images.unsplash.com/photo-1545139224-79b176937ee9?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1545139224-79b176937ee9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'Chính hãng',
    color: 'blue',
    details: {
      features: [
        'Độ mịn cao',
        'Thời gian đông kết hợp lý',
        'Cường độ phát triển nhanh',
        'Chống xâm thực tốt'
      ],
      specifications: [
        { label: 'Chủng loại', value: 'PCB30, PCB40, PC50' },
        { label: 'Cường độ nén 28 ngày', value: '≥ 30/40/50 MPa' },
        { label: 'Thời gian đông kết', value: 'Bắt đầu > 45p, Kết thúc < 375p' },
        { label: 'Độ ổn định thể tích', value: '< 10mm' }
      ],
      applications: 'Bê tông cốt thép, xây tô, công trình công nghiệp...'
    }
  },
  {
    id: 6,
    title: 'Sắt Thép Xây Dựng',
    category: 'Xi Măng & Thép',
    desc: 'Phân phối sắt thép cuộn, thép cây từ các nhà máy lớn như Hòa Phát, Pomina... đáp ứng mọi tiêu chuẩn kỹ thuật.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'Đa dạng',
    color: 'orange',
    details: {
      features: [
        'Độ bền kéo cao',
        'Độ dẻo dai tốt',
        'Chống rỉ sét, ăn mòn',
        'Đa dạng kích thước, chủng loại'
      ],
      specifications: [
        { label: 'Chủng loại', value: 'Thép cuộn, Thép cây vằn' },
        { label: 'Đường kính', value: 'D6 - D32' },
        { label: 'Mác thép', value: 'CB300V, CB400V, CB500V' },
        { label: 'Tiêu chuẩn', value: 'TCVN, JIS, ASTM' }
      ],
      applications: 'Cốt thép bê tông, kết cấu thép nhà xưởng, cầu đường...'
    }
  },
  {
    id: 7,
    title: 'Ngói Lợp & Vật Liệu Hoàn Thiện',
    category: 'Gạch & Ngói',
    desc: 'Các loại ngói màu, ngói đất nung và vật liệu ốp lát cao cấp, mang lại vẻ đẹp thẩm mỹ cho ngôi nhà.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545139224-79b176937ee9?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'Thẩm mỹ',
    color: 'green',
    details: {
      features: [
        'Màu sắc đa dạng, bền màu',
        'Chống thấm, chống rêu mốc',
        'Cách nhiệt, giảm tiếng ồn',
        'Trọng lượng nhẹ, giảm tải trọng'
      ],
      specifications: [
        { label: 'Loại ngói', value: 'Ngói màu, Ngói đất nung' },
        { label: 'Kích thước', value: '424x335 mm (tiêu chuẩn)' },
        { label: 'Trọng lượng', value: '3.5 - 4 kg/viên' },
        { label: 'Độ bền uốn', value: '> 1200 N' }
      ],
      applications: 'Lợp mái nhà ở, biệt thự, resort, công trình công cộng...'
    }
  },
  {
    id: 8,
    title: 'Bê Tông Nhựa Chặt',
    category: 'Bê Tông & Bê Tông Nhựa',
    desc: 'Bê tông nhựa nóng (Asphalt Concrete) chất lượng cao, sản xuất theo công nghệ hiện đại, đảm bảo độ bền và êm thuận cho đường giao thông.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'Công nghệ cao',
    color: 'blue',
    details: {
      features: [
        'Độ nhám cao, tăng ma sát cho phương tiện',
        'Chịu tải trọng động và tĩnh lớn',
        'Khả năng thoát nước mặt tốt',
        'Giảm tiếng ồn khi xe chạy',
        'Tuổi thọ công trình cao'
      ],
      specifications: [
        { label: 'Bê tông nhựa chặt C9.5', value: 'Cỡ hạt lớn nhất danh định 9.5mm. Dùng cho lớp mặt trên.' },
        { label: 'Bê tông nhựa chặt C12.5', value: 'Cỡ hạt lớn nhất danh định 12.5mm. Dùng cho lớp mặt trên hoặc lớp dưới.' },
        { label: 'Bê tông nhựa chặt C19', value: 'Cỡ hạt lớn nhất danh định 19mm. Dùng cho lớp mặt dưới.' },
        { label: 'Độ ổn định Marshall', value: '≥ 8.0 kN' },
        { label: 'Độ dẻo Marshall', value: '2 - 4 mm' },
        { label: 'Độ rỗng dư', value: '3 - 6 %' }
      ],
      applications: 'Làm lớp mặt đường ô tô, đường cao tốc, đường phố, bến bãi, sân bay...'
    }
  },
  {
    id: 9,
    title: 'Gạch Terrazzo Cao Cấp',
    category: 'Gạch & Ngói',
    desc: 'Gạch lát vỉa hè, sân vườn với hoa văn đa dạng, bề mặt mài bóng hoặc nhám, chịu lực tốt và tính thẩm mỹ cao.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'Mới',
    color: 'green',
    details: {
      features: [
        'Hoa văn tinh xảo, màu sắc phong phú',
        'Chịu lực nén cao, chống mài mòn',
        'Thoát nước tốt, chống trơn trượt',
        'Dễ dàng thi công và vệ sinh'
      ],
      specifications: [
        { label: 'Kích thước', value: '300x300mm, 400x400mm' },
        { label: 'Độ dày', value: '30mm, 40mm' },
        { label: 'Cường độ chịu nén', value: '≥ 20 MPa' },
        { label: 'Độ hút nước', value: '< 8%' },
        { label: 'Độ mài mòn', value: '< 0.45 g/cm2' }
      ],
      applications: 'Lát vỉa hè, công viên, sân vườn, quảng trường, trường học...'
    }
  },
  {
    id: 10,
    title: 'Cống Bê Tông Ly Tâm',
    category: 'Bê Tông & Bê Tông Nhựa',
    desc: 'Cống tròn bê tông cốt thép sản xuất theo công nghệ quay ly tâm, đảm bảo độ đặc chắc và khả năng chịu lực vượt trội.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545139224-79b176937ee9?q=80&w=1000&auto=format&fit=crop'
    ],
    badge: 'Tiêu chuẩn TCVN',
    color: 'blue',
    details: {
      features: [
        'Bề mặt nhẵn phẳng, lòng cống trơn',
        'Khả năng thoát nước nhanh',
        'Chịu được áp lực nước và tải trọng đất lớn',
        'Mối nối kín khít, không rò rỉ'
      ],
      specifications: [
        { label: 'Đường kính trong', value: 'D300 - D2000 mm' },
        { label: 'Chiều dài đốt cống', value: '2.5m - 4m' },
        { label: 'Cấp tải trọng', value: 'VH (Vỉa hè), HL-93 (Hoạt tải)' },
        { label: 'Bê tông', value: 'Mác M300 trở lên' },
        { label: 'Cốt thép', value: 'Thép kéo nguội cường độ cao' }
      ],
      applications: 'Hệ thống thoát nước mưa, nước thải khu đô thị, khu công nghiệp, đường giao thông...'
    }
  }
];
