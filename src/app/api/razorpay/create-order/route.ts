import { NextResponse } from 'next/server';
import { RAZORPAY_CONFIG } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId, amount, userId, userEmail, userName } = body;

    if (!planId || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters: planId and amount' },
        { status: 400 }
      );
    }

    const orderId = `order_gbtv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Order payload for Razorpay
    const orderData = {
      id: orderId,
      entity: 'order',
      amount: amount * 100, // paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      status: 'created',
      notes: {
        planId,
        userId: userId || 'anonymous',
        userName: userName || '',
        userEmail: userEmail || '',
      },
      created_at: Math.floor(Date.now() / 1000),
      keyId: RAZORPAY_CONFIG.KEY_ID,
    };

    return NextResponse.json(orderData);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
