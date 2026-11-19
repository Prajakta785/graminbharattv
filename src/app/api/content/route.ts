import { NextResponse } from 'next/server';
import { INITIAL_MOVIES, INITIAL_WEB_SERIES, INITIAL_LIVE_CHANNELS } from '@/data/seedData';

export async function GET() {
  try {
    const movies = INITIAL_MOVIES.filter(m => m.id !== 'media-muzb93oj');
    const specialShows = INITIAL_MOVIES.filter(m => m.id === 'media-muzb93oj');
    const series = INITIAL_WEB_SERIES;
    const liveChannels = INITIAL_LIVE_CHANNELS;

    return NextResponse.json({
      success: true,
      platform: 'Gramin Bharat TV (ग्रामीण भारत टीव्ही)',
      libraryId: '809137',
      movies: INITIAL_MOVIES,
      spotlightMovies: movies,
      specialShows,
      series,
      liveChannels,
      totalCount: INITIAL_MOVIES.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch platform content' },
      { status: 500 }
    );
  }
}
