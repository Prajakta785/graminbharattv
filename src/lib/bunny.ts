/**
 * Bunny.net Stream Helper
 * Library ID: 809137 (Gramin Bharat TV)
 */

export const BUNNY_CONFIG = {
  LIBRARY_ID: process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '809137',
  CDN_HOSTNAME: process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME || 'video.bunnycdn.com',
  PULL_ZONE: process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE || 'vz-809137-b-cdn.net',
  API_KEY: process.env.BUNNY_STREAM_API_KEY || '',
};

/**
 * Returns the HLS playlist .m3u8 URL for a given video ID on Bunny.net
 */
export function getBunnyHlsUrl(videoId: string, libraryId = BUNNY_CONFIG.LIBRARY_ID): string {
  if (!videoId) return '';
  // If videoId is already a full URL (e.g., https://... or .m3u8), return directly
  if (videoId.startsWith('http://') || videoId.startsWith('https://')) {
    return videoId;
  }
  return `https://${BUNNY_CONFIG.PULL_ZONE}/${videoId}/playlist.m3u8`;
}

/**
 * Returns Bunny iframe embed URL
 */
export function getBunnyEmbedUrl(videoId: string, libraryId = BUNNY_CONFIG.LIBRARY_ID): string {
  if (!videoId) return '';
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&loop=false&muted=false&preload=true`;
}

/**
 * Returns thumbnail image URL from Bunny.net
 */
export function getBunnyThumbnailUrl(videoId: string, libraryId = BUNNY_CONFIG.LIBRARY_ID): string {
  if (!videoId) return '';
  return `https://${BUNNY_CONFIG.PULL_ZONE}/${videoId}/thumbnail.jpg`;
}

/**
 * Sample working fallback HLS stream URLs (Test streams for live TV and movies when Bunny.net credentials are under setup)
 */
export const FALLBACK_STREAMS = {
  // Free public test HLS streams with adaptive bitrate
  LIVE_NEWS_1: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  LIVE_NEWS_2: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
  FEATURED_MOVIE: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  RURAL_DOC: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
};
