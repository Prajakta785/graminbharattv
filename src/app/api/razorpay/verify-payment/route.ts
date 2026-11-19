import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { dbService } from '@/lib/db';
import { PaymentTransaction } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      paymentId,
      signature,
      userId,
      userName,
      userEmail,
      userPhone,
      planId,
      amount,
    } = body;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment signature verification parameters' },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature(orderId, paymentId, signature);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    const invoiceNumber = `INV-GBTV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction: PaymentTransaction = {
      id: `pay_${Date.now()}`,
      orderId,
      paymentId,
      userId: userId || 'usr-1',
      userName: userName || 'Customer',
      userEmail: userEmail || 'customer@example.com',
      userPhone: userPhone || '',
      planId: planId || 'annual_premium',
      amount: amount || 399,
      currency: 'INR',
      status: 'success',
      paymentMethod: 'Razorpay UPI / Cards',
      createdAt: new Date().toISOString(),
      invoiceNumber,
    };

    await dbService.addTransaction(transaction);

    await dbService.logAudit({
      adminId: 'system',
      adminName: 'Razorpay Webhook / Verify',
      action: 'PAYMENT_SUCCESS',
      module: 'Subscription & Revenue',
      targetId: paymentId,
      details: `यशस्वी वर्गणी नोंद: ${userName} (₹${amount}) - ${invoiceNumber}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully and subscription activated',
      transaction,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
