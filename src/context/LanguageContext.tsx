'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  mr: {
    // Navigation
    home: 'मुख्यपृष्ठ',
    movies: 'चित्रपट',
    webSeries: 'वेब सिरीज',
    liveTv: 'Live TV',
    news: 'बातम्या',
    podcasts: 'पॉडकास्ट',
    districtNews: '३६ जिल्हे',
    publicGrievance: 'लोक तक्रार',
    subscriptions: 'प्लॅन्स',
    appDownload: 'ॲप',
    aboutUs: 'आमच्याबद्दल',
    contactUs: 'संपर्क',
    search: 'चित्रपट, बातम्या, योजना शोधा...',
    login: 'लॉगिन करा',
    logout: 'बाहेर पडा',
    subscribePremium: 'प्रीमियम घ्या',
    adminPanel: 'प्रशासक कक्ष',
    profile: 'माझे प्रोफाईल',
    watchlist: 'माझी यादी',
    history: 'पाहिलेले व्हिडिओ',

    // Top Bar & Live
    liveEdition: 'थेट आवृत्ती',
    tickerLine1: '🌾 शेती, शिवार आणि महाराष्ट्राच्या जनतेचा अधिकृत आवाज',
    tickerLine2: '• APMC ताजे भाव: कांदा ₹२,४५० • कापूस ₹७,८०० • सोयाबीन ₹४,६०० • तूर ₹१०,२०० • गहू ₹२,८००',
    tickerLine3: '• दूध दर: गाय दूध ₹३८/लिटर, म्हैस दूध ₹६५/लिटर',
    tickerLine4: '• हवामान: राज्यात पुढील ३ दिवस हवामान प्रामुख्याने कोरडे राहण्याची शक्यता',
    tickerLine5: '• लोक तक्रार निवारण: आपल्या गावातील समस्या मांडण्यासाठी GBTV पोर्टलवर थेट नोंदणी करा',

    // Hero & OTT
    specialPremiere: 'विशेष प्रीमियर',
    watchNow: 'आता पहा',
    watchTrailer: 'ट्रेलर पहा',
    trendingMovies: 'ट्रेंडिंग चित्रपट',
    latestMovies: 'नवे चित्रपट',
    popularSeries: 'लोकप्रिय वेब सिरीज',
    continueWatching: 'पुन्हा सुरू करा',
    featuredSchemes: 'शासकीय योजना व लाभ',
    popularPodcasts: 'गाजलेले पॉडकास्ट',
    exploreMore: 'आणखी पहा',
    free: 'मोफत',
    premium: 'प्रीमियम',
    duration: 'कालावधी',
    director: 'दिग्दर्शक',
    producer: 'निर्माता',
    cast: 'कलाकार',
    featuredMoviesTitle: 'अस्सल मराठी चित्रपट',
    getPremiumPrice: 'प्रीमियम घ्या (₹३९९/वर्ष)',

    // News
    breakingNews: 'ब्रेकिंग न्यूज',
    latestNews: 'ताज्या घडामोडी',
    newsPortalTag: 'महाराष्ट्राचा आवाज (Maharashtra News)',
    newsPortalHeading: 'ताज्या व महत्त्वाच्या घडामोडी',
    viewAllNews: 'सर्व बातम्या पहा',
    filterByDistrict: 'जिल्ह्यानुसार बातम्या',
    selectDistrict: 'जिल्हा निवडा',
    selectTaluka: 'तालुका निवडा',
    allDistricts: 'सर्व ३६ जिल्हे',
    allCategories: 'सर्व वर्गवारी',
    readMore: 'सविस्तर वाचा',
    shareArticle: 'बातमी शेअर करा',
    publishedOn: 'प्रसिद्धी दिनांक',

    // Govt Schemes
    schemesTag: 'थेट लाभ योजना (Government Schemes)',
    schemesTitle: 'शेतकरी व ग्रामीण शासकीय योजना',
    allSchemes: 'सर्व योजना →',
    schemeBadge: 'योजना माहिती',
    schemeEligibility: 'पात्रता व अर्ज कसा करावा →',

    // Podcasts
    podcastsTag: 'आवाज ग्रामीण भारताचा (Podcasts & Audio)',
    podcastsTitle: 'प्रगतीशील शेती व ग्रामीण यशोगाथा',
    listenAllPodcasts: 'सर्व पॉडकास्ट ऐका',
    listensCountSuffix: 'वेळा ऐकले',
    minutesSuffix: 'मिनिटे',

    // Grievance Section
    grievanceBannerTag: 'थेट जनसुनावणी व्यासपीठ',
    grievanceBannerTitle: 'आपल्या गावातील रस्ते, पाणी, वीज समस्यांचे निवारण हवे आहे?',
    grievanceBannerDesc: 'ग्रामीण भारत टीव्हीच्या लोकतक्रार निवारण पोर्टलवर थेट तक्रार नोंदवा. आमचे जिल्हा बातमीदार शासकीय अधिकाऱ्यांशी संपर्क साधून समस्या सोडवण्यासाठी पाठपुरावा करतील.',
    submitGrievance: 'तक्रार दाखल करा (Submit)',
    trackGrievance: 'तक्रार स्थिती तपासा (Track)',
    submitGrievanceTitle: 'आपली समस्या थेट मांडून दाद मागा',
    trackGrievanceTitle: 'तक्रार स्थिती तपासा',
    trackingIdPlaceholder: 'उदा. GB-2026-MH-4821',
    trackBtn: 'स्थिती पहा',
    fullName: 'आपले पूर्ण नाव',
    mobileNumber: 'मोबाईल क्रमांक (सुरक्षित ठेवला जाईल)',
    village: 'गाव / ग्रामपंचायत',
    issueCategory: 'समस्येचे स्वरूप',
    issueTitle: 'समस्येचे संक्षिप्त शीर्षक',
    issueDesc: 'सविस्तर तक्रार व माहिती',
    uploadPhoto: 'समस्येचे छायाचित्र जोडा',
    submitGrievanceBtn: 'तक्रार दाखल करा',

    // Subscription Section
    annualPlanTag: 'प्रीमियम वार्षिक प्लॅन (Official Active Plan)',
    pricingTitle: 'केवळ ₹३९९ / वर्ष (₹३३/महिना)',
    pricingSubtitle: 'ग्रामीण महाराष्ट्राचा अधिकृत OTT व डिजिटल न्यूज प्लॅटफॉर्म – संपूर्ण कुटुंबियांचे दर्जेदार मनोरंजन!',
    benefit1: 'सर्व चित्रपट व मालिका 4K UHD मध्ये',
    benefit2: '24x7 सर्व थेट प्रक्षेपण (Live TV)',
    benefit3: 'जाहिरातमुक्त मनोरंजन (Ad-Free)',
    benefit4: 'एकाच वेळी ४ स्क्रीन्सवर पहा',
    benefit5: 'ऑफलाइन डाउनलोड सुविधा',
    subscribeNowBtn: 'आत्ताच सबस्क्राइब करा (₹३९९/वर्ष)',
    securePaymentNote: 'सुरक्षित Razorpay पेमेंट गेटवे • UPI, Google Pay, PhonePe, Paytm आणि Cards द्वारे सुलभ पेमेंट',
    annualPlan: 'वार्षिक प्रीमियम प्लॅन',
    monthlyPlan: 'मोबाईल मासिक प्लॅन',
    payWithRazorpay: 'Razorpay द्वारे सुरक्षित पेमेंट करा',
    guarantee: '१००% सुरक्षित व्यवहार • UPI, Cards, NetBanking',

    // App Download
    appTag: 'मोबाईल ॲप उपलब्ध (Android App)',
    appTitle: 'ग्रामीण भारत टीव्ही Android App डाऊनलोड करा',
    appDesc: '२४ तास थेट बातम्या, कमी इंटरनेटवर हाय-स्पीड व्हिडिओ स्ट्रीमिंग, ऑफलाइन डाऊनलोड्स आणि थेट आपल्या गावातून समस्या मांडण्याची विशेष सुविधा!',
    appBenefit1: 'अखंड HLS व्हिडिओ स्ट्रीमिंग (४K व HD)',
    appBenefit2: 'ऑफलाइन सेव्ह करा व नंतर पहा',
    appBenefit3: 'हवामान व बाजारभाव इन्स्टंट अलर्ट्स',
    appBenefit4: 'थेट फोटोसह नागरिक तक्रार नोंदणी',
    googlePlayBtn: 'Google Play Store',

    // Footer & Tagline
    tagline: 'मातीची नाळ, महाराष्ट्राचा आवाज – ग्रामीण भारताचे डिजिटल व्यासपीठ',
    allRightsReserved: 'सर्व हक्क सुरक्षित. ग्रामीण भारत टीव्ही नेटवर्क.',
    terms: 'नियम व अटी',
    privacy: 'गोपनीयता धोरण',
    refund: 'परतावा धोरण',
    ethics: 'डिजिटल मीडिया आचारसंहिता',
  },

  hi: {
    // Navigation
    home: 'मुख्य पृष्ठ',
    movies: 'फिल्में',
    webSeries: 'वेब सीरीज',
    liveTv: 'Live TV',
    news: 'समाचार',
    podcasts: 'पॉडकास्ट',
    districtNews: '३६ जिले',
    publicGrievance: 'जन शिकायत',
    subscriptions: 'प्लान्स',
    appDownload: 'ऐप',
    aboutUs: 'हमारे बारे में',
    contactUs: 'संपर्क',
    search: 'फिल्में, समाचार, योजनाएं खोजें...',
    login: 'लॉग इन करें',
    logout: 'लॉग आउट',
    subscribePremium: 'प्रीमियम लें',
    adminPanel: 'प्रशासक कक्ष',
    profile: 'मेरी प्रोफाइल',
    watchlist: 'मेरी सूची',
    history: 'देखे गए वीडियो',

    // Top Bar & Live
    liveEdition: 'लाइव संस्करण',
    tickerLine1: '🌾 खेती, किसानी और महाराष्ट्र की जनता की आधिकारिक आवाज',
    tickerLine2: '• मंडी भाव: प्याज ₹२,४५० • कपास ₹७,८०० • सोयाबीन ₹४,६०० • अरहर ₹१०,२०० • गेहूं ₹२,८००',
    tickerLine3: '• दुग्ध दर: गाय दूध ₹३८/लीटर, भैंस दूध ₹६५/लीटर',
    tickerLine4: '• मौसम: राज्य में अगले ३ दिन मौसम मुख्य रूप से शुष्क रहने की संभावना',
    tickerLine5: '• जन शिकायत निवारण: अपने गांव की समस्याएं दर्ज कराने के लिए GBTV पोर्टल पर जाएं',

    // Hero & OTT
    specialPremiere: 'विशेष प्रीमियर',
    watchNow: 'अभी देखें',
    watchTrailer: 'ट्रेलर देखें',
    trendingMovies: 'ट्रेंडिंग फिल्में',
    latestMovies: 'नई फिल्में',
    popularSeries: 'लोकप्रिय वेब सीरीज',
    continueWatching: 'आगे देखें',
    featuredSchemes: 'शासकीय योजनाएं व लाभ',
    popularPodcasts: 'लोकप्रिय पॉडकास्ट',
    exploreMore: 'और देखें',
    free: 'मुफ्त',
    premium: 'प्रीमियम',
    duration: 'अवधि',
    director: 'निर्देशक',
    producer: 'निर्माता',
    cast: 'कलाकार',
    featuredMoviesTitle: 'विशेष मराठी फिल्में',
    getPremiumPrice: 'प्रीमियम लें (₹३९९/वर्ष)',

    // News
    breakingNews: 'ब्रेकिंग न्यूज',
    latestNews: 'ताजा खबरें',
    newsPortalTag: 'महाराष्ट्र की आवाज (Maharashtra News)',
    newsPortalHeading: 'ताजा और महत्वपूर्ण समाचार',
    viewAllNews: 'सभी समाचार देखें',
    filterByDistrict: 'जिलेवार समाचार',
    selectDistrict: 'जिला चुनें',
    selectTaluka: 'तहसील चुनें',
    allDistricts: 'सभी ३६ जिले',
    allCategories: 'सभी श्रेणियां',
    readMore: 'पूरा पढ़ें',
    shareArticle: 'शेयर करें',
    publishedOn: 'प्रकाशन तिथि',

    // Govt Schemes
    schemesTag: 'प्रत्यक्ष लाभ योजनाएं (Government Schemes)',
    schemesTitle: 'किसान और ग्रामीण सरकारी योजनाएं',
    allSchemes: 'सभी योजनाएं →',
    schemeBadge: 'योजना विवरण',
    schemeEligibility: 'पात्रता और आवेदन कैसे करें →',

    // Podcasts
    podcastsTag: 'आवाज ग्रामीण भारत की (Podcasts & Audio)',
    podcastsTitle: 'प्रगतिशील कृषि और ग्रामीण सफलता की कहानियां',
    listenAllPodcasts: 'सभी पॉडकास्ट सुनें',
    listensCountSuffix: 'बार सुना गया',
    minutesSuffix: 'मिनट',

    // Grievance Section
    grievanceBannerTag: 'सीधी जनसुनवाई मंच',
    grievanceBannerTitle: 'क्या अपने गांव के सड़क, पानी, बिजली की समस्या का समाधान चाहते हैं?',
    grievanceBannerDesc: 'ग्रामीण भारत टीवी के जन शिकायत पोर्टल पर सीधे शिकायत दर्ज करें। हमारे जिला संवाददाता समस्या के समाधान के लिए संबंधित अधिकारियों से संपर्क करेंगे।',
    submitGrievance: 'शिकायत दर्ज करें (Submit)',
    trackGrievance: 'शिकायत स्थिति जांचें (Track)',
    submitGrievanceTitle: 'अपनी समस्या सीधे दर्ज करें',
    trackGrievanceTitle: 'शिकायत की स्थिति जांचें',
    trackingIdPlaceholder: 'उदा. GB-2026-MH-4821',
    trackBtn: 'स्थिति जांचें',
    fullName: 'आपका पूरा नाम',
    mobileNumber: 'मोबाइल नंबर (गोपनीय रहेगा)',
    village: 'गांव / ग्राम पंचायत',
    issueCategory: 'समस्या का प्रकार',
    issueTitle: 'समस्या का संक्षिप्त शीर्षक',
    issueDesc: 'विस्तृत विवरण व जानकारी',
    uploadPhoto: 'समस्या का फोटो अपलोड करें',
    submitGrievanceBtn: 'शिकायत दर्ज करें',

    // Subscription Section
    annualPlanTag: 'प्रीमियम वार्षिक प्लान (Official Active Plan)',
    pricingTitle: 'मात्र ₹३९९ / वर्ष (₹३३/माह)',
    pricingSubtitle: 'ग्रामीण महाराष्ट्र का आधिकारिक OTT और डिजिटल न्यूज प्लेटफॉर्म – पूरे परिवार का शानदार मनोरंजन!',
    benefit1: 'सभी फिल्में व सीरीज 4K UHD में',
    benefit2: '24x7 सभी लाइव प्रसारण (Live TV)',
    benefit3: 'विज्ञापन-मुक्त मनोरंजन (Ad-Free)',
    benefit4: 'एक साथ ४ स्क्रीन्स पर देखें',
    benefit5: 'ऑफलाइन डाउनलोड सुविधा',
    subscribeNowBtn: 'अभी सब्सक्राइब करें (₹३९९/वर्ष)',
    securePaymentNote: 'सुरक्षित Razorpay पेमेंट गेटवे • UPI, Google Pay, PhonePe, Paytm और Cards द्वारा आसान भुगतान',
    annualPlan: 'वार्षिक प्रीमियम प्लान',
    monthlyPlan: 'मोबाइल मासिक प्लान',
    payWithRazorpay: 'Razorpay से सुरक्षित भुगतान करें',
    guarantee: '१००% सुरक्षित भुगतान • UPI, कार्ड, नेट बैंकिंग',

    // App Download
    appTag: 'मोबाइल ऐप उपलब्ध (Android App)',
    appTitle: 'ग्रामीण भारत टीवी Android App डाउनलोड करें',
    appDesc: '२४ घंटे लाइव समाचार, कम इंटरनेट पर हाई-स्पीड वीडियो स्ट्रीमिंग, ऑफलाइन डाउनलोड्स और सीधे अपने गांव से शिकायत दर्ज करने की सुविधा!',
    appBenefit1: 'निर्बाध HLS वीडियो स्ट्रीमिंग (४K व HD)',
    appBenefit2: 'ऑफलाइन सेव करें और बाद में देखें',
    appBenefit3: 'मौसम और मंडी भाव इंस्टेंट अलर्ट्स',
    appBenefit4: 'फोटो के साथ सीधे नागरिक शिकायत दर्ज करें',
    googlePlayBtn: 'Google Play Store',

    // Footer & Tagline
    tagline: 'मिट्टी से जुड़ाव, महाराष्ट्र की आवाज – ग्रामीण भारत का डिजिटल मंच',
    allRightsReserved: 'सर्वाधिकार सुरक्षित. ग्रामीण भारत टीवी नेटवर्क.',
    terms: 'नियम एवं शर्तें',
    privacy: 'गोपनीयता नीति',
    refund: 'रिफंड नीति',
    ethics: 'डिजिटल मीडिया आचार संहिता',
  },

  en: {
    // Navigation
    home: 'Home',
    movies: 'Movies',
    webSeries: 'Web Series',
    liveTv: 'Live TV',
    news: 'News',
    podcasts: 'Podcasts',
    districtNews: '36 Districts',
    publicGrievance: 'Public Grievance',
    subscriptions: 'Plans',
    appDownload: 'App',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    search: 'Search movies, news, schemes...',
    login: 'Login',
    logout: 'Logout',
    subscribePremium: 'Subscribe Premium',
    adminPanel: 'Admin Panel',
    profile: 'My Profile',
    watchlist: 'My Watchlist',
    history: 'Watch History',

    // Top Bar & Live
    liveEdition: 'LIVE BROADCAST',
    tickerLine1: '🌾 Official Voice of Rural Maharashtra, Agriculture & Citizens',
    tickerLine2: '• Mandi APMC Rates: Onion ₹2,450 • Cotton ₹7,800 • Soybean ₹4,600 • Tur ₹10,200 • Wheat ₹2,800',
    tickerLine3: '• Milk Rates: Cow Milk ₹38/L, Buffalo Milk ₹65/L',
    tickerLine4: '• Weather: Dry and clear weather expected across the state for next 3 days',
    tickerLine5: '• Public Grievance: Register rural village issues directly on the GBTV redressal portal',

    // Hero & OTT
    specialPremiere: 'Special Premiere',
    watchNow: 'Watch Now',
    watchTrailer: 'Watch Trailer',
    trendingMovies: 'Trending Movies',
    latestMovies: 'Latest Movies',
    popularSeries: 'Popular Web Series',
    continueWatching: 'Continue Watching',
    featuredSchemes: 'Government Schemes & Benefits',
    popularPodcasts: 'Popular Podcasts',
    exploreMore: 'Explore More',
    free: 'Free',
    premium: 'Premium',
    duration: 'Duration',
    director: 'Director',
    producer: 'Producer',
    cast: 'Cast & Crew',
    featuredMoviesTitle: 'Featured Marathi Cinema',
    getPremiumPrice: 'Get Premium (₹399/yr)',

    // News
    breakingNews: 'Breaking News',
    latestNews: 'Latest Updates',
    newsPortalTag: 'Voice of Maharashtra (News Portal)',
    newsPortalHeading: 'Latest & Breaking News',
    viewAllNews: 'View All News',
    filterByDistrict: 'Filter by District',
    selectDistrict: 'Select District',
    selectTaluka: 'Select Taluka',
    allDistricts: 'All 36 Districts',
    allCategories: 'All Categories',
    readMore: 'Read Full Story',
    shareArticle: 'Share Story',
    publishedOn: 'Published on',

    // Govt Schemes
    schemesTag: 'Direct Benefit Schemes',
    schemesTitle: 'Farmer & Rural Government Schemes',
    allSchemes: 'All Schemes →',
    schemeBadge: 'Scheme Details',
    schemeEligibility: 'Eligibility & Application Process →',

    // Podcasts
    podcastsTag: 'Voice of Rural India (Podcasts & Audio)',
    podcastsTitle: 'Progressive Farming & Rural Success Stories',
    listenAllPodcasts: 'Listen to All Podcasts',
    listensCountSuffix: 'listens',
    minutesSuffix: 'mins',

    // Grievance Section
    grievanceBannerTag: 'Direct Citizen Grievance Redressal',
    grievanceBannerTitle: 'Facing road, drinking water, or power issues in your village?',
    grievanceBannerDesc: 'Submit your grievance directly on Gramin Bharat TV portal. Our district reporters coordinate with officials to get your issue resolved.',
    submitGrievance: 'Submit Grievance',
    trackGrievance: 'Track Status',
    submitGrievanceTitle: 'Submit Citizen Grievance Directly',
    trackGrievanceTitle: 'Track Grievance Status',
    trackingIdPlaceholder: 'e.g. GB-2026-MH-4821',
    trackBtn: 'Check Status',
    fullName: 'Full Name',
    mobileNumber: 'Mobile Number (Kept Confidential)',
    village: 'Village / Gram Panchayat',
    issueCategory: 'Issue Category',
    issueTitle: 'Brief Title of Issue',
    issueDesc: 'Detailed Description & Information',
    uploadPhoto: 'Upload Supporting Photo',
    submitGrievanceBtn: 'Submit Grievance',

    // Subscription Section
    annualPlanTag: 'Official Premium Annual Plan',
    pricingTitle: 'Only ₹399 / Year (₹33/month)',
    pricingSubtitle: 'Official OTT & Digital News Platform of Rural Maharashtra – Premium Entertainment for the Entire Family!',
    benefit1: 'All Movies & Series in 4K UHD',
    benefit2: '24x7 All Live Broadcasts (Live TV)',
    benefit3: 'Ad-Free Seamless Streaming',
    benefit4: 'Watch on 4 Screens Simultaneously',
    benefit5: 'Offline Download Feature',
    subscribeNowBtn: 'Subscribe Now (₹399/yr)',
    securePaymentNote: 'Secure Razorpay Payment Gateway • UPI, Google Pay, PhonePe, Paytm & Cards',
    annualPlan: 'Annual Premium Plan',
    monthlyPlan: 'Mobile Monthly Plan',
    payWithRazorpay: 'Pay Securely via Razorpay',
    guarantee: '100% Secure Checkout • UPI, Cards, NetBanking',

    // App Download
    appTag: 'Mobile App Available (Android App)',
    appTitle: 'Download Gramin Bharat TV Android App',
    appDesc: '24x7 live news, high-speed streaming on low internet, offline downloads, and direct citizen grievance redressal from your village!',
    appBenefit1: 'Seamless HLS Video Streaming (4K & HD)',
    appBenefit2: 'Save Offline & Watch Anytime',
    appBenefit3: 'Instant Weather & Mandi Rate Alerts',
    appBenefit4: 'Direct Photo Grievance Reporting',
    googlePlayBtn: 'Google Play Store',

    // Footer & Tagline
    tagline: 'Rooted in Soil, Voice of Maharashtra – Rural Digital Platform',
    allRightsReserved: 'All rights reserved. Gramin Bharat TV Network.',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    refund: 'Refund Policy',
    ethics: 'Digital Media Ethics & IT Rules Compliance',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'mr',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('mr');

  useEffect(() => {
    const saved = localStorage.getItem('gbtv_language') as Language;
    if (saved && (saved === 'mr' || saved === 'hi' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gbtv_language', lang);
      // Dispatch custom event so any non-react listeners or storage events update immediately
      window.dispatchEvent(new Event('gbtv_language_changed'));
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['mr']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
