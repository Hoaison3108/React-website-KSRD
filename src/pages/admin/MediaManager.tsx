import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, getMetadata, deleteObject, StorageReference } from 'firebase/storage';
import { storage } from '../../firebase';
import { Image as ImageIcon, Trash2, HardDrive, Loader2, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface MediaItem {
  ref: StorageReference;
  url: string;
  name: string;
  size: number;
  timeCreated: string;
  contentType: string;
  fullPath: string;
}

export default function MediaManager() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [totalSize, setTotalSize] = useState(0);
  const { showToast } = useToast();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const allFilesRefs: StorageReference[] = [];
      
      // Recursive function to scan all folders in Firebase Storage
      const traverseFolder = async (folderRef: StorageReference) => {
        const result = await listAll(folderRef);
        
        // Push files in this folder
        for (const itemRef of result.items) {
          allFilesRefs.push(itemRef);
        }
        
        // Scan subfolders
        for (const prefixRef of result.prefixes) {
          await traverseFolder(prefixRef);
        }
      };

      // Start from root
      await traverseFolder(ref(storage, ''));

      // Fetch details in parallel
      const itemsData = await Promise.all(
        allFilesRefs.map(async (fileRef) => {
          try {
            const url = await getDownloadURL(fileRef);
            const meta = await getMetadata(fileRef);
            return {
              ref: fileRef,
              url,
              name: meta.name,
              size: meta.size,
              timeCreated: meta.timeCreated,
              contentType: meta.contentType,
              fullPath: fileRef.fullPath
            } as MediaItem;
          } catch (err) {
            console.error("Error fetching file", fileRef.fullPath, err);
            return null;
          }
        })
      );

      const validItems = itemsData.filter((i): i is MediaItem => i !== null);
      
      // Sort by newest first
      validItems.sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime());
      
      setMediaItems(validItems);
      
      // Calculate total size
      const total = validItems.reduce((acc, curr) => acc + curr.size, 0);
      setTotalSize(total);
      
    } catch (error) {
      console.error("Error fetching media from storage", error);
      showToast('Lỗi khi tải kho hình ảnh.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xoá vĩnh viễn file "${item.name}" không?`)) {
      return;
    }

    setDeletingId(item.fullPath);
    try {
      await deleteObject(item.ref);
      setMediaItems(prev => prev.filter(m => m.fullPath !== item.fullPath));
      setTotalSize(prev => prev - item.size);
      showToast('Đã xoá file thành công!', 'success');
    } catch (error) {
      console.error("Lỗi khi xoá file", error);
      showToast('Lỗi khi xoá file, vui lòng thử lại.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ImageIcon className="text-emerald-500" />
            Quản Lý Thư Viện Media
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Toàn bộ ảnh/video đang lưu trữ trên Firebase Storage.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg">
            <HardDrive size={20} />
            <div>
              <div className="text-xs font-bold uppercase">Tổng dung lượng</div>
              <div className="text-lg font-bold">{formatSize(totalSize)}</div>
            </div>
          </div>
          
          <button 
            onClick={fetchFiles}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            Tải lại
          </button>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3">
        <AlertTriangle className="text-amber-500 shrink-0" size={20} />
        <div>
          <h3 className="text-amber-800 dark:text-amber-400 font-bold text-sm">Lưu ý quan trọng:</h3>
          <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
            Xoá file tại đây là xoá vật lý vĩnh viễn khỏi Cloud. Xin hãy cẩn trọng nếu ảnh này vẫn còn đang được nhúng trong các bài viết.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
            <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">Kho lưu trữ rỗng</h3>
          <p className="text-gray-500">Chưa có tệp tin nào được tải lên Firebase Storage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mediaItems.map((item) => (
            <div 
              key={item.fullPath} 
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="aspect-square relative bg-gray-100 dark:bg-gray-900 overflow-hidden flex items-center justify-center">
                {item.contentType.startsWith('image/') ? (
                  <img 
                    src={item.url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <HardDrive size={32} className="mb-2" />
                    <span className="text-xs font-bold uppercase">{item.contentType.split('/')[1] || 'FILE'}</span>
                  </div>
                )}
                
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-white/20 hover:bg-emerald-500 text-white rounded-full transition-colors backdrop-blur-sm"
                    title="Mở ảnh"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button 
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item.fullPath}
                    className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-sm disabled:opacity-50"
                    title="Xoá vĩnh viễn"
                  >
                    {deletingId === item.fullPath ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="p-3">
                <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate" title={item.name}>
                  {item.name}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                    {formatSize(item.size)}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate ml-1">
                    {formatDate(item.timeCreated)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
