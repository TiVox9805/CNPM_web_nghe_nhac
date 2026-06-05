<h1 align="center">Dreamwever Application ✨</h1>

![Demo App](/frontend/public/dreamweaver.png)


About This Course:

-   🎸 Listen to music, play next and previous songs
-   🔈 Update the volume with a slider
-   🎧 Admin dashboard to create albums and songs
-   💬 Real-time Chat App integrated into Spotify
-   👨🏼‍💼 Online/Offline status
-   👀 See what other users are listening to in real-time
-   📊 Aggregate data for the analytics page
-   🚀 And a lot more...

### Setup .env file in _backend_ folder

```bash
PORT=...
MONGODB_URI=...
ADMIN_EMAIL=...
NODE_ENV=...

CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_CLOUD_NAME=...


CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### Setup .env file in _frontend_ folder

```bash
VITE_CLERK_PUBLISHABLE_KEY=...
```
### 2. Cài đặt các thư viện & Chạy ứng dụng
Bạn có thể chạy độc lập từng phần hoặc sử dụng script ở thư mục gốc:
#### Cách 1: Chạy độc lập từng phần
**Chạy Backend Server:**
```bash
cd backend
npm install
npm start
```
*Backend sẽ khởi chạy tại cổng cấu hình (ví dụ: `http://localhost:5000`).*
**Chạy Frontend Client:**
```bash
cd frontend
npm install
npm run dev
```
*Frontend sẽ chạy dưới môi trường Vite (ví dụ: `http://localhost:5173`).*
#### Cách 2: Sử dụng Script ở thư mục gốc dán sẵn
**Cài đặt toàn bộ thư viện & Build:**
```bash
npm run build
```
**Khởi chạy dự án:**
```bash
npm start
```
