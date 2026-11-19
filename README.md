# 🌾 ग्रामीण भारत TV (GRAMIN BHARAT TV)
### Official Regional OTT Streaming, Digital News Broadcasting & Citizen Empowerment Platform

> **टॅगलाइन:** "मातीची नाळ, महाराष्ट्राचा आवाज – ग्रामीण भारताचे डिजिटल व्यासपीठ"

---

## 📌 १. प्रकल्प परिचय (Project Overview)

**Gramin Bharat TV (ग्रामीण भारत टीव्ही)** हे महाराष्ट्रातील शेतकरी, कष्टकरी, युवक आणि ग्रामीण जनतेसाठी विकसित केलेले आधुनिक, प्रीमियम प्रादेशिक OTT स्ट्रीमिंग, डिजिटल वृत्तप्रसारण आणि लोकतक्रार निवारण प्लॅटफॉर्म आहे.

हे व्यासपीठ ३ प्रमुख सेवांचे परिपूर्ण एकत्रीकरण आहे:
1. **OTT सिनेमा व मूळ वेब सिरीज:** अस्सल मराठी ग्रामीण व सामाजिक चित्रपट, माहितीपट आणि वेब सिरीज (Bunny.net Stream Library ID: 809137 द्वारे 4K/1080p HLS अ‍ॅडॉप्टिव्ह स्ट्रीमिंग).
2. **२४ तास लाइव्ह टीव्ही व डिजिटल न्यूज पोर्टल:** दोन अधिकृत थेट वाहिन्या – *ग्रामीण भारत Live* (कृषी व APMC बाजारभाव) आणि *नामदार महाराष्ट्र Live* (मंत्रालय व राजकीय घडामोडी), सोबत महाराष्ट्रातील ३६ जिल्ह्यांतील स्थानिक बातम्या.
3. **नागरिक लोकतक्रार निवारण व्यासपीठ:** खेड्यापाड्यातील रस्ते, पाणी, वीज, आरोग्य समस्या थेट फोटोसह दाखल करण्याची सुविधा, युनिक ट्रॅकिंग आयडी (`GB-2026-MH-XXXX`) द्वारे थेट स्थिती ट्रॅकिंग, आणि संपादकीय मान्यतेनंतर बातमीत रूपांतर!

---

## 🛠️ २. तंत्रज्ञान स्टॅक (Technology Stack)

- **Frontend & App Architecture:** Next.js 15+ (App Router, Server Components & Client Actions)
- **Programming Language:** TypeScript
- **Styling & Design System:** Tailwind CSS, Custom Cinematic Dark Palette (`#0B0F17`, `#166534`, `#EA580C`)
- **Icons & Visuals:** Lucide React Icons
- **Video Player:** Custom Adaptive HLS Player powered by `hls.js` with quality switching (Auto, 1080p, 720p, 480p), speed control, fullscreen, and resume playback
- **Audio Player:** Dedicated podcast player with speed selector (0.75x to 2x), seek bar, and episode queue
- **Video CDN Integration:** Bunny.net Stream (Library ID: `809137`)
- **Payment Gateway:** Razorpay Gateway (UPI, GPay, PhonePe, Paytm, Cards, NetBanking) with HMAC SHA256 server verification
- **Database & Auth:** Firebase Cloud Firestore & Authentication with seamless local reactive state fallback
- **Multi-Language Support:** मराठी (Marathi - Default), हिन्दी (Hindi), English

---

## 🎨 ३. ब्रँड कलर्स व टायपोग्राफी (Brand Identity)

- **Primary Green:** `#166534` (शेत, शिवार व समृद्धीचे प्रतीक)
- **Accent Orange:** `#EA580C` (महाराष्ट्राचा भगवा व डिजिटल ऊर्जा)
- **Dark Cinema Background:** `#0B0F17` (प्रीमियम OTT थिएटर लुक)
- **Secondary Dark Card:** `#0F172A`
- **Cream Light:** `#FAF7F2`
- **White:** `#FFFFFF`

---

## 📁 ४. डायरेक्टरी रचना (Directory Structure)

```
d:\gramin bharat web site\
├── src/
│   ├── app/
│   │   ├── layout.tsx                // Root Layout with providers
│   │   ├── globals.css               // Brand theme & responsive scrollbars
│   │   ├── page.tsx                  // Homepage (Hero carousel, rows, live channels, schemes, podcasts, app download)
│   │   ├── movies/
│   │   │   ├── page.tsx              // All Movies with filters (Free/Premium, Genres)
│   │   │   └── [id]/page.tsx         // Movie detail, cast, Bunny HlsPlayer, related movies
│   │   ├── series/
│   │   │   ├── page.tsx              // Web series catalog
│   │   │   └── [id]/page.tsx         // Series seasons, episodes, player, autoplay
│   │   ├── live/
│   │   │   └── page.tsx              // Live TV: Gramin Bharat Live & Namdar Maharashtra Live, HLS player & EPG
│   │   ├── news/
│   │   │   ├── page.tsx              // 10 categories, breaking news, featured stories
│   │   │   └── [id]/page.tsx         // Full article, reporter badge, social share, related news
│   │   ├── district-news/
│   │   │   └── page.tsx              // Interactive 36 Maharashtra Districts & Talukas hierarchy news
│   │   ├── grievance/
│   │   │   ├── page.tsx              // Citizen Grievance Submission with photo evidence
│   │   │   └── track/page.tsx        // Live Grievance Tracking Timeline (GB-2026-MH-XXXX)
│   │   ├── podcasts/
│   │   │   └── page.tsx              // Agricultural & rural success podcasts with audio player
│   │   ├── subscribe/
│   │   │   └── page.tsx              // ₹399/yr & ₹149/mo plans with Razorpay checkout & receipts
│   │   ├── profile/
│   │   │   └── page.tsx              // User Profile, active subscription, watchlist, watch history, invoices
│   │   ├── search/
│   │   │   └── page.tsx              // Unified search across movies, series, news, podcasts
│   │   ├── app-download/
│   │   │   └── page.tsx              // Android APK & Play Store showcase
│   │   ├── about/page.tsx            // About Gramin Bharat TV, mission & values
│   │   ├── team/page.tsx             // Editorial board, Bureau Chiefs & MD Profile
│   │   ├── contact/page.tsx          // Headquarters, bureau contacts, feedback form
│   │   ├── legal/                    // IT Rules 2021, Grievance Officer, Privacy, Terms, Refund, Ethics
│   │   ├── admin/
│   │   │   ├── layout.tsx            // Admin Sidebar, role switcher, secure shell
│   │   │   ├── login/page.tsx        // Admin login with 1-click test roles
│   │   │   ├── page.tsx              // Dashboard with KPI stats, revenue, audit logs
│   │   │   ├── movies/page.tsx       // Movies CRUD & Bunny.net Library ID 809137
│   │   │   ├── series/page.tsx       // Web Series & Episode management
│   │   │   ├── live/page.tsx         // Live Channels & EPG scheduler
│   │   │   ├── news/page.tsx         // News CMS & Breaking News publisher
│   │   │   ├── grievances/page.tsx   // Grievance CMS with "Convert to News" feature
│   │   │   ├── podcasts/page.tsx     // Audio podcast management
│   │   │   ├── banners/page.tsx      // OTT hero slider banners
│   │   │   ├── users/page.tsx        // Users & subscribers
│   │   │   ├── subscriptions/page.tsx// Revenue & Razorpay transactions
│   │   │   ├── reports/page.tsx      // Reports with real CSV export
│   │   │   ├── settings/page.tsx     // Corporate CIN, GSTIN, Grievance Officer, Bunny & Razorpay keys
│   │   │   └── audit/page.tsx        // Audit trail of administrative actions
│   │   └── api/
│   │       └── razorpay/
│   │           ├── create-order/route.ts
│   │           └── verify-payment/route.ts
│   ├── components/
│   │   ├── layout/                   // Header, Footer, BreakingNewsTicker, AppDownloadBanner, AppShell
│   │   ├── video/                    // HlsPlayer.tsx (Bunny.net Stream), AudioPlayer.tsx
│   │   └── ui/                       // ContentCard.tsx, ContentRow.tsx, NewsCard.tsx
│   ├── context/                      // AuthContext, LanguageContext, ToastContext
│   ├── data/seedData.ts              // Master realistic Maharashtra regional seed content
│   ├── lib/
│   │   ├── db.ts                     // Unified Data Service (Firestore + reactive local sync)
│   │   ├── districts.ts              // Official 36 Maharashtra Districts & Talukas
│   │   ├── bunny.ts                  // Bunny.net Stream utilities (Library ID: 809137)
│   │   ├── razorpay.ts               // Razorpay signature verification & HMAC
│   │   └── firebase.ts               // Firebase SDK configuration
│   └── types/index.ts                // Full TypeScript schemas
```

---

## 🔑 ५. Bunny.net Stream इंटिग्रेशन (Library ID: 809137)

Gramin Bharat TV मधील व्हिडिओ आणि थेट प्रक्षेपण Bunny.net Stream द्वारे समर्थित आहे:
- **Library ID:** `809137`
- **HLS Stream URL Format:** `https://vz-809137-b-cdn.net/<VIDEO_ID>/playlist.m3u8`
- **Iframe Embed Format:** `https://iframe.mediadelivery.net/embed/809137/<VIDEO_ID>`

प्रशासक `/admin/movies` किंवा `/admin/live` मध्ये जाऊन थेट Bunny.net व्हिडिओ आयडी किंवा कस्टम HLS लिंक प्रविष्ट करू शकतात.

---

## 💳 ६. Razorpay पेमेंट इंटिग्रेशन

- **वार्षिक प्रीमियम प्लॅन:** ₹३९९ / वर्ष (सर्व चित्रपट, मालिका आणि Live TV जाहिरातमुक्त)
- **मोबाईल मासिक प्लॅन:** ₹१४९ / महिना
- **Server Verification API:** `/api/razorpay/verify-payment` HMAC SHA256 सह स्वाक्षरी पडताळणी करते.
- चाचणी किंवा डेव्हलपमेंट दरम्यान सिस्टीम तात्काळ चाचणी पेमेंट आणि अधिकृत जीएसटी पावती क्रमांक (उदा. `INV-GBTV-2026-1048`) निर्माण करते.

---

## 🛡️ ७. प्रशासकीय CMS व रोल-बेस्ड ॲक्सेस कंट्रोल (RBAC)

ॲडमिन पॅनलचा पत्ता: **`/admin`** (किंवा **`/admin/login`**)

### उपलब्ध भूमिका व अधिकार:
1. **Super Admin:** संपूर्ण सिस्टीम, महसूल, वापरकर्ते आणि वेबसाइट सेटिंग्जवर पूर्ण नियंत्रण.
2. **News Editor:** बातम्या तयार करणे, संपादन, ब्रेकिंग न्यूज टिकर आणि तक्रारींचे बातमीत रूपांतर.
3. **Content Manager:** चित्रपट, वेब सिरीज, पॉडकास्ट आणि होमपेज बॅनर्स व्यवस्थापन.
4. **Video Manager:** Bunny.net व्हिडिओ आयडी, HLS स्ट्रीम्स आणि Live TV EPG वेळापत्रक व्यवस्थापन.
5. **District Reporter:** नियुक्त झालेल्या जिल्हा बातम्या आणि नागरिक तक्रारींचा पाठपुरावा.
6. **Finance Manager:** वर्गणी महसूल, व्यवहार नोंदी आणि CSV अहवाल एक्सपोर्ट.

> 💡 *टीप:* ॲडमिन पॅनलमध्ये डाव्या बाजूला किंवा प्रोफाइल मेनूमध्ये **"भूमिका चाचणी (Quick Role Switcher)"** दिलेला आहे, ज्यामुळे प्रत्येक भूमिकेचे अधिकार तात्काळ तपासून पाहता येतात.

---

## 🚀 ८. स्थानिक रन कसे करावे (Running Locally)

```bash
# 1. आवश्यक पॅकेजेस इन्स्टॉल करा
npm install

# 2. डेव्हलपमेंट सर्व्हर सुरू करा
npm run dev
```

ब्राउझरमध्ये उघडा: [http://localhost:3000](http://localhost:3000)
प्रशासकीय CMS साठी: [http://localhost:3000/admin](http://localhost:3000/admin)

### प्रोडक्शन बिल्ड:
```bash
npm run build
npm start
```

---

## 📜 ९. कायदेशीर अनुपालन व संस्थात्मक माहिती

- **कंपनी नोंदणी (CIN):** `U92100MH2026PTC389104`
- **जीएसटी क्रमांक (GSTIN):** `27AABCG1234F1Z8`
- **तक्रार निवारण अधिकारी (IT Rules 2021):** एड. सुहास देशमुख (`grievance@graminbharattv.in` • +91 94230 00002)
- **नोंदणीकृत कार्यालय:** ग्राम संवाद भवन, एफ.सी. रोड, शिवाजीनगर, पुणे, महाराष्ट्र - ४११००५
- **अधिकृत हेल्पलाइन:** +91 94230 00000

# graminbharattv
