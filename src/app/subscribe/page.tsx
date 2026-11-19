'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Tv,
  Smartphone,
  Zap,
  Lock,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUBSCRIPTION_PLANS } from '@/data/seedData';
import { SubscriptionPlan } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function SubscriptionPage() {
  const router = useRouter();
  const { user, activateSubscription } = useAuth();
  const { toast } = useToast();

  const [selectedPlanId, setSelectedPlanId] = useState<'annual_premium' | 'mobile_monthly'>('annual_premium');
  const [processing, setProcessing] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    paymentId: string;
    invoiceNumber: string;
    planName: string;
    amount: number;
  } | null>(null);

  const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[0];

  const handleStartPayment = () => {
    setShowCheckoutModal(true);
  };

  const handleProcessRazorpayPayment = async (method: string) => {
    setProcessing(true);
    try {
      // 1. Call server API to create order
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: selectedPlan.price,
          userId: user?.id || 'usr-guest',
          userEmail: user?.email || 'citizen@graminbharattv.in',
          userName: user?.name || 'नागरिक सदस्य',
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed');

      // 2. Mock payment confirmation with Razorpay test keys
      const mockPaymentId = `pay_rzp_${Date.now()}`;
      const mockSig = `mock_sig_${Date.now()}`;

      // 3. Verify on server
      const verifyRes = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.id,
          paymentId: mockPaymentId,
          signature: mockSig,
          userId: user?.id || 'usr-guest',
          userName: user?.name || 'नागरिक सदस्य',
          userEmail: user?.email || 'citizen@graminbharattv.in',
          planId: selectedPlan.id,
          amount: selectedPlan.price,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || 'Verification failed');

      // 4. Activate subscription in AuthContext
      await activateSubscription(selectedPlan.id, mockPaymentId);

      // 5. Trigger confetti celebration
      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      setPaymentSuccessData({
        paymentId: mockPaymentId,
        invoiceNumber: verifyData.transaction.invoiceNumber,
        planName: selectedPlan.nameMr,
        amount: selectedPlan.price,
      });

      setShowCheckoutModal(false);
      toast('प्रीमियम सदस्यता यशस्वीरित्या सक्रिय झाली!', 'success');
    } catch (e: any) {
      toast(e.message || 'पेमेंट प्रक्रिया पूर्ण होऊ शकली नाही', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-12 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600/30 text-orange-400 border border-orange-500/40 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            किफायतशीर सबस्क्रिप्शन प्लॅन्स
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            महाराष्ट्राच्या अस्सल मनोरंजनाचा आनंद घ्या
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            अमर्याद मराठी चित्रपट, मूळ वेब सिरीज, २४ तास Live TV आणि ग्रामीण महाराष्ट्राच्या निर्भीड पत्रकारितेला आपले पाठबळ द्या.
          </p>
        </div>

        {/* Success Banner if paid */}
        {paymentSuccessData && (
          <div className="mb-12 p-8 rounded-3xl bg-slate-900 border border-emerald-500 shadow-2xl text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">अभिनंदन! आपले सबस्क्रिप्शन सुरू झाले आहे</h2>
            <p className="text-xs text-slate-300">
              प्लॅन: <strong className="text-orange-400">{paymentSuccessData.planName}</strong> • रक्कम: ₹{paymentSuccessData.amount}
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1 text-slate-400 text-left">
              <div className="flex justify-between">
                <span>पावती क्रमांक (Invoice):</span>
                <span className="text-white font-bold">{paymentSuccessData.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>पेमेंट आयडी (Razorpay):</span>
                <span className="text-emerald-400">{paymentSuccessData.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span>स्थिती:</span>
                <span className="text-emerald-400 font-bold">सक्रिय (Active)</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Link
                href="/movies"
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center gap-2"
              >
                <span>प्रीमियम चित्रपट पहा</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/profile"
                className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                माझे प्रोफाईल
              </Link>
            </div>
          </div>
        )}

        {/* Pricing Cards Comparison */}
        <div className="max-w-xl mx-auto mb-16">
          {SUBSCRIPTION_PLANS.map(plan => {
            const isSelected = true;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className="relative rounded-3xl p-8 sm:p-10 transition-all cursor-pointer flex flex-col justify-between bg-gradient-to-b from-orange-950/40 via-slate-900 to-slate-900 border-2 border-orange-500 shadow-2xl shadow-orange-950/50"
              >
                {plan.isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-600 text-white shadow-lg">
                    अधिकृत वार्षिक प्लॅन (Best Value)
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="text-2xl font-black text-white">{plan.nameMr}</h3>
                    <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-orange-400 font-semibold">{plan.taglineMr}</p>

                  {/* Price */}
                  <div className="mt-6 mb-6 pb-6 border-b border-slate-800">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl sm:text-6xl font-black text-white">₹{plan.price}</span>
                      <span className="text-sm text-slate-400 font-bold">/ {plan.billingPeriodMr}</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3.5 text-sm text-slate-200">
                    {plan.featuresMr.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/80">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedPlanId(plan.id);
                      handleStartPayment();
                    }}
                    className="w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 hover:from-orange-500 hover:to-amber-500 text-white shadow-xl shadow-orange-600/40 hover:scale-102"
                  >
                    <Sparkles className="w-5 h-5 fill-current" />
                    <span>आत्ताच सबस्क्राइब करा (₹३९९/वर्ष)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Razorpay Guarantees */}
        <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-sm">२५६-बिट सुरक्षित व्यवहार (Razorpay Secure)</p>
              <p className="text-[11px] text-slate-400">
                UPI, Google Pay, PhonePe, Paytm, क्रेडिट व डेबिट कार्ड्स, नेट बँकिंग
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-semibold shrink-0">
            <Lock className="w-4 h-4 text-orange-400" />
            <span>झिरो रिस्क • त्वरित पावती उपलब्ध</span>
          </div>
        </div>

        {/* Razorpay Checkout Modal */}
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Razorpay सुरक्षित पेमेंट</h3>
                  <p className="text-xs text-orange-400">{selectedPlan.nameMr}</p>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-slate-400 hover:text-white text-sm p-1"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">निवडलेला प्लॅन:</span>
                  <span className="font-bold text-white">{selectedPlan.nameMr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">कालावधी:</span>
                  <span>{selectedPlan.billingPeriodMr}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
                  <span className="font-bold text-white">एकूण रक्कम:</span>
                  <span className="font-black text-orange-400">₹{selectedPlan.price}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-slate-300">पेमेंट पद्धत निवडा:</p>

                <button
                  onClick={() => handleProcessRazorpayPayment('UPI')}
                  disabled={processing}
                  className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs font-bold transition-all disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    UPI (Google Pay, PhonePe, Paytm, BHIM)
                  </span>
                  <span className="text-orange-400">पे करा →</span>
                </button>

                <button
                  onClick={() => handleProcessRazorpayPayment('Cards')}
                  disabled={processing}
                  className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs font-bold transition-all disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-orange-400" />
                    क्रेडिट / डेबिट कार्ड्स (Visa, Mastercard, RuPay)
                  </span>
                  <span className="text-orange-400">पे करा →</span>
                </button>

                <button
                  onClick={() => handleProcessRazorpayPayment('NetBanking')}
                  disabled={processing}
                  className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs font-bold transition-all disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    नेट बँकिंग (सर्व प्रमुख भारतीय बँका)
                  </span>
                  <span className="text-orange-400">पे करा →</span>
                </button>
              </div>

              {processing && (
                <div className="text-center py-2 text-xs text-orange-400 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span>Razorpay पेमेंट प्रक्रिया सुरू आहे...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
