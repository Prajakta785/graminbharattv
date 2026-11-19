'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast('आपला संदेश यशस्वीरित्या पाठवला आहे! आमचे प्रतिनिधी लवकरच संपर्क साधतील.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-12 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-2 block">
            संपर्क (Get in Touch)
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ग्रामीण भारत टीव्हीशी संपर्क साधा
          </h1>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            बातम्यांची माहिती (News Tip), जाहिरात विचारणा, किंवा इतर कोणत्याही सहकार्यासाठी आमच्याशी संपर्क साधा.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Contact Info */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                मुख्य कार्यालय (Headquarters)
              </h3>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <p>ग्राम संवाद भवन, एफ.सी. रोड, शिवाजीनगर, पुणे, महाराष्ट्र - ४११००५</p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <p>हेल्पलाईन: +91 94230 00000 / +91 94230 00001</p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <p>ईमेल: contact@graminbharattv.in</p>
              </div>
            </div>

            {/* Grievance Officer Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                तक्रार निवारण अधिकारी (Grievance Officer)
              </h3>
              <p className="text-slate-400">माहिती तंत्रज्ञान (IT Rules 2021) अंतर्गत नियुक्त:</p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-white text-sm">एड. सुहास देशमुख</p>
                <p className="text-orange-400 mt-0.5">grievance@graminbharattv.in</p>
                <p className="text-slate-400 mt-0.5">+91 94230 00002</p>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-2">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6">आम्हाला थेट संदेश पाठवा</h2>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">आपला संदेश प्राप्त झाला आहे!</h3>
                  <p className="text-xs text-slate-300">आमचे संपादक किंवा संबंधित ब्युरो प्रमुख आपल्याशी संपर्क साधतील.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs text-orange-400 hover:underline"
                  >
                    दुसरा संदेश पाठवा
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        आपले नाव *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="उदा. राहुल जाधव"
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        मोबाईल क्रमांक *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="उदा. 9822000000"
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        ईमेल पत्ता
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="rahul@example.com"
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        विषय *
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="उदा. बातमी माहिती / जाहिरात विचारणा"
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      आपला सविस्तर संदेश *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="आपला संदेश येथे लिहा..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-xl shadow-orange-600/30 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    संदेश पाठवा (Send Message)
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
