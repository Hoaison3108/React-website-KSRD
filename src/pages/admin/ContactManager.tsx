import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

export default function ContactManager() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '',
    phone: '',
    email: '',
    workingHours: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const docRef = doc(db, 'site_settings', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.contactInfo) {
          setContactInfo(data.contactInfo);
        }
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'site_settings', 'main');
      const docSnap = await getDoc(docRef);
      
      let currentSettings = {};
      if (docSnap.exists()) {
        currentSettings = docSnap.data();
      }

      await setDoc(docRef, {
        ...currentSettings,
        contactInfo
      });
      
      alert('Đã lưu thông tin liên hệ thành công!');
    } catch (error) {
      console.error("Error saving contact info:", error);
      alert('Có lỗi xảy ra khi lưu thông tin liên hệ.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Thông tin liên hệ</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý thông tin hiển thị trong phần "Kết nối với chúng tôi"</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 font-bold disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
          ) : (
            <Save size={20} className="mr-2" />
          )}
          Lưu thay đổi
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden max-w-3xl">
        <div className="p-6 border-b dark:border-gray-700 flex items-center gap-2">
          <Phone className="text-emerald-600" size={20} />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Chi tiết liên hệ</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">
                <MapPin size={16} className="text-gray-400" />
                Địa chỉ trụ sở
              </label>
              <textarea
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white resize-none"
                placeholder="Nhập địa chỉ công ty..."
              />
              <p className="text-xs text-gray-500 mt-1">Địa chỉ này sẽ hiển thị trên bản đồ và phần thông tin liên hệ.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">
                  <Phone size={16} className="text-gray-400" />
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white"
                  placeholder="Ví dụ: 091.7630.863"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">
                  <Mail size={16} className="text-gray-400" />
                  Email
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white"
                  placeholder="Ví dụ: chautm@rangdonggroup.vn"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">
                <Clock size={16} className="text-gray-400" />
                Giờ làm việc
              </label>
              <input
                type="text"
                value={contactInfo.workingHours}
                onChange={(e) => setContactInfo({ ...contactInfo, workingHours: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white"
                placeholder="Ví dụ: 7:00 - 17:00"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
