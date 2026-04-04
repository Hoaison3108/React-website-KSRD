import React, { useState, useRef } from 'react';
import { uploadImage as apiUploadImage } from '../../utils/uploadImage';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: string;
  multiple?: boolean;
  required?: boolean;
  helpText?: React.ReactNode;
}

export default function ImageUpload({ 
  label, 
  value, 
  onChange, 
  folder, 
  multiple = false,
  required = false,
  helpText
}: ImageUploadProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Filter large files
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} vượt quá 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      if (!multiple) {
        const file = validFiles[0];
        const downloadURL = await uploadSingleFile(file);
        onChange(downloadURL);
      } else {
        // Multi upload
        const urls: string[] = [];
        let completed = 0;
        
        for (const file of validFiles) {
          const url = await uploadSingleFile(file, (p) => {
            // Aggregate progress roughly
            const overallProgress = ((completed * 100) + p) / validFiles.length;
            setProgress(Math.round(overallProgress));
          });
          urls.push(url);
          completed++;
        }
        
        // Append to existing newline separated URLs
        const existing = value ? value.trim() : '';
        const newUrls = urls.join('\n');
        onChange(existing ? `${existing}\n${newUrls}` : newUrls);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError('Lỗi tải ảnh: ' + err.message);
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const uploadSingleFile = async (file: File, onProgress?: (p: number) => void): Promise<string> => {
    // Local processing is generally fast, emit fake progress
    if (onProgress) onProgress(30);
    else setProgress(30);
    
    try {
      const downloadURL = await apiUploadImage(file, folder);
      
      if (onProgress) onProgress(100);
      else setProgress(100);
      
      return downloadURL;
    } catch (e) {
      if (onProgress) onProgress(0);
      else setProgress(0);
      throw e;
    }
  };

  const urls = multiple ? (value ? value.split('\n').filter(u => u.trim() !== '') : []) : (value ? [value] : []);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg self-start sm:self-auto shrink-0 border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
              mode === 'url' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <LinkIcon size={14} /> Dán URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
              mode === 'upload' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <UploadCloud size={14} /> Trực tiếp (Upload)
          </button>
        </div>
      </div>
      
      {helpText && <div className="mb-2">{helpText}</div>}

      <div className="flex flex-col gap-4">
        {mode === 'url' ? (
          multiple ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white h-28 resize-none text-sm"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              required={required}
            />
          ) : (
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white text-sm"
              placeholder="https://example.com/image.jpg"
              required={required}
            />
          )
        ) : (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-6 text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple={multiple}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={uploading}
            />
            
            {uploading ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-4">
                <Loader2 size={32} className="animate-spin text-emerald-500" />
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Đang tải lên... {progress}%</div>
                <div className="w-full max-w-xs h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 py-4 pointer-events-none">
                <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  Click hoặc kéo thả file vào đây
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Hỗ trợ PNG, JPG, WEBP. Tối đa 5MB{multiple ? ' mỗi ảnh.' : '.'}
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800/50">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Live Preview Section */}
        {urls.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
              <ImageIcon size={14} /> Xem trước ({urls.length} ảnh)
              {mode === 'upload' && !multiple && urls.length > 0 && (
                <span className="ml-auto flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                  <CheckCircle2 size={12} /> Đã tải lên
                </span>
              )}
            </div>
            
            {multiple ? (
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {urls.map((url, idx) => (
                  <div key={idx} className="relative group shrink-0">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                      <img 
                        src={url} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2JkNWUxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSI+PC9jaXJjbGU+PHBhdGggZD0iTTIxIDE1bC01LTVMNSAxNSI+PC9wYXRoPjwvc3ZnPg==' }}
                      />
                    </div>
                    {mode === 'upload' && (
                      <button 
                        type="button"
                        onClick={() => {
                          const newUrls = urls.filter((_, i) => i !== idx);
                          onChange(newUrls.join('\n'));
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 relative group">
                <img 
                  src={urls[0]} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2JkNWUxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSI+PC9jaXJjbGU+PHBhdGggZD0iTTIxIDE1bC01LTVMNSAxNSI+PC9wYXRoPjwvc3ZnPg==' }}
                />
                {mode === 'upload' && (
                  <button 
                    type="button"
                    onClick={() => onChange('')}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
