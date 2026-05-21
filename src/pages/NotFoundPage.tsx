import { Link } from "react-router-dom";
import { Compass, ArrowLeft, AlertCircle } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-teal-500 selection:text-slate-900 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-md p-8 rounded-3xl border border-slate-900 bg-slate-900/20 backdrop-blur-md shadow-2xl">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-teal-500/10 text-teal-400 mb-6">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="text-6xl font-extrabold mb-2 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-slate-400 font-light mb-8 leading-relaxed">
          Maaf, halaman atau rute lokasi yang Anda cari tidak tersedia. Hal ini mungkin karena alamat yang salah ketik atau lokasi telah dinonaktifkan.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/tour"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-teal-500/10"
          >
            <Compass className="w-4 h-4 animate-spin-slow" />
            Mulai Virtual Tour
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
