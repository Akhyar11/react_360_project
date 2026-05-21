import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { School, Compass, ArrowLeft, Users, Clock, Globe2, Cpu, GraduationCap, Map } from "lucide-react";
import { campusInfo as fallbackInfo } from "../data/tourNodes";

export function AboutPage() {
  const [info, setInfo] = useState(fallbackInfo);

  useEffect(() => {
    document.title = "Tentang UAN | Virtual Campus Tour";

    // Fetch dynamic campus info from backend
    fetch("/api/campus-info")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => setInfo(data))
      .catch((err) => console.log("Backend offline, menggunakan data statis lokal: ", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-900">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-teal-400 to-blue-500 p-2 rounded-xl text-slate-950 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                UAN 360°
              </span>
              <span className="block text-[10px] text-teal-400 font-medium tracking-widest uppercase">
                Virtual Campus Tour
              </span>
            </div>
          </Link>
          <Link
            to="/tour"
            className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-slate-950 font-semibold text-sm hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg shadow-teal-500/10"
          >
            Masuk Tour
            <Compass className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Tentang <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Virtual Tour UAN</span>
        </h1>
        <p className="text-slate-400 font-light text-lg mb-12 leading-relaxed">
          Platform Virtual Campus Tour ini adalah inisiatif digital dari Universitas Antigravity Nusantara (UAN) untuk menghadirkan seluruh area kampus ke layar gadget Anda. Dengan pemotretan panorama 360 derajat berkualitas tinggi, kami mengundang dunia untuk menjelajahi fasilitas riset, gedung perkuliahan, dan pemandangan alam kami.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-sm">
            <GraduationCap className="w-8 h-8 text-teal-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Visi Kami</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Mewujudkan aksesibilitas informasi tanpa batas bagi calon mahasiswa dan peneliti di seluruh dunia guna mengenal budaya inovasi yang dinamis di lingkungan kampus UAN.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-sm">
            <Cpu className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Inovasi Teknologi</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Menggunakan rendering panorama 3D WebGL mutakhir berbasis browser yang ringan tanpa memerlukan instalasi aplikasi eksternal, mendukung kenyamanan akses di semua tipe layar perangkat.
            </p>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Panduan Navigasi Lengkap</h2>
        <div className="border border-slate-900 rounded-2xl overflow-hidden bg-slate-900/10 mb-16 divide-y divide-slate-900">
          <div className="p-6 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-slate-800 text-teal-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Eksplorasi Bebas</h4>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Gunakan kursor mouse (klik & drag) atau swipe layar pada smartphone untuk berputar 360 derajat. Anda juga dapat menggunakan tombol zoom in/out di bagian bawah panel kontrol untuk melihat detail dengan lebih dekat.
              </p>
            </div>
          </div>
          <div className="p-6 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-slate-800 text-teal-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Deep Linking URL</h4>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Setiap lokasi dalam tour memiliki URL unik (misal: <code className="text-teal-400 text-xs">/tour/lobby-utama</code>). Anda dapat menyalin alamat web di browser dan membagikannya ke teman-teman agar mereka langsung membuka area tersebut secara spesifik.
              </p>
            </div>
          </div>
          <div className="p-6 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-slate-800 text-teal-400 shrink-0">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Denah Kampus & Sidebar</h4>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Di sudut kanan bawah terdapat peta denah kampus interaktif. Lokasi aktif ditandai dengan lingkaran merah bercahaya. Anda juga bisa mengklik marker langsung pada denah untuk langsung bertransisi ke lokasi lain.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20">
          <Globe2 className="w-12 h-12 text-teal-400 mx-auto mb-4 animate-spin-slow" />
          <h3 className="text-2xl font-bold text-white mb-2">Siap untuk Mulai Jelajah?</h3>
          <p className="text-sm text-slate-400 font-light max-w-md mx-auto mb-6">
            Masuk sekarang dan rasakan pengalaman virtual tour interaktif tercanggih di Indonesia.
          </p>
          <Link
            to="/tour"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Mulai Virtual Tour
            <Compass className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-8 text-slate-600 text-xs text-center">
        &copy; {new Date().getFullYear()} {info.name}. All rights reserved. Created with Antigravity AI.
      </footer>
    </div>
  );
}
