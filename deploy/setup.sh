#!/bin/bash
# ===================================================================
# SCRIPT KHỞI TẠO SIÊU TỐC CHO HOSTINGER VPS (UBUNTU 22.04 / 24.04)
# ===================================================================

echo "🚀 Bắt đầu quá trình thợ săn rèn VPS của KSRD..."

# 1. Cập nhật hệ thống lõi
echo "[1/4] Đang vệ sinh hệ thống & cập nhật package..."
sudo apt update && sudo apt upgrade -y

# 2. Cài Nginx & Trình duyệt mã hóa (Certbot)
echo "[2/4] Cài đặt Cổng gác Nginx & Kỹ sư sinh bảo mật HTTPS Certbot..."
sudo apt install -y nginx certbot python3-certbot-nginx

# 3. Cài đặt Node.js mới nhất qua NVM hoặc Repo chuẩn & Trình sát thủ PM2
echo "[3/4] Cài đặt Não bộ Node.js và Quản gia dọn dẹp PM2..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# 4. Tạo phòng chứa bí mật
echo "[4/4] Khai mở hầm chứa Website..."
sudo mkdir -p /var/www/ksrd/html
sudo mkdir -p /var/www/ksrd/api
sudo chown -R $USER:$USER /var/www/ksrd/

echo "✅ TIẾN TRÌNH HOÀN TẤT TUYỆT ĐỐI!"
echo ""
echo "=== CHỈ DẪN SAU CÙNG ==="
echo "1. Hãy copy/keo thả toàn bộ thư mục [dist] của bạn nhét vào: /var/www/ksrd/html/"
echo "2. Hãy bế nguyên thư mục [upload-server] vứt vào: /var/www/ksrd/api/"
echo "3. Copy nội dung file nginx.conf tôi làm cho bạn chép đè vào: /etc/nginx/sites-available/default"
echo "4. Nhập lệnh [sudo nginx -t] để check lỗi chính tả, không gì sai thì bấm [sudo systemctl restart nginx]"
echo "5. Vào thư mục api bằng lệnh [cd /var/www/ksrd/api], gõ [npm install] -> [pm2 start server.js]"
echo "6. Cuối cùng bấm [sudo certbot --nginx] để ban phước chứng chỉ Xanh cho tên miền. Bùm! Hưởng thành quả!"
