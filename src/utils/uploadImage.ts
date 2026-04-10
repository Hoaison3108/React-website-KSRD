import { auth } from '../firebase';

export const uploadImage = async (file: File, folderName: string = 'uploads'): Promise<string> => {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append('files', file);

  try {
    // Thử lấy token của admin hiện tại nếu có đăng nhập
    let token = '';
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    }

    const API_URL = (import.meta as any).env.VITE_UPLOAD_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/upload?folder=${folderName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Lưu ý: Không set 'Content-Type' vì fetch sẽ tự động sinh boundary cho FormData
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Lỗi tải ảnh: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.urls && data.urls.length > 0) {
      // Trả về URI ảnh tương đối (ví dụ: /uploads/...) thay vì dính cứng với localhost
      // Giúp dễ dàng đồng bộ khi deploy frontend và backend cùng chung một domain
      return data.urls[0]; 
    } else {
      throw new Error("API không trả về đường dẫn ảnh");
    }

  } catch (error) {
    console.error("Error uploading image (Node Backend):", error);
    throw error;
  }
};

export const deleteImage = async (urls: string | string[]): Promise<void> => {
  if (!urls) return;
  const urlArray = Array.isArray(urls) ? urls : [urls];
  if (urlArray.length === 0) return;

  try {
    let token = '';
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    }

    const API_URL = (import.meta as any).env.VITE_UPLOAD_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/delete-image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ urls: urlArray })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn("Lưu ý: " + (errorData.error || response.statusText));
    }
  } catch (error) {
    console.error("Error calling delete-image API (Node Backend):", error);
  }
};
