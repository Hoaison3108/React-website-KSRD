import React, { useEffect, useState } from 'react';
import { collection, getCountFromServer, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Package, Briefcase, Newspaper, Users, Info, TrendingUp, MessageSquare as MessageIcon } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    projects: 0,
    news: 0,
    users: 0
  });
  const [chartData, setChartData] = useState({
    visits: [] as number[],
    messages: [] as number[],
    labels: [] as string[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsColl = collection(db, 'products');
        const projectsColl = collection(db, 'projects');
        const newsColl = collection(db, 'news');
        // const usersColl = collection(db, 'users'); // Users might be restricted

        // Get dates for the last 7 days
        const last7Days = Array.from({length: 7}, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d;
        });
        
        const labels = last7Days.map(d => d.toLocaleDateString('vi-VN', { weekday: 'short' }));
        
        // Mock visits data 
        const mockVisits = [120, 150, 180, 145, 190, 210, 175];

        // Fetch messages for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const messagesQuery = query(
          collection(db, 'messages'),
          where('createdAt', '>=', sevenDaysAgo)
        );

        const [productsSnap, projectsSnap, newsSnap, messagesSnap] = await Promise.all([
          getCountFromServer(productsColl),
          getCountFromServer(projectsColl),
          getCountFromServer(newsColl),
          getDocs(messagesQuery)
        ]);
        
        const messagesCountArray = new Array(7).fill(0);
        
        messagesSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.createdAt) {
            const date = data.createdAt.toDate();
            const dateString = date.toLocaleDateString('vi-VN', { weekday: 'short' });
            const index = labels.indexOf(dateString);
            if (index !== -1) {
              messagesCountArray[index]++;
            }
          }
        });

        setChartData({
          visits: mockVisits,
          messages: messagesCountArray,
          labels
        });

        const fetchedStats = {
          products: productsSnap.data().count,
          projects: projectsSnap.data().count,
          news: newsSnap.data().count,
          users: 1 // Hardcoded for now as we have 1 admin
        };

        console.log("✅ Dữ liệu Firebase lấy về thành công:", fetchedStats);
        setStats(fetchedStats);
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu từ Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Tổng sản phẩm', value: stats.products, icon: <Package size={24} />, color: 'bg-blue-500' },
    { title: 'Dự án đã làm', value: stats.projects, icon: <Briefcase size={24} />, color: 'bg-green-500' },
    { title: 'Bài viết tin tức', value: stats.news, icon: <Newspaper size={24} />, color: 'bg-orange-500' },
    { title: 'Quản trị viên', value: stats.users, icon: <Users size={24} />, color: 'bg-purple-500' },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Tổng quan hệ thống</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex items-center">
            <div className={`p-4 rounded-lg ${stat.color} text-white mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-500" size={20} />
            Lưu lượng truy cập (7 ngày qua)
          </h2>
          <div className="h-64">
            <Line 
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    label: 'Lượt truy cập',
                    data: chartData.visits,
                    borderColor: 'rgb(59, 130, 246)', // Tailwind blue-500
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(156, 163, 175, 0.1)' } },
                  x: { grid: { display: false } }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <MessageIcon className="text-emerald-500" size={20} />
            Yêu cầu liên hệ mới (7 ngày qua)
          </h2>
          <div className="h-64">
            <Bar 
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    label: 'Form liên hệ',
                    data: chartData.messages,
                    backgroundColor: 'rgb(16, 185, 129)', // Tailwind emerald-500
                    borderRadius: 4,
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(156, 163, 175, 0.1)' } },
                  x: { grid: { display: false } }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <Info className="text-blue-500" size={20} />
            Sổ tay Hướng dẫn Vận hành
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                <span className="bg-blue-200 dark:bg-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Quản lý Nội dung & SEO (Bài viết / Sản phẩm)
              </h3>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 opacity-90">
                <li><strong>Đường dẫn tĩnh (Slug):</strong> Hệ thống tự động sinh tự động 1 lần duy nhất từ Tiêu đề bạn nhập vào lúc Thêm Mới. URL này sẽ duy trì cố định (vd: `/tin-tuc/bai-hoc-so-1`) ngay cả khi bạn sửa lại Title nhằm bảo toàn và không làm gãy link SEO.</li>
                <li><strong>Cú pháp nhập đa dòng:</strong> Đối với các trường như Ý yêu cầu, Đặc điểm, hay Lợi ích, hãy <strong>xuống dòng</strong> (Enter) để mỗi ý một hàng. Không cần tự gõ thêm dấu nối hay chấm đầu dòng.</li>
                <li><strong>Thông số kỹ thuật:</strong> Bắt buộc dùng cấu trúc <code>Nhãn: Giá trị</code> (vd: <em className="text-blue-600 dark:text-blue-300">Trọng lượng: 2kg</em>).</li>
              </ul>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-2">
                <span className="bg-emerald-200 dark:bg-emerald-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Tải lên Hình ảnh Truyền thông
              </h3>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 opacity-90">
                <li>Hệ thống hỗ trợ 2 cơ chế: <strong>Dán URL copy từ web ngoài</strong> & <strong>Tải trực tiếp File từ máy</strong>. </li>
                <li>Với cơ chế Upload, dung lượng tối đa là <strong>5MB/Hình ảnh</strong> nhằm đảm bảo lưu lượng Firebase Storage không bị nghẽn mạng. Ảnh to hơn 5MB sẽ báo đường viền đỏ.</li>
                <li><strong>Tính năng Multi-Upload:</strong> Ở các phần <em>Thư viện ảnh Gallery</em>, bạn có thể bôi đen nhiều file và kéo-thả vô cùng lúc để tải cả xâu chuỗi hình ảnh lên hệ thống lập tức.</li>
              </ul>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-900/30">
              <h3 className="font-bold text-orange-800 dark:text-orange-400 mb-2 flex items-center gap-2">
                <span className="bg-orange-200 dark:bg-orange-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                Cài đặt & Giao diện Website
              </h3>
              <p className="opacity-90 leading-relaxed">
                Các thay đổi liên hệ, mã nhúng Iframe Google Map, Mạng xã hội, Hoặc thay Avatar công ty tại mục <strong className="text-orange-600 dark:text-orange-300">Cài đặt Website</strong> đều sẽ được Realtime (Phản hồi tức thì) trên Giao diện trang chủ ngay khi bạn bấm nút [Lưu lại].
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span className="bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </span>
            Kỷ luật & Lưu ý Hệ thống
          </h2>
          <ul className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
            <li className="flex gap-3">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <div>
                <strong className="block text-gray-800 dark:text-white">Kiểm soát tính Xóa Dữ liệu</strong>
                <span className="opacity-90">Một khi bấm Xóa một sản phẩm/bài viết, dữ liệu Text sẽ biến mất mãi mãi trên Firestore DB không thể khôi phục. <strong>Đặc biệt:</strong> Hình ảnh của sản phẩm đó đã được Upload lên Firebase Storage sẽ chưa được xóa dọn dẹp theo bài viết tự động nhằm chống các lỗi phụ tải (Dangling references). Khuyến nghị Admin không nên lạm dụng upload ảnh nháp rồi xóa liên tục.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-sky-500 mt-0.5">💡</span>
              <div>
                <strong className="block text-gray-800 dark:text-white">Hãy tuân thủ Placeholder (Chỉ dẫn ngầm)</strong>
                <span className="opacity-90">Bên dưới hoặc bên trong mỗi ô Input trên trang Quản trị đều có các chú thích nhỏ Mẹo (Tips). Bạn hãy đọc kỹ form chuẩn (Vd: https://...) để nhập liệu chính xác.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-500 mt-0.5">✅</span>
              <div>
                <strong className="block text-gray-800 dark:text-white">Thao tác bật tắt Hiển thị</strong>
                <span className="opacity-90">Trong Quản lý Dự án có mục checkbox [Cắm cờ phát]. Trong Quản lý Tuyển dụng có Dropdown [Tình trạng Mở/Đóng cửa]. Hãy rà soát kỹ các chỉ mục này thay vì xóa bài hoàn toàn. Bằng cách đó, Bạn sẽ có thể giữ bài viết ẩn chờ chạy Chiến dịch Marketing.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 mt-0.5">🖥️</span>
              <div>
                <strong className="block text-gray-800 dark:text-white">Giao diện Khuyên dùng</strong>
                <span className="opacity-90">Hệ thống Management đã được thích ứng Dark/Light theme nhưng để làm việc với Form dài thuận tiện, chúng tôi đề xuất Quản trị viên sử dụng Máy tính (PC) kèm theo các trình duyệt hiện đại (Chrome, Edge, Safari đời mới).</span>
              </div>
            </li>
          </ul>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-center flex flex-col items-center justify-center gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Hệ thống Admin</span>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Phiên bản KSRD Cms 2.5.0 - Final Edition</p>
            <p className="text-xs text-gray-500">Phát triển phần mềm kiến trúc bởi SONK</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
