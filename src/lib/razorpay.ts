import crypto from 'crypto';

export const RAZORPAY_CONFIG = {
  KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder_gbtv',
  KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'gbtv_secret_placeholder',
  CURRENCY: 'INR',
  COMPANY_NAME: 'Gramin Bharat TV (ग्रामीण भारत टीव्ही)',
};

/**
 * Verify Razorpay payment signature
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret = RAZORPAY_CONFIG.KEY_SECRET
): boolean {
  if (!orderId || !paymentId || !signature) return false;
  
  // If test placeholder keys are active and signature starts with mock_, allow for testing
  if (secret === 'gbtv_secret_placeholder' && signature.startsWith('mock_sig_')) {
    return true;
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}

/**
 * Create order payload
 */
export interface CreateOrderParams {
  amount: number; // in INR
  receipt: string;
  notes?: Record<string, string>;
}
