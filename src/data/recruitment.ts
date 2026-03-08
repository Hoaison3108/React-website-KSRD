export interface Job {
  id: number;
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

export const jobs: Job[] = [
  {
    id: 1,
    title: 'Kỹ Sư Xây Dựng',
    location: 'Lâm Đồng',
    type: 'Toàn thời gian',
    salary: '15 - 20 Triệu',
    deadline: '30/04/2026',
    desc: 'Chịu trách nhiệm giám sát kỹ thuật, quản lý chất lượng công trình, lập hồ sơ nghiệm thu. Phối hợp với các bộ phận liên quan để đảm bảo tiến độ dự án.',
    requirements: [
      'Tốt nghiệp Đại học chuyên ngành Xây dựng dân dụng và công nghiệp',
      'Kinh nghiệm 2 năm trở lên ở vị trí tương đương',
      'Thành thạo AutoCad, Project, các phần mềm dự toán',
      'Chịu được áp lực công việc, sẵn sàng đi công tác xa',
      'Có chứng chỉ hành nghề giám sát là một lợi thế'
    ],
    benefits: [
      'Lương cứng + Thưởng theo dự án',
      'Được đóng BHXH, BHYT, BHTN theo quy định',
      'Du lịch hàng năm, thưởng lễ tết',
      'Môi trường làm việc chuyên nghiệp, cơ hội thăng tiến cao'
    ],
    experience: '2 năm',
    education: 'Đại học',
    quantity: 2,
    gender: 'Nam',
    contactName: 'Phòng Nhân Sự',
    contactEmail: 'tuyendung@rangdonggroup.vn',
    contactPhone: '091.7630.863'
  },
  {
    id: 2,
    title: 'Nhân Viên Kinh Doanh',
    location: 'Bình Thuận',
    type: 'Toàn thời gian',
    salary: '10 - 15 Triệu + Hoa hồng',
    deadline: '30/04/2026',
    desc: 'Tìm kiếm khách hàng mới, tư vấn sản phẩm bê tông, gạch, cát đá cho các dự án xây dựng. Duy trì và phát triển mối quan hệ với khách hàng hiện có.',
    requirements: [
      'Tốt nghiệp Cao đẳng trở lên khối ngành Kinh tế, QTKD, Xây dựng',
      'Kỹ năng giao tiếp, đàm phán tốt',
      'Đam mê kinh doanh, chịu khó',
      'Có phương tiện đi lại',
      'Ưu tiên ứng viên có kinh nghiệm trong ngành vật liệu xây dựng'
    ],
    benefits: [
      'Lương cứng + Hoa hồng hấp dẫn (Thu nhập không giới hạn)',
      'Được đào tạo kiến thức sản phẩm và kỹ năng bán hàng',
      'Phụ cấp xăng xe, điện thoại',
      'Chế độ phúc lợi đầy đủ'
    ],
    experience: 'Không yêu cầu (Có kinh nghiệm là lợi thế)',
    education: 'Cao đẳng',
    quantity: 5,
    gender: 'Nam/Nữ',
    contactName: 'Phòng Nhân Sự',
    contactEmail: 'tuyendung@rangdonggroup.vn',
    contactPhone: '091.7630.863'
  },
  {
    id: 3,
    title: 'Lái Xe Tải Ben',
    location: 'Lâm Đồng',
    type: 'Toàn thời gian',
    salary: '12 - 18 Triệu',
    deadline: '15/05/2026',
    desc: 'Vận chuyển vật liệu xây dựng từ mỏ đến công trình theo điều động. Bảo quản, giữ gìn xe, kiểm tra xe định kỳ.',
    requirements: [
      'Bằng lái xe hạng C trở lên',
      'Kinh nghiệm lái xe tải ben 1 năm trở lên',
      'Sức khỏe tốt, trung thực, cẩn thận',
      'Thông thạo đường xá khu vực Lâm Đồng, Bình Thuận'
    ],
    benefits: [
      'Lương ổn định + Thưởng chuyến',
      'Hỗ trợ ăn trưa, chỗ ở (nếu ở xa)',
      'Được đóng bảo hiểm đầy đủ',
      'Công việc ổn định lâu dài'
    ],
    experience: '1 năm',
    education: 'Phổ thông',
    quantity: 3,
    gender: 'Nam',
    contactName: 'Phòng Nhân Sự',
    contactEmail: 'tuyendung@rangdonggroup.vn',
    contactPhone: '091.7630.863'
  }
];
