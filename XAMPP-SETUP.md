# XAMPP এর সাথে ব্লগ ওয়েবসাইট সেটআপ গাইড

## ধাপ ১: XAMPP চালু করুন

1. XAMPP Control Panel খুলুন
2. **Apache** এবং **MySQL** চালু করুন (Start বাটন চাপুন)
3. MySQL এর পাশে **Admin** বাটন চাপুন (phpMyAdmin খুলবে)

## ধাপ ২: ডাটাবেস সেটআপ করুন

টার্মিনালে এই কমান্ড চালান:

```bash
npm run setup-db
```

## ধাপ ৩: ডাটাবেস টেস্ট করুন

```bash
npm run test-db
```

## ধাপ ৪: সার্ভার চালু করুন

```bash
npm run dev
```

## ধাপ ৫: ক্লায়েন্ট চালু করুন

নতুন টার্মিনাল খুলে:

```bash
npm run client
```

## ধাপ ৬: ব্রাউজারে টেস্ট করুন

- **ওয়েবসাইট**: http://localhost:3000
- **এডমিন লগিন**: http://localhost:3000/admin/login
- **ইউজারনেম**: admin
- **পাসওয়ার্ড**: admin123

## সমস্যা সমাধান:

1. **Database connection failed** - XAMPP এর MySQL চালু আছে কিনা দেখুন
2. **Port already in use** - XAMPP এর Apache বন্ধ করুন অথবা port পরিবর্তন করুন
3. **Module not found** - `npm install` চালান

## গুরুত্বপূর্ণ ফাইল:

- `.env` - ডাটাবেস কনফিগারেশন
- `database.sql` - ডাটাবেস স্ক্রিমা
- `setup-database.js` - ডাটাবেস সেটআপ স্ক্রিপ্ট
- `test-database.js` - ডাটাবেস টেস্ট স্ক্রিপ্ট
