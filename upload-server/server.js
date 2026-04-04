import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import admin from 'firebase-admin';

// ------------------------------------------------------------------------------
// 1. CHUẨN BỊ MÔI TRƯỜNG & FIREBASE ADMIN
// Để hệ thống check được Token, bạn TỰ TẢI file serviceAccountKey.json từ Firebase 
// (Project Settings > Service Accounts > Generate new private key)
// và ném vào trong thư mục upload-server nhé. Tạm thời nếu KHÔNG có file này, 
// hệ thống sẽ vẫn cho upload (Bypass mode) để bạn dễ Test ở Dev, nhưng khi lên host bạn nên Bật lại.
// ------------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isFirebaseReady = false;

try {
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isFirebaseReady = true;
    console.log('✅ Firebase Admin đã kích hoạt. (Đã có chứng chỉ bảo mật)');
  } else {
    console.warn('⚠️ CẢNH BÁO: Chưa tìm thấy serviceAccountKey.json.');
    console.warn('Hệ thống đang chạy MỞ, bất kỳ ai cũng có thể up ảnh. Hãy bổ sung key trước khi Deploy public!');
  }
} catch (error) {
  console.error('Lỗi cấu hình Firebase Admin:', error.message);
}

// ------------------------------------------------------------------------------
// 2. CẤU HÌNH MIDDLEWARE BẢO MẬT & API
// ------------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Chấp nhận tất cả miền gọi vào. (Khi lên production, cấu hình lại giới hạn domain của bạn thôi)
app.use(express.json());

// Mở public thư mục images để React lấy ảnh về hiển thị
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// ------------------------------------------------------------------------------
// 3. CẤU HÌNH MULTER (Nơi và Cách thức lưu file)
// ------------------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Nhận thông điệp folder từ params (nếu có: products, news, projects)
    const subFolder = req.query.folder || 'uploads';
    // Đảm bảo loại bỏ các ký tự dấu / tránh tấn công path traversal nhưng vẫn cho phép thư mục con
    const safeSubFolder = subFolder.replace(/\.\./g, '').replace(/^\/+/, '');
    
    const dir = path.join(__dirname, 'public', 'images', safeSubFolder);
    
    // Nếu thư mục chưa tồn tại, tự động tạo ra
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Đặt lại tên file tránh trùng lắp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Thay thế khoảng trắng bằng dấu gạch ngang ở tên file gốc
    const safeName = file.originalname.trim().replace(/\s+/g, '-');
    cb(null, uniqueSuffix + '-' + safeName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Giới hạn 10MB/ảnh
});

// Middleware xác thực bảo mật tài khoản admin
const verifyAdminToken = async (req, res, next) => {
  // Bỏ qua check nếu chưa setup service Account
  if (!isFirebaseReady) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Không tìm thấy Token ủy quyền' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Tùy chọn: Bạn có thể bắt cứng Email của bạn ở đây để chắc chắn chỉ MÌNH bạn up được
    if (decodedToken.email !== 'hoaison3108@gmail.com' && !decodedToken.admin) {
      return res.status(403).json({ error: 'Bạn không có quyền quản trị (Admin) để Upload.' });
    }
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Lỗi xác minh token:', error);
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};

// ------------------------------------------------------------------------------
// 4. API TẢI FILE (/api/upload)
// ------------------------------------------------------------------------------
// Sử dụng upload.array() để tải được nhiều file cùng lúc (tối đa 10)
app.post('/api/upload', verifyAdminToken, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Xin vui lòng đính kèm một file ảnh' });
    }

    const subFolder = req.query.folder || 'uploads';
    const safeSubFolder = subFolder.replace(/\.\./g, '').replace(/^\/+/, '');

    // Trả về danh sách URL của các ảnh vừa up
    const urls = req.files.map(file => {
      // URL này có dạng: /images/products/covers/tên-ảnh.jpg
      return `/images/${safeSubFolder}/${file.filename}`;
    });

    res.status(200).json({ 
      message: 'Upload thành công', 
      urls: urls 
    });

  } catch (error) {
    console.error('Lỗi Upload Router:', error);
    res.status(500).json({ error: 'Lỗi bộ cân bằng tải ảnh trên Server.' });
  }
});

// ------------------------------------------------------------------------------
// 5. API XÓA FILE (/api/delete-image)
// ------------------------------------------------------------------------------
app.delete('/api/delete-image', verifyAdminToken, (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'Payload không hợp lệ. Cần danh sách urls.' });
    }

    let deletedCount = 0;
    const errors = [];

    urls.forEach(url => {
      if (!url) return;
      try {
        // url có dạng /images/products/covers/anh.jpg
        // Ta cần bóc tách để lấy thư mục chính xác trong /public
        const decodeUrl = decodeURIComponent(url);
        // Loại bỏ origin (như http://localhost:5000) nếu có truyền vào dư thừa
        const pathOnly = decodeUrl.replace(/^https?:\/\/[^\/]+/, '');
        
        if (pathOnly.startsWith('/images/')) {
          // Lấy đoạn sau '/images/' để join với gốc folder
          const relativePath = pathOnly.replace('/images/', '');
          // Chống leo thang thư mục (path traversal)
          const safeRelativePath = relativePath.replace(/\.\./g, '');
          
          const targetFile = path.join(__dirname, 'public', 'images', safeRelativePath);
          if (fs.existsSync(targetFile)) {
            fs.unlinkSync(targetFile);
            deletedCount++;
          }
        }
      } catch (err) {
        errors.push({ url, error: err.message });
      }
    });

    res.status(200).json({ message: `Đã xóa ${deletedCount} file thành công`, errors });
  } catch (error) {
    console.error('Lỗi API Xóa Ảnh:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi xóa ảnh.' });
  }
});


// Trang chủ Test API
app.get('/', (req, res) => {
  res.send('🔥 KSRD Upload Server Backend is running!');
});

// Khởi chạy hệ máy chủ
app.listen(PORT, () => {
  console.log(`🚀 Upload Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📂 Các ảnh được lưu trữ công khai tại http://localhost:${PORT}/images/`);
});
