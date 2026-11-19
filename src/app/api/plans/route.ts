import { NextResponse } from 'next/server';
import { SUBSCRIPTION_PLANS } from '@/data/seedData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      plans: SUBSCRIPTION_PLANS,
      activePlan: SUBSCRIPTION_PLANS[0],
      totalCount: SUBSCRIPTION_PLANS.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch platform plans' },
      { status: 500 }
    );
  }
}
