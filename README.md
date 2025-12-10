# 💕⚽ Becko & Ava's Wedding Guestbook

A beautiful, interactive Progressive Web App (PWA) for wedding guests to share messages, photos, and videos to celebrate Becko & Ava's special day.

**Live Site:** [becko-ava-wedding.vercel.app](https://becko-ava-wedding.vercel.app/)

## ✨ Features

- **Guest Messages** - Leave heartfelt messages for the happy couple
- **Photo & Video Upload** - Share memories with up to 5 photos + 1 video per message
- **Interactive Gallery** - Browse all submitted photos and videos with Swiper carousel
- **PWA Support** - Installable on mobile devices with offline capabilities
- **Admin Dashboard** - Secure admin panel to view, moderate, and download all guest submissions
- **Image Optimization** - Automatic compression and optimization for fast loading
- **Beautiful Animations** - Confetti effects, sparkles, and smooth transitions throughout

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Supabase** | Backend storage for messages, images, and videos |
| **React Dropzone** | Intuitive drag-and-drop file uploads |
| **SwiperJS** | Smooth, responsive image/video carousels |
| **Browser Image Compression** | Client-side image optimization |
| **PWA** | Service worker for offline support & installability |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account with a project set up

### Installation

1. Clone the repository:
git clone https://github.com/GinaHorch/becko-ava-wedding.git
cd becko-ava-wedding

2. Install dependencies:
npm install

3. Create a `.env.local` file with your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

4. Run the development server:
npm run dev 
Open [http://localhost:3000](http://localhost:3000) to view the app

### Build for Production

npm run build
npm start

🔐 Admin Access
The admin dashboard is accessible at /admin/login with secure authentication. Admins can:
View all guest messages, photos, and videos
Approve or reject submissions
Download media files
Moderate content

## 📱 PWA Features

The app includes full PWA support:
- **Installable** - Add to home screen on iOS and Android
- **Offline Mode** - Basic functionality available without internet
- **Service Worker** - Caches static assets for faster loading
- **QR Code** - Easy sharing via QR code on fliers

## 🎨 Design & Credits

**Design & Visual Identity:** [Bianca Di Biase](https://www.linkedin.com/in/bianca-di-biase/) - Web Designer  
**Development:** Gina Horch  
**Deployed on:** [Vercel](https://vercel.com)

Special thanks to Bianca Di Biase for the beautiful design, custom illustrations, and thoughtful UX that brought this wedding guestbook to life.

## 📄 License

This project is a private wedding guestbook for Becko & Ava. All rights reserved.

---

Made with 💕 for Becko & Ava's special day

