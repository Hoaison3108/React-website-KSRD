import React, { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, Clock, Shield } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useAuth } from '../../contexts/AuthContext';

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

export default function ContactManager() {
  const { isAdmin } = useAuth();
  const { settings: remoteSettings, loading, updateSettings } = useSiteSettings();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '',
    phone: '',
    email: '',
    workingHours: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (remoteSettings) {
      if (remoteSettings.contactPageInfo) {
        setContactInfo(remoteSettings.contactPageInfo);
      } else if (remoteSettings.footerInfo) {
        // Fallback tạm thời nếu chưa có cấu hình riêng
        setContactInfo({ ...remoteSettings.footerInfo, workingHours: remoteSettings.footerInfo.workingHours || '' });
      }
    }
  }, [remoteSettings]);

  const handleSave = async () => {
    if (!remoteSettings) return;
    setSaving(true);
    try {
      await updateSettings({
        ...remoteSettings,
        contactPageInfo: contactInfo
      });
      alert('Đã lưu thông tin liên hệ thành công!');
    } catch (error) {
      // Lỗi đã handle trong Hook
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Form Đặt Hàng / Liên Hệ</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý thông tin điện thoại và địa chỉ nhận email của khối Liên hệ báo giá</p>
        </div>
        {isAdmin && (
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
        )}
      </div>

      {!isAdmin && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-xl flex items-center gap-3">
          <Shield className="text-orange-500" size={24} />
          <div>
            <p className="font-bold">Chế độ chỉ xem</p>
            <p className="text-sm">Tài khoản của bạn không có quyền thay đổi thông tin liên hệ. Vui lòng liên hệ Admin nếu cần chỉnh sửa.</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden max-w-3xl">
        <div className="p-6 border-b dark:border-gray-700 flex items-center gap-2">
          <Phone className="text-emerald-600" size={20} />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Thông tin Nhận Email từ Website</h2>
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
                disabled={!isAdmin}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white resize-none disabled:opacity-70 disabled:cursor-not-allowed"
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
                  disabled={!isAdmin}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
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
                  disabled={!isAdmin}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="Ví dụ: chautm@rangdonggroup.vn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
