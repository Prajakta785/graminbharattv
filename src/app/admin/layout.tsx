'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Film,
  Tv,
  Radio,
  Newspaper,
  AlertCircle,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  Layers,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  Sparkles,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, userRole, switchRole, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render children directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { href: '/admin', label: 'डॅशबोर्ड (Dashboard)', icon: LayoutDashboard, roles: ['all'] },
    { href: '/admin/movies', label: 'चित्रपट (Movies)', icon: Film, roles: ['super_admin', 'content_manager', 'video_manager'] },
    { href: '/admin/series', label: 'वेब सिरीज (Series)', icon: Layers, roles: ['super_admin', 'content_manager', 'video_manager'] },
    { href: '/admin/live', label: 'Live TV व EPG', icon: Tv, roles: ['super_admin', 'video_manager'] },
    { href: '/admin/news', label: 'बातम्या CMS (News)', icon: Newspaper, roles: ['super_admin', 'news_editor', 'reporter'] },
    { href: '/admin/grievances', label: 'नागरिक तक्रारी (Grievances)', icon: AlertCircle, roles: ['super_admin', 'news_editor', 'reporter'] },
    { href: '/admin/podcasts', label: 'पॉडकास्ट (Podcasts)', icon: Radio, roles: ['super_admin', 'content_manager'] },
    { href: '/admin/banners', label: 'बॅनर्स व कॅरोसेल', icon: Sparkles, roles: ['super_admin', 'content_manager'] },
    { href: '/admin/users', label: 'वापरकर्ते (Users)', icon: Users, roles: ['super_admin'] },
    { href: '/admin/subscriptions', label: 'महसूल व पेमेंट (Finance)', icon: CreditCard, roles: ['super_admin', 'finance_manager'] },
    { href: '/admin/reports', label: 'अहवाल (Reports & Export)', icon: BarChart3, roles: ['super_admin', 'finance_manager', 'news_editor'] },
    { href: '/admin/settings', label: 'वेबसाइट सेटिंग्ज', icon: Settings, roles: ['super_admin'] },
    { href: '/admin/audit', label: 'ऑडिट लॉग्स (Audit Logs)', icon: ClipboardList, roles: ['super_admin'] },
  ];

  const filteredMenuItems = menuItems.filter(
    item => item.roles.includes('all') || item.roles.includes(userRole) || userRole === 'super_admin'
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex select-none">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-white/95 rounded-lg p-1 shadow flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="GB Logo"
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-white leading-tight">
                  ग्रामीण भारत <span className="text-orange-500">CMS</span>
                </span>
                <span className="text-[10px] text-slate-400">Admin Control Center</span>
              </div>
            </Link>
          </div>

          {/* Current Role Indicator */}
          <div className="p-3 mx-3 my-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold">सक्रिय भूमिका:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-950 text-orange-400 border border-orange-800">
                {userRole}
              </span>
            </div>
            {/* Quick role test switcher */}
            <select
              value={userRole}
              onChange={e => switchRole(e.target.value as UserRole)}
              className="mt-2 w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-[11px] text-slate-200 focus:outline-none"
            >
              <option value="super_admin">Super Admin (पूर्ण प्रवेश)</option>
              <option value="news_editor">News Editor (संपादक)</option>
              <option value="content_manager">Content Manager (सिनेमा/मालिका)</option>
              <option value="video_manager">Video Manager (Bunny.net/Live)</option>
              <option value="reporter">Reporter (बातमीदार)</option>
              <option value="finance_manager">Finance Manager (महसूल)</option>
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {filteredMenuItems.map(item => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            मुख्य वेबसाइट उघडा
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-xs font-semibold text-red-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            लॉग आउट
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-sm sm:text-base font-bold text-white truncate">
              ग्रामीण भारत टीव्ही • प्रशासकीय नियंत्रण कक्ष
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              वेबसाइट पहा
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name[0] : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white truncate max-w-[120px]">{user?.name}</p>
                <p className="text-[10px] text-slate-400">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2">
            {filteredMenuItems.map(item => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                    active ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
