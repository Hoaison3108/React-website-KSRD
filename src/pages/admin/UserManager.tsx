import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { db, firebaseConfig } from '../../firebase';
import { Shield, Plus, X, Save, Trash2, Users, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Create a secondary app to create new users without signing out the current admin
const secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');
const secondaryAuth = getAuth(secondaryApp);

interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  createdAt: any;
}

const UserManager = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting'>('idle');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user' as 'admin' | 'user'
  });

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      setUsers(list);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    setFormStatus('submitting');
    try {
      // 1. Create User in Firebase Auth using Secondary App
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email,
        formData.password
      );
      
      const newUserId = userCredential.user.uid;

      // 2. Save User Role & Data to Firestore 'users' collection
      await setDoc(doc(db, 'users', newUserId), {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        createdAt: Timestamp.now()
      });

      // 3. Sign out the secondary app immediately to prevent session conflicts
      await secondaryAuth.signOut();

      alert('Tạo tài khoản thành công!');
      setIsModalOpen(false);
      setFormData({ email: '', password: '', name: '', role: 'user' });
      fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error.code === 'auth/email-already-in-use') {
        alert('Email này đã được sử dụng!');
      } else if (error.code === 'auth/weak-password') {
        alert('Mật khẩu quá yếu, vui lòng nhập ít nhất 6 ký tự.');
      } else {
        alert('Có lỗi xảy ra khi tạo tài khoản: ' + error.message);
      }
    } finally {
      setFormStatus('idle');
    }
  };

  const handleDelete = async (userId: string, userEmail: string) => {
    if (!isAdmin) return;
    if (window.confirm(`Bạn có chắc chắn muốn XÓA quyền truy cập của tài khoản ${userEmail}?\n\nLưu ý: Hành động này chỉ xóa Document phân quyền trong Firestore, không xóa tài khoản Firebase Auth gốc. Tài khoản này khi đăng nhập lại sẽ bị hạ xuống quyền 'user' mặc định và không còn thông tin nội bộ.`)) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        alert('Đã thu hồi quyền truy cập thành công!');
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user doc:", error);
        alert('Lỗi thu hồi quyền');
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-full mb-6">
          <Shield size={64} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Quyền truy cập bị từ chối</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg">
          Khu vực này chỉ dành riêng cho Quản trị viên cấp cao (Admin). Tài khoản của bạn hiện là Nhân viên (Staff). Tham khảo Admin để biết thêm chi tiết.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Quản lý Nhân sự</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý tài khoản Admin và Staff đăng nhập hệ thống</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/20 transition-all"
        >
          <Plus size={20} /> Cấp tài khoản mới
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700 flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
            <Users size={20} />
          </div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Danh sách Tài khoản</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Đang tải danh sách...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Họ và tên</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email (Tài khoản)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phân quyền</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50'
                      }`}>
                        {user.role === 'admin' ? 'Quản trị viên (Admin)' : 'Nhân viên (Staff)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(user.id, user.email)} 
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Xóa/Thu hồi quyền"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      Chưa có dữ liệu phân quyền người dùng. 
                      <p className="text-sm mt-2 text-gray-400">Bạn đang dùng tài khoản gốc chưa cấu hình User Document.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                Cấp tài khoản mới
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Họ và tên nhân viên <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email đăng nhập <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="email" 
                  autoComplete="off"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                  placeholder="name@rangdonggroup.vn"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mật khẩu (Tối thiểu 6 ký tự) <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="password" 
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                  placeholder="******"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phân quyền <span className="text-red-500">*</span></label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                >
                  <option value="user">Nhân viên (Staff) - Chỉ xem dữ liệu và trả lời Liên hệ</option>
                  <option value="admin">Quản trị viên (Admin) - Toàn quyền quản trị</option>
                </select>
              </div>

              <div className="pt-4 border-t dark:border-gray-700">
                <button 
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2"
                >
                  {formStatus === 'submitting' ? (
                    <><Loader2 size={20} className="animate-spin" /> ĐANG TẠO TÀI KHOẢN...</>
                  ) : (
                    <><Save size={20} /> LƯU & CẤP QUYỀN</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
