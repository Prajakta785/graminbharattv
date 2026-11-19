'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, Tv, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { UserRole } from '@/types';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('admin@graminbharattv.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('super_admin');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, role);
      toast('प्रशासक कक्षात आपले स्वागत आहे!', 'success');
      router.push('/admin');
    } catch {
      toast('लॉगिन अयशस्वी झाले', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRole = (r: UserRole, emailAddr: string) => {
    setEmail(emailAddr);
    setRole(r);
    login(emailAddr, r);
    toast(`${r} म्हणून तात्काळ लॉगिन केले`, 'info');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center">
          <div className="bg-white/95 rounded-2xl p-3 inline-block shadow-2xl mb-3 border border-white/20">
            <img
              src="/logo.png"
              alt="ग्रामीण भारत TV"
              className="h-14 w-auto object-contain mx-auto"
            />
          </div>
          <h1 className="text-2xl font-black text-white">ग्रामीण भारत TV • Admin CMS</h1>
          <p className="text-xs text-slate-400 mt-1">
            अधिकृत प्रशासकीय नियंत्रण व सामग्री व्यवस्थापन कक्ष
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                प्रशासकीय ईमेल (Admin Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                अधिकार भूमिका (Role Permission)
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500 font-bold text-orange-400"
              >
                <option value="super_admin">Super Admin (संपूर्ण अधिकार)</option>
                <option value="news_editor">News Editor (वृत्त संपादक)</option>
                <option value="content_manager">Content Manager (सिनेमा व मालिका)</option>
                <option value="video_manager">Video Manager (Bunny.net/Live TV)</option>
                <option value="reporter">Reporter (जिल्हा बातमीदार)</option>
                <option value="finance_manager">Finance Manager (महसूल व वर्गणी)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'प्रक्रिया सुरू आहे...' : 'CMS मध्ये प्रवेश करा'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 text-center">
              चाचणीसाठी एका क्लिकवर थेट लॉगिन करा:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickRole('super_admin', 'superadmin@graminbharattv.in')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-left transition-colors"
              >
                ⚡ Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('news_editor', 'editor@graminbharattv.in')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-left transition-colors"
              >
                ⚡ News Editor
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('video_manager', 'video@graminbharattv.in')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-left transition-colors"
              >
                ⚡ Video Manager
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole('reporter', 'reporter.pune@graminbharattv.in')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-left transition-colors"
              >
                ⚡ District Reporter
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            ← मुख्य वेबसाइटवर परत जा
          </Link>
        </div>
      </div>
    </div>
  );
}
