'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Newspaper, MessageSquare, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { language, t } = useLanguage();

  // Don't render on admin routes
  if (pathname?.startsWith('/admin')) return null;

  const items = [
    {
      href: '/',
      label: language === 'en' ? 'Home' : language === 'hi' ? 'मुख्य' : 'मुख्य',
      icon: Home,
    },
    {
      href: '/movies',
      label: language === 'en' ? 'Movies' : language === 'hi' ? 'फिल्में' : 'चित्रपट',
      icon: Film,
    },
    {
      href: '/news',
      label: language === 'en' ? 'News' : language === 'hi' ? 'समाचार' : 'बातम्या',
      icon: Newspaper,
    },
    {
      href: '/grievance',
      label: language === 'en' ? 'Grievance' : language === 'hi' ? 'शिकायत' : 'तक्रार',
      icon: MessageSquare,
    },
    {
      href: '/subscribe',
      label: language === 'en' ? 'Plans' : language === 'hi' ? 'प्लान्स' : 'प्लॅन्स',
      icon: Sparkles,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] select-none light-mode-bottom-nav"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-2">
        {items.map(item => {
          const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 transition-all py-1 ${
                active ? 'text-orange-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] tracking-tight leading-none">{item.label}</span>
              {active && (
                <span className="absolute bottom-1 w-5 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
