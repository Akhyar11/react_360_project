import { X, Check, MapPin, School, HelpCircle } from "lucide-react";
import type { TourNode } from "../../types/tour";

type LocationInfoPanelProps = {
  node: TourNode;
  isOpen: boolean;
  onClose: () => void;
};

export function LocationInfoPanel({ node, isOpen, onClose }: LocationInfoPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 border-l border-slate-900 max-w-sm w-full shadow-2xl relative overflow-hidden">
      {/* Background glow in details panel */}
      <div className="absolute -right-20 -top-20 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-900 relative z-10 bg-slate-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-teal-400 shrink-0 animate-bounce" />
          <h3 className="font-bold text-white tracking-wide">Detail Lokasi</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Tutup Panel Detail"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Category & Title */}
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-md">
            {node.category}
          </span>
          <h2 className="text-xl font-extrabold text-white mt-3 leading-snug">
            {node.name}
          </h2>
        </div>

        {/* Thumbnail preview */}
        {node.thumbnailUrl && (
          <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 shadow-md">
            <img
              src={node.thumbnailUrl}
              alt={node.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
          </div>
        )}

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-slate-500" />
            Deskripsi Tempat
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            {node.description}
          </p>
        </div>

        {/* Facilities */}
        {node.facilities && node.facilities.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-teal-400" />
              Fasilitas & Layanan
            </h4>
            <ul className="space-y-2">
              {node.facilities.map((fac, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 text-teal-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="font-light">{fac}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/40 text-center relative z-10">
        <p className="text-[10px] text-slate-600 font-light flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          Klik hotspot berkedip untuk berjalan-jalan
        </p>
      </div>
    </div>
  );
}
