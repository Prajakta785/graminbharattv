'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Upload,
  CheckCircle2,
  Shield,
  MapPin,
  Phone,
  FileText,
  Camera,
  Search,
  ArrowRight
} from 'lucide-react';
import { MAHARASHTRA_DISTRICTS } from '@/lib/districts';
import { dbService } from '@/lib/db';
import { GrievanceCategory } from '@/types';
import { useToast } from '@/context/ToastContext';

const ISSUE_CATEGORIES: { id: GrievanceCategory; labelMr: string; desc: string }[] = [
  { id: 'roads', labelMr: 'रस्ते व वाहतूक', desc: 'खड्डे, खचलेले पूल, डांबरीकरण प्रलंबित' },
  { id: 'drinking_water', labelMr: 'पिण्याचे पाणी', desc: 'नळ योजना, विहिरीचे पाणी, फिल्टर प्लांट' },
  { id: 'electricity', labelMr: 'वीज पुरवठा (MSEB)', desc: 'शेतीपंप वीज, ट्रान्सफॉर्मर बिघाड, भारनियमन' },
  { id: 'healthcare', labelMr: 'आरोग्य व रुग्णालय', desc: 'प्राथमिक आरोग्य केंद्र, औषध टंचाई, ॲम्ब्युलन्स' },
  { id: 'education', labelMr: 'शिक्षण व शाळा', desc: 'जि. प. शाळा वर्गखोल्या, शिक्षक उपलब्धता' },
  { id: 'government_services', labelMr: 'शासकीय सेवा व दाखले', desc: 'तहसील, तलाठी, ७/१२ फेरफार, संजय गांधी योजना' },
  { id: 'agriculture', labelMr: 'शेती व बाजार समिती', desc: 'पीक विमा भरपाई, अनुदान, खत तुटवडा' },
  { id: 'other', labelMr: 'इतर सार्वजनिक प्रश्न', desc: 'स्वच्छता, स्मशानभूमी, अतिक्रमण' },
];

export default function GrievancePortalPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [citizenName, setCitizenName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('पुणे');
  const [selectedTaluka, setSelectedTaluka] = useState('हवेली');
  const [village, setVillage] = useState('');
  const [category, setCategory] = useState<GrievanceCategory>('roads');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const activeDistrictObj = MAHARASHTRA_DISTRICTS.find(d => d.nameMr === selectedDistrict);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !mobileNumber.trim() || !title.trim() || !description.trim()) {
      toast('कृपया सर्व आवश्यक माहिती भरा', 'error');
      return;
    }

    if (mobileNumber.length < 10) {
      toast('कृपया योग्य १० अंकी मोबाईल क्रमांक टाका', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const categoryObj = ISSUE_CATEGORIES.find(c => c.id === category);

      // Mask mobile number for privacy protection (e.g., 98******45)
      const cleanPhone = mobileNumber.replace(/\D/g, '');
      const maskedPhone =
        cleanPhone.length >= 10
          ? `${cleanPhone.slice(0, 2)}******${cleanPhone.slice(-2)}`
          : cleanPhone;

      const grievance = await dbService.submitGrievance({
        citizenName,
        mobileNumber: maskedPhone,
        district: selectedDistrict,
        taluka: selectedTaluka,
        village: village || 'ग्रामपंचायत',
        category,
        categoryMr: categoryObj?.labelMr || 'सार्वजनिक प्रश्न',
        title,
        description,
        photoUrls: photoUrl
          ? [photoUrl]
          : [
              'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
            ],
        location,
      });

      setSubmittedId(grievance.trackingId);
      toast(`तक्रार यशस्वीरित्या नोंदवली: ${grievance.trackingId}`, 'success');
    } catch {
      toast('तक्रार नोंदवताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-10 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600/30 text-red-400 border border-red-500/40 mb-3">
            <AlertCircle className="w-3.5 h-3.5" />
            थेट जनसुनवाई व तक्रार निवारण (Public Grievance Portal)
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            आपल्या गावातील समस्या मांडून <span className="text-orange-500">दाद मागा</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            ग्रामीण भारत टीव्हीचे जिल्हा वार्ताहर थेट प्रशासनाकडे जाऊन आपल्या तक्रारीचा पाठपुरावा करतील आणि गरज भासल्यास Live TV वर बातमी प्रसारित करतील.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/grievance/track"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-orange-400 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              दाखल केलेली तक्रार तपासा (Track Status)
            </Link>
          </div>
        </div>

        {/* Success Modal / Banner after submission */}
        {submittedId ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">आपली तक्रार अधिकृतपणे दाखल झाली आहे!</h2>
            <p className="text-sm text-slate-300">
              आपला युनिक तक्रार नोंदणी क्रमांक (Tracking ID):
            </p>
            <div className="inline-block px-6 py-3 rounded-2xl bg-slate-950 border border-orange-500 font-mono text-2xl font-black text-orange-400 tracking-wider">
              {submittedId}
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              कृपया हा क्रमांक लिहून ठेवा. आमच्या संपादकीय पथकाने ही तक्रार संबंधित जिल्हा वार्ताहराकडे सुपूर्द केली आहे.
            </p>
            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                href={`/grievance/track?id=${submittedId}`}
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center gap-2"
              >
                <span>थेट स्थिती तपासा</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  setSubmittedId(null);
                  setTitle('');
                  setDescription('');
                }}
                className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
              >
                नवीन तक्रार नोंदवा
              </button>
            </div>
          </div>
        ) : (
          /* Grievance Submission Form */
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6"
          >
            {/* Privacy notice banner */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>गोपनीयता हमी:</strong> आपला मोबाईल क्रमांक सार्वजनिक होणार नाही (Masked). फक्त वार्ताहर व प्रशासकीय पडताळणीसाठी वापरला जाईल.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Citizen Name */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  आपले पूर्ण नाव <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. रमेश मारुती पाटील"
                  value={citizenName}
                  onChange={e => setCitizenName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  मोबाईल क्रमांक (SMS व अपडेट्ससाठी) <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="उदा. 9822000000"
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* District & Taluka */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  जिल्हा निवडा <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={e => {
                    setSelectedDistrict(e.target.value);
                    const d = MAHARASHTRA_DISTRICTS.find(item => item.nameMr === e.target.value);
                    if (d && d.talukas.length > 0) {
                      setSelectedTaluka(d.talukas[0].nameMr);
                    }
                  }}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                >
                  {MAHARASHTRA_DISTRICTS.map(d => (
                    <option key={d.id} value={d.nameMr}>
                      {d.nameMr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  तालुका निवडा <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedTaluka}
                  onChange={e => setSelectedTaluka(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                >
                  {activeDistrictObj?.talukas.map(t => (
                    <option key={t.id} value={t.nameMr}>
                      {t.nameMr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  गाव / ग्रामपंचायत <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. वडगाव निंबाळकर"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Issue Category Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2">
                समस्येचा मुख्य विषय निवडा <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ISSUE_CATEGORIES.map(cat => {
                  const active = category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                        active
                          ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold">{cat.labelMr}</span>
                      <span className={`text-[10px] mt-1 line-clamp-1 ${active ? 'text-white/80' : 'text-slate-400'}`}>
                        {cat.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Issue Title */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                समस्येचे संक्षिप्त शीर्षक <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="उदा. मुख्य रस्त्यावरील पूल खचला असून अपघाताचा धोका..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                सविस्तर माहिती व तक्रार <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="समस्या कधीपासून आहे, कोणत्या शासकीय कार्यालयात यापूर्वी अर्ज केला होता, यामुळे गावकऱ्यांचे काय नुकसान होत आहे सविस्तर लिहा..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>

            {/* Photo / Evidence Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  छायाचित्र URL (फोटो पुरावा)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://... किंवा इमेज लिंक"
                    value={photoUrl}
                    onChange={e => setPhotoUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                  <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  स्थानिक पत्ता / Landmark
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="उदा. बस स्टँड जवळ, ग्रामपंचायत कार्यालय शेजारी"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-slate-400">
                तक्रार दाखल केल्यानंतर आपल्याला त्वरित एसएमएस व ट्रॅकिंग आयडी मिळेल.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-105 disabled:opacity-50"
              >
                {submitting ? 'नोंद होत आहे...' : 'तक्रार दाखल करा (Submit Grievance)'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
