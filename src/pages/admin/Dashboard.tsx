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

        setStats({
          products: productsSnap.data().count,
          projects: projectsSnap.data().count,
          news: newsSnap.data().count,
          users: 1 // Hardcoded for now as we have 1 admin
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Info className="text-blue-500" size={20} />
            Hướng dẫn sử dụng nhanh
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20">
              <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-1">1. Quản lý Sản phẩm & Dự án</h3>
              <p>Truy cập mục tương ứng để thêm mới hoặc chỉnh sửa. Bạn có thể tải lên nhiều hình ảnh cùng lúc. Ảnh đầu tiên sẽ được dùng làm ảnh đại diện.</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/20">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-1">2. Viết bài Tin tức</h3>
              <p>Sử dụng trình soạn thảo văn bản để định dạng bài viết. Bạn có thể chèn link, danh sách và hình ảnh trực tiếp vào nội dung bài viết.</p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-900/20">
              <h3 className="font-bold text-orange-800 dark:text-orange-400 mb-1">3. Cài đặt Website</h3>
              <p>Thay đổi tiêu đề, ảnh nền trang chủ và thông tin liên hệ tại đây. Nhớ nhấn "Lưu thay đổi" sau khi chỉnh sửa.</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-900/20">
              <h3 className="font-bold text-purple-800 dark:text-purple-400 mb-1">4. Kiểm tra Tin nhắn</h3>
              <p>Mọi yêu cầu từ khách hàng qua form liên hệ sẽ được lưu tại mục "Tin nhắn". Bạn nên kiểm tra thường xuyên để phản hồi khách hàng.</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Lưu ý quan trọng</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-600 dark:text-gray-300 text-sm">
            <li><strong>Kích thước ảnh:</strong> Nên sử dụng ảnh có dung lượng dưới 2MB để đảm bảo tốc độ tải trang nhanh.</li>
            <li><strong>Bảo mật:</strong> Luôn đăng xuất sau khi hoàn thành công việc để bảo vệ dữ liệu hệ thống.</li>
            <li><strong>Sao lưu:</strong> Dữ liệu được lưu trữ trên Firebase, hãy cẩn thận khi thực hiện thao tác "Xóa" vì không thể hoàn tác.</li>
            <li><strong>Chế độ tối:</strong> Hệ thống hỗ trợ giao diện tối (Dark Mode) dựa trên cài đặt của trình duyệt/hệ điều hành.</li>
          </ul>
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-center">
            <p className="text-xs text-gray-500">Phiên bản hệ thống: 2.0.0 | Hỗ trợ kỹ thuật: hoaison3108@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
