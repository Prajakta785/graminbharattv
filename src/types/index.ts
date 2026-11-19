export type Language = 'mr' | 'hi' | 'en';

export type UserRole = 
  | 'super_admin' 
  | 'news_editor' 
  | 'content_manager' 
  | 'video_manager' 
  | 'reporter' 
  | 'ad_manager' 
  | 'finance_manager' 
  | 'user';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  subscription?: {
    planId: 'annual_premium' | 'mobile_monthly';
    planName: string;
    status: 'active' | 'expired' | 'canceled';
    startDate: string;
    expiryDate: string;
    amount: number;
    paymentId?: string;
    autoRenew?: boolean;
  };
  watchlist: string[]; // Content IDs
  watchHistory: {
    contentId: string;
    contentType: 'movie' | 'episode';
    title: string;
    posterUrl: string;
    progressSeconds: number;
    durationSeconds: number;
    lastWatchedAt: string;
  }[];
  createdAt: string;
}

export interface Movie {
  id: string;
  title: string;
  titleMr: string;
  titleHi?: string;
  description: string;
  descriptionMr: string;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string; // Bunny.net stream HLS URL or Direct URL
  embedUrl?: string; // Bunny.net responsive iframe embed URL
  quality?: string; // e.g. '4K UHD HDR'
  trailerUrl?: string;
  bunnyVideoId?: string;
  bunnyLibraryId?: string;
  duration: number; // in minutes
  releaseYear: number;
  genres: string[];
  language: string;
  contentRating: 'U' | 'U/A' | 'A';
  isPremium: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  viewsCount: number;
  director: {
    name: string;
    nameMr: string;
    photoUrl?: string;
  };
  producer?: {
    name: string;
    nameMr: string;
    photoUrl?: string;
  };
  cast: {
    name: string;
    nameMr: string;
    role: string;
    photoUrl?: string;
  }[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface Episode {
  id: string;
  seriesId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  titleMr: string;
  synopsis: string;
  synopsisMr: string;
  thumbnailUrl: string;
  videoUrl: string;
  bunnyVideoId?: string;
  bunnyLibraryId?: string;
  duration: number; // in minutes
  isPremium: boolean;
  viewsCount: number;
  releaseDate: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  titleMr: string;
  episodesCount: number;
  episodes: Episode[];
}

export interface WebSeries {
  id: string;
  title: string;
  titleMr: string;
  titleHi?: string;
  description: string;
  descriptionMr: string;
  posterUrl: string;
  backdropUrl: string;
  genres: string[];
  language: string;
  contentRating: 'U' | 'U/A' | 'A';
  isPremium: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  seasons: Season[];
  totalEpisodes: number;
  creator: string;
  cast: {
    name: string;
    nameMr: string;
    role: string;
  }[];
  createdAt: string;
  published: boolean;
}

export interface ProgramSchedule {
  id: string;
  title: string;
  titleMr: string;
  description: string;
  descriptionMr: string;
  startTime: string; // "14:00"
  endTime: string;   // "15:00"
  host?: string;
  isLive?: boolean;
}

export interface LiveChannel {
  id: 'gramin-bharat-live' | 'namdar-maharashtra-live';
  name: string;
  nameMr: string;
  taglineMr: string;
  logoUrl: string;
  streamUrl: string; // Bunny.net or HLS stream URL (.m3u8)
  bunnyStreamId?: string;
  bunnyLibraryId?: string;
  isLive: boolean;
  viewersCount: number;
  currentProgram: {
    title: string;
    titleMr: string;
    descriptionMr: string;
    startTime: string;
    endTime: string;
  };
  schedule: ProgramSchedule[];
  description: string;
  descriptionMr: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleMr: string;
  slug: string;
  summary: string;
  summaryMr: string;
  content: string; // Markdown or rich text
  contentMr: string;
  imageUrl: string;
  videoUrl?: string;
  category: string;
  categoryMr: string;
  district?: string;
  taluka?: string;
  village?: string;
  reporter: {
    id: string;
    name: string;
    nameMr: string;
    bureau: string;
    photoUrl?: string;
  };
  publishedAt: string;
  viewsCount: number;
  isBreaking: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  tags: string[];
  published: boolean;
}

export interface District {
  id: string;
  nameEn: string;
  nameMr: string;
  division: string;
  talukas: {
    id: string;
    nameEn: string;
    nameMr: string;
  }[];
}

export type GrievanceCategory = 
  | 'roads' 
  | 'drinking_water' 
  | 'electricity' 
  | 'healthcare' 
  | 'education' 
  | 'government_services' 
  | 'agriculture' 
  | 'other';

export type GrievanceStatus = 
  | 'pending' 
  | 'verified' 
  | 'in_progress' 
  | 'resolved' 
  | 'rejected';

export interface Grievance {
  id: string;
  trackingId: string; // e.g. "GB-2026-MH-4821"
  citizenName: string;
  mobileNumber: string; // Masked on public views
  district: string;
  taluka: string;
  village: string;
  category: GrievanceCategory;
  categoryMr: string;
  title: string;
  description: string;
  photoUrls: string[];
  videoUrl?: string;
  location?: string;
  status: GrievanceStatus;
  assignedReporterId?: string;
  assignedReporterName?: string;
  adminRemarks?: string;
  resolutionEvidenceUrls?: string[];
  resolvedAt?: string;
  convertedToNewsId?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  titleMr: string;
  description: string;
  descriptionMr: string;
  thumbnailUrl: string;
  audioUrl: string;
  durationSeconds: number;
  category: string;
  categoryMr: string;
  host: {
    name: string;
    nameMr: string;
    role: string;
  };
  guests?: string[];
  listensCount: number;
  publishedAt: string;
}

export interface SubscriptionPlan {
  id: 'annual_premium' | 'mobile_monthly';
  name: string;
  nameMr: string;
  tagline: string;
  taglineMr: string;
  price: number;
  billingPeriod: string;
  billingPeriodMr: string;
  features: string[];
  featuresMr: string[];
  isPopular?: boolean;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  paymentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'created' | 'success' | 'failed' | 'refunded';
  paymentMethod?: string;
  createdAt: string;
  invoiceNumber: string;
}

export interface Advertisement {
  id: string;
  title: string;
  clientName: string;
  bannerUrl: string;
  targetUrl: string;
  placement: 'header' | 'sidebar' | 'video_preroll' | 'in_feed' | 'footer';
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  status: 'active' | 'paused' | 'expired';
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  module: string;
  targetId?: string;
  details: string;
  timestamp: string;
}

export interface Banner {
  id: string;
  title: string;
  titleMr: string;
  subtitle?: string;
  subtitleMr?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
  badgeText?: string;
  badgeTextMr?: string;
  buttonText?: string;
  buttonTextMr?: string;
  type: 'movie' | 'series' | 'news' | 'live' | 'app' | 'subscription';
  isActive: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  siteName: string;
  siteNameMr: string;
  taglineMr: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappHelpline: string;
  address: string;
  cin: string;
  gstin: string;
  grievanceOfficerName: string;
  grievanceOfficerEmail: string;
  grievanceOfficerPhone: string;
  bunnyLibraryId: string;
  bunnyApiKeyConfigured: boolean;
  razorpayKeyId: string;
  razorpaySecretConfigured: boolean;
  androidApkUrl: string;
  playStoreUrl: string;
}
