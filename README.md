# ব্লগ ওয়েবসাইট

একটি সম্পূর্ণ ব্লগ ওয়েবসাইট যা React, Node.js, MySQL এবং Bootstrap দিয়ে তৈরি।

## বৈশিষ্ট্য

### ফ্রন্টএন্ড (React)

- 🏠 হোমপেজ হিরো সেকশন সহ
- 📱 রেসপন্সিভ ডিজাইন (Bootstrap)
- 📝 ব্লগ পোস্ট পড়া
- 🎨 আকর্ষণীয় UI/UX
- 🔍 সাইডবার

### ব্যাকএন্ড (Node.js/Express)

- 🔐 এডমিন অথেনটিকেশন
- 📊 JWT টোকেন সিস্টেম
- 🗃️ MySQL ডাটাবেস
- 📁 ফাইল আপলোড (Multer)
- 🛡️ API ভ্যালিডেশন

### এডমিন ফিচার

- 🔑 সিকিউর লগিন সিস্টেম
- ✍️ ব্লগ তৈরি, এডিট, ডিলিট
- 📂 ক্যাটাগরি ম্যানেজমেন্ট
- 🖼️ ছবি/ভিডিও আপলোড
- 📄 CKEditor রিচ টেক্সট এডিটর
- 🏷️ স্লাগ সিস্টেম

### 🆕 SEO ও Analytics ফিচার

- 🔍 **SEO অপটিমাইজেশন**: Meta keywords ও description
- 📊 **Facebook Pixel**: User behavior tracking
- 📈 **Google Analytics**: Traffic ও conversion tracking
- 🌐 **Open Graph Tags**: Social media sharing optimization
- 🐦 **Twitter Cards**: Enhanced Twitter sharing
- 👁️ **View Counter**: Blog post view tracking

### 🎨 Enhanced ডিজাইন ফিচার

- ✨ **3D Featured Images**: Professional image presentation
- 🎭 **Image Overlays**: Hover effects with captions
- 🌈 **Gradient Effects**: Modern shadows ও animations
- 🖋️ **Professional Typography**: Playfair Display ও Inter fonts
- 📱 **Advanced Responsive**: Mobile-first design approach

## প্রযুক্তি স্ট্যাক

### ফ্রন্টএন্ড

- React 18
- React Router DOM
- Bootstrap 5
- Axios
- CKEditor 5

### ব্যাকএন্ড

- Node.js
- Express.js
- MySQL
- JWT
- Bcrypt
- Multer
- Express Validator

## ইনস্টলেশন

### প্রয়োজনীয় সফটওয়্যার

- Node.js (v14 বা তার উপরে)
- MySQL Server
- npm বা yarn

### ধাপ 1: রিপোজিটরি ক্লোন করুন

```bash
git clone <repository-url>
cd blog-website
```

### ধাপ 2: ব্যাকএন্ড সেটআপ

```bash
# Dependencies ইনস্টল করুন
npm install

# Environment variables সেট করুন
cp .env.example .env
```

### ধাপ 3: ডাটাবেস সেটআপ

```bash
# MySQL এ লগইন করুন
mysql -u root -p

# Database তৈরি করুন
source database.sql
```

### ধাপ 4: ফ্রন্টএন্ড সেটআপ

```bash
cd client
npm install
```

### ধাপ 5: Environment Variables

`.env` ফাইলে নিচের তথ্য যোগ করুন:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blog_db
JWT_SECRET=your_jwt_secret_key
```

## চালানো

### ব্যাকএন্ড সার্ভার

```bash
npm run dev
```

### ফ্রন্টএন্ড অ্যাপ

```bash
npm run client
```

## ব্যবহার

### এডমিন লগিন

- URL: `http://localhost:3000/admin/login`
- ডিফল্ট ইউজারনেম: `admin`
- ডিফল্ট পাসওয়ার্ড: `admin123`

### API Endpoints

#### অথেনটিকেশন

- `POST /api/auth/login` - এডমিন লগিন
- `GET /api/auth/me` - বর্তমান এডমিন তথ্য

#### ব্লগ

- `GET /api/blogs` - সব ব্লগ
- `GET /api/blogs/:slug` - নির্দিষ্ট ব্লগ
- `POST /api/blogs` - নতুন ব্লগ তৈরি (এডমিন)
- `PUT /api/blogs/:id` - ব্লগ আপডেট (এডমিন)
- `DELETE /api/blogs/:id` - ব্লগ মুছুন (এডমিন)

#### ক্যাটাগরি

- `GET /api/categories` - সব ক্যাটাগরি
- `POST /api/categories` - নতুন ক্যাটাগরি (এডমিন)
- `DELETE /api/categories/:id` - ক্যাটাগরি মুছুন (এডমিন)

## প্রজেক্ট স্ট্রাকচার

```
blog-website/
├── client/                 # React ফ্রন্টএন্ড
│   ├── src/
│   │   ├── components/     # React কম্পোনেন্ট
│   │   ├── pages/          # React পেজ
│   │   ├── contexts/       # React Context
│   │   └── App.js
│   └── public/
├── server/                 # Node.js ব্যাকএন্ড
│   ├── config/            # ডাটাবেস কনফিগারেশন
│   ├── middleware/        # Express মিডলওয়্যার
│   ├── routes/            # API রুট
│   ├── uploads/           # আপলোড ফাইল
│   └── server.js          # প্রধান সার্ভার ফাইল
├── database.sql           # MySQL স্কিমা
├── package.json
└── README.md
```

## কন্ট্রিবিউটিং

1. Fork করুন
2. নতুন ব্রাঞ্চ তৈরি করুন (`git checkout -b feature/amazing-feature`)
3. চেঞ্জ কমিট করুন (`git commit -m 'Add amazing feature'`)
4. ব্রাঞ্চ পুশ করুন (`git push origin feature/amazing-feature`)
5. Pull Request খুলুন

## লাইসেন্স

MIT লাইসেন্সের অধীনে বিতরণ করা হয়েছে।

## সাপোর্ট

কোন সমস্যা বা প্রশ্ন থাকলে Issue তৈরি করুন।
