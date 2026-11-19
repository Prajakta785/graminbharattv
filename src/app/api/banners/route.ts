import { NextResponse } from 'next/server';
import { INITIAL_BANNERS } from '@/data/seedData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      banners: INITIAL_BANNERS,
      totalCount: INITIAL_BANNERS.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch platform banners' },
      { status: 500 }
    );
  }
}
