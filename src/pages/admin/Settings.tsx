import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { uploadImage } from '../../utils/uploadImage';
import { resetAllData } from '../../utils/seedData';
import { Save, Image as ImageIcon, Plus, Trash2, Layout, Info, Phone, RotateCcw, Database } from 'lucide-react';

const DEFAULT_SETTINGS: SiteSettings = {
  hero: {
    title: 'VẬT LIỆU XÂY DỰNG HOÀI SƠN',
    subtitle: 'Đồng hành cùng mọi công trình bền vững với thời gian. Cung cấp giải pháp vật liệu xây dựng toàn diện và chất lượng cao.',
    backgroundImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop'
  },
  services: [
    { title: 'Cung cấp Bê tông', description: 'Bê tông thương phẩm chất lượng cao cho mọi công trình.', icon: 'Package' },
    { title: 'Đá & Cát xây dựng', description: 'Nguồn vật liệu tự nhiên, sàng lọc kỹ lưỡng.', icon: 'Info' },
    { title: 'Gạch & Ngói', description: 'Đa dạng mẫu mã, độ bền vượt trội.', icon: 'Layout' }
  ],
  contactInfo: {
    address: 'Km09 QL28B - xã Lương Sơn - tỉnh Lâm Đồng',
    phone: '0252 652 6666',
    email: 'khoangsanrangdong@rangdonggroup.vn',
    workingHours: '7:00 - 17:00'
  }
};

interface SiteSettings {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  services: {
    title: string;
    description: string;
    icon: string;
  }[];
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
  };
}

const Settings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    hero: { title: '', subtitle: '', backgroundImage: '' },
    services: [],
    contactInfo: { address: '', phone: '', email: '', workingHours: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImage, setHeroImage] = useState<File | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'site_settings', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let heroUrl = settings.hero.backgroundImage;
      if (heroImage) {
        heroUrl = await uploadImage(heroImage, 'settings');
      }

      const updatedSettings = {
        ...settings,
        hero: { ...settings.hero, backgroundImage: heroUrl }
      };

      await setDoc(doc(db, 'site_settings', 'main'), updatedSettings);
      setSettings(updatedSettings);
      setHeroImage(null);
      alert('Đã lưu cài đặt thành công!');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert('Có lỗi xảy ra khi lưu cài đặt.');
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn khôi phục cài đặt mặc định?')) {
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_settings', 'main'), DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
      alert('Đã khôi phục cài đặt mặc định thành công!');
    } catch (error) {
      console.error("Error restoring settings:", error);
      alert('Có lỗi xảy ra khi khôi phục cài đặt.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('CẢNH BÁO: Hành động này sẽ XÓA TOÀN BỘ dữ liệu hiện tại và tạo lại dữ liệu mẫu ban đầu (Sản phẩm, Dự án, Tin tức, Cài đặt). Bạn có chắc chắn muốn tiếp tục?')) {
      return;
    }
    setSaving(true);
    try {
      await resetAllData();
      await fetchSettings();
      alert('Đã khôi phục toàn bộ dữ liệu mẫu thành công!');
    } catch (error) {
      console.error("Error resetting data:", error);
      alert('Có lỗi xảy ra khi khôi phục dữ liệu.');
    } finally {
      setSaving(false);
    }
  };

  const handleServiceChange = (index: number, field: string, value: string) => {
    const updatedServices = [...settings.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setSettings({ ...settings, services: updatedServices });
  };

  const addService = () => {
    setSettings({
      ...settings,
      services: [...settings.services, { title: '', description: '', icon: 'Package' }]
    });
  };

  const removeService = (index: number) => {
    const updatedServices = settings.services.filter((_, i) => i !== index);
    setSettings({ ...settings, services: updatedServices });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Đang tải cài đặt...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Cài đặt Website</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Tùy chỉnh nội dung trang chủ và thông tin liên hệ</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResetData}
            disabled={saving}
            className="flex items-center px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all font-bold disabled:opacity-50 border border-red-200"
          >
            <Database size={20} className="mr-2" />
            Tạo dữ liệu mẫu
          </button>
          <button
            onClick={handleRestoreDefaults}
            disabled={saving}
            className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-bold disabled:opacity-50 border border-gray-200"
          >
            <RotateCcw size={20} className="mr-2" />
            Khôi phục mặc định
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 font-bold disabled:opacity-50"
            title="Lưu tất cả các thay đổi cài đặt"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            ) : (
              <Save size={20} className="mr-2" />
            )}
            Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Hero & Contact */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700 flex items-center gap-2">
              <Layout className="text-emerald-600" size={20} />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Phần đầu trang (Hero)</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Tiêu đề chính</label>
                    <input
                      type="text"
                      value={settings.hero.title}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Tiêu đề phụ</label>
                    <textarea
                      value={settings.hero.subtitle}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white resize-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Ảnh nền</label>
                  <div className="relative group h-48">
                    <div className="w-full h-full bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-emerald-500/50">
                      {heroImage || (settings.hero.backgroundImage && settings.hero.backgroundImage.trim() !== '') ? (
                        <img 
                          src={heroImage ? URL.createObjectURL(heroImage) : settings.hero.backgroundImage} 
                          alt="Hero Preview" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <>
                          <ImageIcon size={32} className="text-gray-300 mb-2" />
                          <span className="text-xs text-gray-400">Chọn ảnh nền</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && setHeroImage(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="text-emerald-600" size={20} />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Dịch vụ chính</h2>
              </div>
              <button
                onClick={addService}
                className="flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-700"
              >
                <Plus size={18} className="mr-1" /> Thêm dịch vụ
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settings.services.map((service, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600 relative group">
                    <button
                      onClick={() => removeService(index)}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Tên dịch vụ"
                        value={service.title}
                        onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white font-bold"
                      />
                      <textarea
                        placeholder="Mô tả ngắn"
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white text-sm resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Info */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700 flex items-center gap-2">
              <Phone className="text-emerald-600" size={20} />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Thông tin liên hệ</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Địa chỉ trụ sở</label>
                <input
                  type="text"
                  value={settings.contactInfo.address}
                  onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, address: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Số điện thoại</label>
                <input
                  type="text"
                  value={settings.contactInfo.phone}
                  onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, phone: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Email</label>
                <input
                  type="email"
                  value={settings.contactInfo.email}
                  onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, email: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Giờ làm việc</label>
                <input
                  type="text"
                  value={settings.contactInfo.workingHours}
                  onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, workingHours: e.target.value } })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
