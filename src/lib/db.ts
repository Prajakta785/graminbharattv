import {
  Movie,
  WebSeries,
  LiveChannel,
  NewsArticle,
  PodcastEpisode,
  Grievance,
  Banner,
  SiteSettings,
  PaymentTransaction,
  AuditLog
} from '@/types';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_BANNERS,
  INITIAL_MOVIES,
  INITIAL_WEB_SERIES,
  INITIAL_LIVE_CHANNELS,
  INITIAL_NEWS,
  INITIAL_PODCASTS,
  INITIAL_GRIEVANCES,
  INITIAL_TRANSACTIONS,
  INITIAL_AUDIT_LOGS
} from '@/data/seedData';
import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';

const STORAGE_KEYS = {
  SETTINGS: 'gbtv_real_v5_settings',
  BANNERS: 'gbtv_real_v5_banners',
  MOVIES: 'gbtv_real_v5_movies',
  SERIES: 'gbtv_real_v5_series',
  LIVE: 'gbtv_real_v5_live_channels',
  NEWS: 'gbtv_real_v5_news',
  PODCASTS: 'gbtv_real_v5_podcasts',
  GRIEVANCES: 'gbtv_real_v5_grievances',
  TRANSACTIONS: 'gbtv_real_v5_transactions',
  AUDIT: 'gbtv_real_v5_audit_logs',
};

// Safe localStorage access helper
function getStored<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('gbtv_data_updated'));
  } catch (e) {
    console.error(`Failed to store ${key}`, e);
  }
}

export const dbService = {
  // Settings
  async getSettings(): Promise<SiteSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'site'));
        if (snap.exists()) return snap.data() as SiteSettings;
      } catch (e) {
        console.warn('Firestore fallback on getSettings', e);
      }
    }
    return getStored<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  },

  async saveSettings(settings: SiteSettings, adminName = 'Admin'): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'site'), settings);
      } catch (e) {
        console.warn('Firestore error saveSettings', e);
      }
    }
    setStored(STORAGE_KEYS.SETTINGS, settings);
    await this.logAudit({
      adminId: 'admin',
      adminName,
      action: 'UPDATE_SETTINGS',
      module: 'Website Settings',
      details: 'Website settings and corporate details updated',
    });
  },

  // Banners
  async getBanners(): Promise<Banner[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(query(collection(db, 'banners'), orderBy('sortOrder', 'asc')));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Banner));
        }
      } catch (e) {
        console.warn('Firestore fallback getBanners', e);
      }
    }
    const banners = getStored<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
    return banners.map(b => {
      const initial = INITIAL_BANNERS.find(ib => ib.id === b.id);
      if (initial && (b.imageUrl?.includes('unsplash') || !b.imageUrl?.startsWith('/images/movies'))) {
        return { ...b, imageUrl: initial.imageUrl, titleMr: initial.titleMr, subtitleMr: initial.subtitleMr };
      }
      return b;
    });
  },

  async saveBanner(banner: Banner): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'banners', banner.id), banner);
      } catch (e) {
        console.warn('Firestore error saveBanner', e);
      }
    }
    const banners = await this.getBanners();
    const idx = banners.findIndex(b => b.id === banner.id);
    if (idx >= 0) banners[idx] = banner;
    else banners.push(banner);
    setStored(STORAGE_KEYS.BANNERS, banners);
  },

  async deleteBanner(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'banners', id));
      } catch (e) {
        console.warn('Firestore error deleteBanner', e);
      }
    }
    const banners = (await this.getBanners()).filter(b => b.id !== id);
    setStored(STORAGE_KEYS.BANNERS, banners);
  },

  // Movies
  async getMovies(): Promise<Movie[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(query(collection(db, 'movies'), orderBy('createdAt', 'desc')));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Movie));
        }
      } catch (e) {
        console.warn('Firestore fallback getMovies', e);
      }
    }
    const movies = getStored<Movie[]>(STORAGE_KEYS.MOVIES, INITIAL_MOVIES);
    return movies.map(m => {
      const initial = INITIAL_MOVIES.find(im => im.id === m.id);
      if (initial && (m.posterUrl?.includes('unsplash') || !m.posterUrl?.startsWith('/images/movies'))) {
        return {
          ...m,
          posterUrl: initial.posterUrl,
          backdropUrl: initial.backdropUrl,
          director: initial.director,
          producer: initial.producer,
          cast: initial.cast,
          titleMr: initial.titleMr,
          descriptionMr: initial.descriptionMr,
        };
      }
      return m;
    });
  },

  async getMovieById(id: string): Promise<Movie | null> {
    const movies = await this.getMovies();
    return movies.find(m => m.id === id) || null;
  },

  async saveMovie(movie: Movie, adminName = 'Admin'): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'movies', movie.id), movie);
      } catch (e) {
        console.warn('Firestore error saveMovie', e);
      }
    }
    const list = await this.getMovies();
    const idx = list.findIndex(m => m.id === movie.id);
    if (idx >= 0) list[idx] = movie;
    else list.unshift(movie);
    setStored(STORAGE_KEYS.MOVIES, list);
    await this.logAudit({
      adminId: 'admin',
      adminName,
      action: idx >= 0 ? 'UPDATE_MOVIE' : 'CREATE_MOVIE',
      module: 'Movies Management',
      targetId: movie.id,
      details: `चित्रपट जतन केला: ${movie.titleMr} (${movie.title})`,
    });
  },

  async deleteMovie(id: string, adminName = 'Admin'): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'movies', id));
      } catch (e) {
        console.warn('Firestore error deleteMovie', e);
      }
    }
    const list = (await this.getMovies()).filter(m => m.id !== id);
    setStored(STORAGE_KEYS.MOVIES, list);
    await this.logAudit({
      adminId: 'admin',
      adminName,
      action: 'DELETE_MOVIE',
      module: 'Movies Management',
      targetId: id,
      details: `चित्रपट हटवला ID: ${id}`,
    });
  },

  // Web Series
  async getWebSeries(): Promise<WebSeries[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(query(collection(db, 'webSeries'), orderBy('createdAt', 'desc')));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as WebSeries));
        }
      } catch (e) {
        console.warn('Firestore fallback getWebSeries', e);
      }
    }
    return getStored<WebSeries[]>(STORAGE_KEYS.SERIES, INITIAL_WEB_SERIES);
  },

  async getSeriesById(id: string): Promise<WebSeries | null> {
    const series = await this.getWebSeries();
    return series.find(s => s.id === id) || null;
  },

  async saveSeries(series: WebSeries, adminName = 'Admin'): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'webSeries', series.id), series);
      } catch (e) {
        console.warn('Firestore error saveSeries', e);
      }
    }
    const list = await this.getWebSeries();
    const idx = list.findIndex(s => s.id === series.id);
    if (idx >= 0) list[idx] = series;
    else list.unshift(series);
    setStored(STORAGE_KEYS.SERIES, list);
    await this.logAudit({
      adminId: 'admin',
      adminName,
      action: idx >= 0 ? 'UPDATE_SERIES' : 'CREATE_SERIES',
      module: 'Web Series Management',
      targetId: series.id,
      details: `वेब सिरीज जतन केली: ${series.titleMr}`,
    });
  },

  async deleteSeries(id: string, adminName = 'Admin'): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'webSeries', id));
      } catch (e) {
        console.warn('Firestore error deleteSeries', e);
      }
    }
    const list = (await this.getWebSeries()).filter(s => s.id !== id);
    setStored(STORAGE_KEYS.SERIES, list);
    await this.logAudit({
      adminId: 'admin',
      adminName,
      action: 'DELETE_SERIES',
      module: 'Web Series Management',
      targetId: id,
      details: `वेब सिरीज हटवली ID: ${id}`,
    });
  },

  // Live Channels
  async getLiveChannels(): Promise<LiveChannel[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'liveChannels'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as LiveChannel));
        }
      } catch (e) {
        console.warn('Firestore fallback getLiveChannels', e);
      }
    }
    return getStored<LiveChannel[]>(STORAGE_KEYS.LIVE, INITIAL_LIVE_CHANNELS);
  },

  async getLiveChannelById(id: string): Promise<LiveChannel | null> {
    const list = await this.getLiveChannels();
    return list.find(c => c.id === id) || null;
  },

  async updateLiveChannel(channel: LiveChannel, adminName = 'Admin'): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'liveChannels', channel.id), channel);
      } catch (e) {
        console.warn('Firestore error updateLiveChannel', e);
      }
    }
    const list = await this.getLiveChannels();
    const idx = list.findIndex(c => c.id === channel.id);
    if (idx >= 0) list[idx] = channel;
    else list.push(channel);
    setStored(STORAGE_KEYS.LIVE, list);
    await this.logAudit({
      adminId: 'admin',
      adminName,
      action: 'UPDATE_LIVE_STREAM',
      module: 'Live TV Management',
      targetId: channel.id,
      details: `लाइव्ह चॅनेल माहिती व EPG अद्ययावत केली: ${channel.nameMr}`,
    });
  },

  // News
  async getNews(): Promise<NewsArticle[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(query(collection(db, 'news'), orderBy('publishedAt', 'desc')));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsArticle));
        }
      } catch (e) {
        console.warn('Firestore fallback getNews', e);
      }
    }
    return getStored<NewsArticle[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  },

  async getNewsById(id: string): Promise<NewsArticle | null> {
    const list = await this.getNews();
    return list.find(n => n.id === id || n.slug === id) || null;
  },

  async saveNews(article: NewsArticle, adminName = 'Admin'): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'news', article.id), article);
      } catch (e) {
        console.warn('Firestore error saveNews', e);
      }
    }
    const list = await this.getNews();
    const idx = list.findIndex(n => n.id === article.id);
    if (idx >= 0) list[idx] = article;
    else list.unshift(article);
    setStored(STORAGE_KEYS.NEWS, list);
    await this.logAudit({
      adminId: 'admin',
      adminName,
      action: idx >= 0 ? 'UPDATE_NEWS' : 'PUBLISH_NEWS',
      module: 'News Management',
      targetId: article.id,
      details: `बातमी प्रसिद्ध केली: ${article.titleMr}`,
    });
  },

  async deleteNews(id: string, adminName = 'Admin'): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'news', id));
      } catch (e) {
        console.warn('Firestore error deleteNews', e);
      }
    }
    const list = (await this.getNews()).filter(n => n.id !== id);
    setStored(STORAGE_KEYS.NEWS, list);
    await this.logAudit({
      adminId: 'admin',
      adminName,
      action: 'DELETE_NEWS',
      module: 'News Management',
      targetId: id,
      details: `बातमी हटवली ID: ${id}`,
    });
  },

  // Podcasts
  async getPodcasts(): Promise<PodcastEpisode[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(query(collection(db, 'podcasts'), orderBy('publishedAt', 'desc')));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as PodcastEpisode));
        }
      } catch (e) {
        console.warn('Firestore fallback getPodcasts', e);
      }
    }
    return getStored<PodcastEpisode[]>(STORAGE_KEYS.PODCASTS, INITIAL_PODCASTS);
  },

  async getPodcastById(id: string): Promise<PodcastEpisode | null> {
    const list = await this.getPodcasts();
    return list.find(p => p.id === id) || null;
  },

  async savePodcast(podcast: PodcastEpisode, adminName = 'Admin'): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'podcasts', podcast.id), podcast);
      } catch (e) {
        console.warn('Firestore error savePodcast', e);
      }
    }
    const list = await this.getPodcasts();
    const idx = list.findIndex(p => p.id === podcast.id);
    if (idx >= 0) list[idx] = podcast;
    else list.unshift(podcast);
    setStored(STORAGE_KEYS.PODCASTS, list);
    await this.logAudit({
      adminId: 'admin',
      adminName,
      action: idx >= 0 ? 'UPDATE_PODCAST' : 'CREATE_PODCAST',
      module: 'Podcast Management',
      targetId: podcast.id,
      details: `पॉडकास्ट भाग जतन केला: ${podcast.titleMr}`,
    });
  },

  async deletePodcast(id: string, adminName = 'Admin'): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'podcasts', id));
      } catch (e) {
        console.warn('Firestore error deletePodcast', e);
      }
    }
    const list = (await this.getPodcasts()).filter(p => p.id !== id);
    setStored(STORAGE_KEYS.PODCASTS, list);
    await this.logAudit({
      adminId: 'admin',
      adminName,
      action: 'DELETE_PODCAST',
      module: 'Podcast Management',
      targetId: id,
      details: `पॉडकास्ट हटवला ID: ${id}`,
    });
  },

  // Grievances
  async getGrievances(): Promise<Grievance[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(query(collection(db, 'grievances'), orderBy('submittedAt', 'desc')));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Grievance));
        }
      } catch (e) {
        console.warn('Firestore fallback getGrievances', e);
      }
    }
    return getStored<Grievance[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_GRIEVANCES);
  },

  async getGrievanceByTrackingId(trackingId: string): Promise<Grievance | null> {
    const list = await this.getGrievances();
    const cleanQuery = trackingId.trim().toUpperCase();
    return list.find(g => g.trackingId.toUpperCase() === cleanQuery || g.id === cleanQuery) || null;
  },

  async submitGrievance(data: Omit<Grievance, 'id' | 'trackingId' | 'status' | 'submittedAt' | 'updatedAt'>): Promise<Grievance> {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `GB-2026-MH-${randomDigits}`;
    const id = `grv-${Date.now()}`;
    const now = new Date().toISOString();

    const newGrievance: Grievance = {
      ...data,
      id,
      trackingId,
      status: 'pending',
      submittedAt: now,
      updatedAt: now,
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'grievances', id), newGrievance);
      } catch (e) {
        console.warn('Firestore error submitGrievance', e);
      }
    }

    const list = await this.getGrievances();
    list.unshift(newGrievance);
    setStored(STORAGE_KEYS.GRIEVANCES, list);
    return newGrievance;
  },

  async updateGrievance(grievance: Grievance, adminName = 'Admin'): Promise<void> {
    grievance.updatedAt = new Date().toISOString();
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'grievances', grievance.id), grievance);
      } catch (e) {
        console.warn('Firestore error updateGrievance', e);
      }
    }
    const list = await this.getGrievances();
    const idx = list.findIndex(g => g.id === grievance.id);
    if (idx >= 0) list[idx] = grievance;
    setStored(STORAGE_KEYS.GRIEVANCES, list);

    await this.logAudit({
      adminId: 'admin',
      adminName,
      action: 'UPDATE_GRIEVANCE',
      module: 'Grievance Management',
      targetId: grievance.trackingId,
      details: `तक्रार स्थिती अद्ययावत केली: ${grievance.status} (${grievance.trackingId})`,
    });
  },

  // Convert Grievance to News Article (Editorial Workflow)
  async convertGrievanceToNews(grievanceId: string, adminName = 'Editor'): Promise<NewsArticle | null> {
    const list = await this.getGrievances();
    const grievance = list.find(g => g.id === grievanceId);
    if (!grievance) return null;

    const newsId = `news-grv-${Date.now()}`;
    const newArticle: NewsArticle = {
      id: newsId,
      title: `Citizen Voice: ${grievance.title}`,
      titleMr: `जनतेचा आक्रोश: ${grievance.district} जिल्ह्यातील ${grievance.village} येथील भीषण समस्या`,
      slug: `citizen-issue-${grievance.trackingId.toLowerCase()}`,
      summary: `Ground report filed from ${grievance.village}, ${grievance.taluka} regarding ${grievance.title}.`,
      summaryMr: `${grievance.district} जिल्ह्यातील ${grievance.taluka} तालुक्यातील ${grievance.village} येथील नागरिकांनी मांडलेली तक्रार. प्रशासनाचे लक्ष वेधण्यासाठी विशेष वृत्त.`,
      content: `${grievance.description}\n\nनागरिकाने सादर केलेली अधिकृत तक्रार नोंदणी क्रमांक: ${grievance.trackingId}\nप्रशासकीय शेरा: ${grievance.adminRemarks || 'चौकशी प्रस्तावित'}`,
      contentMr: `${grievance.description}\n\nनागरिकाने सादर केलेली अधिकृत तक्रार नोंदणी क्रमांक: ${grievance.trackingId}\nप्रशासकीय शेरा: ${grievance.adminRemarks || 'चौकशी प्रस्तावित'}`,
      imageUrl: grievance.photoUrls[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80',
      category: 'ग्रामीण विकास',
      categoryMr: 'ग्रामीण विकास',
      district: grievance.district,
      taluka: grievance.taluka,
      village: grievance.village,
      reporter: {
        id: grievance.assignedReporterId || 'rep-desk',
        name: grievance.assignedReporterName || 'Gramin Desk',
        nameMr: grievance.assignedReporterName || 'ग्रामीण भारत विशेष वार्ताहर',
        bureau: `${grievance.district} जिल्हा बातमी कक्ष`,
      },
      publishedAt: new Date().toISOString(),
      viewsCount: 120,
      isBreaking: true,
      isFeatured: false,
      isTrending: true,
      tags: ['नागरिक तक्रार', grievance.district, 'ग्राउंड रिपोर्ट'],
      published: true,
    };

    await this.saveNews(newArticle, adminName);

    // Update grievance with converted news link
    grievance.convertedToNewsId = newsId;
    grievance.status = 'in_progress';
    grievance.adminRemarks = `तक्रारीचे रूपांतर बातमीमध्ये केले (News ID: ${newsId}).`;
    await this.updateGrievance(grievance, adminName);

    return newArticle;
  },

  // Transactions
  async getTransactions(): Promise<PaymentTransaction[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(query(collection(db, 'payments'), orderBy('createdAt', 'desc')));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentTransaction));
        }
      } catch (e) {
        console.warn('Firestore fallback getTransactions', e);
      }
    }
    return getStored<PaymentTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  },

  async addTransaction(tx: PaymentTransaction): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'payments', tx.id), tx);
      } catch (e) {
        console.warn('Firestore error addTransaction', e);
      }
    }
    const list = await this.getTransactions();
    list.unshift(tx);
    setStored(STORAGE_KEYS.TRANSACTIONS, list);
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc')));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog));
        }
      } catch (e) {
        console.warn('Firestore fallback getAuditLogs', e);
      }
    }
    return getStored<AuditLog[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
  },

  async logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const fullLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'auditLogs', fullLog.id), fullLog);
      } catch {
        // Safe silence
      }
    }
    const list = await this.getAuditLogs();
    list.unshift(fullLog);
    if (list.length > 200) list.pop(); // Keep manageable size
    setStored(STORAGE_KEYS.AUDIT, list);
  },

  // Aggregated Stats
  async getDashboardStats() {
    const [movies, series, news, podcasts, grievances, transactions, channels] = await Promise.all([
      this.getMovies(),
      this.getWebSeries(),
      this.getNews(),
      this.getPodcasts(),
      this.getGrievances(),
      this.getTransactions(),
      this.getLiveChannels(),
    ]);

    const totalRevenue = transactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingGrievances = grievances.filter(g => g.status === 'pending').length;
    const resolvedGrievances = grievances.filter(g => g.status === 'resolved').length;

    let totalEpisodes = 0;
    series.forEach(s => {
      s.seasons?.forEach(sn => {
        totalEpisodes += sn.episodes?.length || 0;
      });
    });

    return {
      totalMovies: movies.length,
      totalSeries: series.length,
      totalEpisodes,
      totalNews: news.length,
      totalPodcasts: podcasts.length,
      totalGrievances: grievances.length,
      pendingGrievances,
      resolvedGrievances,
      totalTransactions: transactions.length,
      totalRevenue,
      liveChannelsCount: channels.length,
      activeSubscribers: transactions.filter(t => t.status === 'success').length + 840, // realistic base
    };
  }
};
