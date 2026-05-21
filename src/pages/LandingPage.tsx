import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Info, MapPin, School, ArrowRight, HelpCircle, Settings } from "lucide-react";
import { campusInfo as fallbackInfo, tourNodes as fallbackNodes } from "../data/tourNodes";

export function LandingPage() {
  const [nodes, setNodes] = useState(fallbackNodes);
  const [info, setInfo] = useState(fallbackInfo);

  useEffect(() => {
    document.title = "UAN 360° | Virtual Campus Tour";

    // Fetch dynamic data from the Express backend
    fetch("http://localhost:5000/api/nodes")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => setNodes(data))
      .catch((err) => console.log("Backend offline, menggunakan data statis lokal: ", err));

    fetch("http://localhost:5000/api/campus-info")
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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Navbar */}
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
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link to="/" className="text-teal-400 hover:text-white transition-colors">Home</Link>
            <Link to="/tour" className="hover:text-teal-400 transition-colors">Virtual Tour</Link>
            <Link to="/about" className="hover:text-teal-400 transition-colors font-normal text-slate-400 hover:font-medium">Tentang</Link>
            <Link to="/admin" className="hover:text-teal-400 transition-colors font-normal text-slate-400 hover:font-medium flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-teal-400 animate-spin-slow" /> Admin</Link>
          </nav>
          <Link
            to="/tour"
            className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-slate-950 font-semibold text-sm hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg shadow-teal-500/10"
          >
            Mulai Jelajah
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-8 animate-pulse">
          <span className="flex h-2 w-2 rounded-full bg-teal-400" />
          <span>Alami Virtual Tour 360° Berbasis Web</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-[1.1]">
          Jelajahi Sudut Kampus <br />
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Secara Imersif 360°</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12 font-light">
          {info.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/tour"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-blue-600 text-slate-950 font-bold text-lg hover:shadow-2xl hover:shadow-teal-400/20 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Compass className="w-5 h-5 animate-spin-slow" />
            Mulai Virtual Tour Sekarang
          </Link>
          <Link
            to="/about"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-lg transition-colors"
          >
            <Info className="w-5 h-5 text-slate-400" />
            Pelajari Selengkapnya
          </Link>
        </div>
      </section>

      <section className="relative z-10 border-y border-slate-900 bg-slate-950/40 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {info.stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-5xl font-extrabold text-teal-400 mb-2">{stat.value}</div>
              <div className="text-xs md:text-sm text-slate-500 tracking-wider uppercase font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Spots Gallery */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Destinasi Unggulan Virtual Tour
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto font-light">
            Klik langsung pada salah satu ikon di bawah ini untuk memulai tour di titik lokasi pilihan Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {nodes.map((node) => (
            <Link
              key={node.id}
              to={`/tour/${node.id}`}
              className="group relative h-72 rounded-2xl overflow-hidden border border-slate-900 hover:border-teal-500/50 bg-slate-900/40 transition-all duration-300 hover:scale-[1.03] shadow-lg flex flex-col justify-end"
            >
              {/* Overlay Background */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
              {/* Thumbnail Image */}
              <img
                src={node.thumbnailUrl}
                alt={node.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Location Badge */}
              <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-teal-500/20 text-teal-300 border border-teal-500/20 backdrop-blur-sm">
                {node.category}
              </div>
              {/* Details */}
              <div className="relative z-20 p-5">
                <h3 className="font-bold text-lg text-white mb-1 group-hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                  {node.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 font-light">
                  {node.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Guide Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="p-8 md:p-12 rounded-3xl border border-slate-900 bg-slate-900/20 backdrop-blur-md grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-teal-500/10 text-teal-400 mb-6">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cara Menjelajah Kampus Virtual</h2>
            <p className="text-slate-400 font-light mb-8">
              Aplikasi ini dikembangkan sepenuhnya menggunakan teknologi panorama 360° yang imersif dan interaktif. Ikuti panduan sederhana berikut untuk memaksimalkan pengalaman penjelajahan Anda:
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-white">Navigasi Seret (Drag)</h4>
                  <p className="text-sm text-slate-400 font-light">Tahan tombol kiri mouse atau sentuh layar Anda untuk menyapu ke sekeliling area secara 360°.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-white">Hotspot Arah Panah</h4>
                  <p className="text-sm text-slate-400 font-light">Klik ikon tanda panah di dalam panorama untuk langsung berpindah tempat ke area lain.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-white">Ikon Info (i)</h4>
                  <p className="text-sm text-slate-400 font-light">Klik ikon info lingkaran untuk mempelajari fasilitas, laboratorium, atau ruang sejarah yang ada di depan Anda.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {info.quickTips.map((tip, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-slate-800/80 bg-slate-950/60 hover:border-teal-500/20 transition-colors">
                <h4 className="font-bold text-white mb-2 text-base flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                  {tip.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-12 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-teal-500" />
            <span className="font-bold text-white tracking-wide">{info.name}</span>
          </div>
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} {info.name}. All rights reserved. Created with Antigravity AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
