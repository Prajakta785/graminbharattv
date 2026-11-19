import type { Metadata } from 'next';
import { Noto_Sans_Devanagari, Outfit } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppShell } from '@/components/layout/AppShell';

const devanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-devanagari',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ग्रामीण भारत TV | Gramin Bharat TV – OTT, News & Citizen Platform',
  description: 'मातीची नाळ, महाराष्ट्राचा आवाज – ग्रामीण भारताचे डिजिटल व्यासपीठ. अस्सल मराठी चित्रपट, २४ तास Live TV, ३६ जिल्हे बातम्या आणि लोकतक्रार निवारण.',
  keywords: [
    'Gramin Bharat TV',
    'ग्रामीण भारत टीव्ही',
    'Marathi OTT',
    'Maharashtra News',
    'APMC Market Rates',
    'Shetkari Yojana',
    'Bunny.net Stream',
    'Public Grievance Maharashtra'
  ],
  openGraph: {
    title: 'ग्रामीण भारत TV | Gramin Bharat TV',
    description: 'मातीची नाळ, महाराष्ट्राचा आवाज – ग्रामीण भारताचे डिजिटल व्यासपीठ',
    url: 'https://graminbharattv.in',
    siteName: 'Gramin Bharat TV',
    locale: 'mr_IN',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr" className={`${devanagari.variable} ${outfit.variable} light-mode`}>
      <body className="min-h-screen bg-[#FBF9F5] text-[#0F172A] antialiased font-sans relative">
        {/* Subtle Warm Background Texture */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-15"
          style={{ backgroundImage: "url('/bg-texture.jpg')" }}
        />
        <div className="relative z-10">
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <ToastProvider>
                  <AppShell>{children}</AppShell>
                </ToastProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
