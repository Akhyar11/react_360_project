import {
  Maximize2,
  Minimize2,
  Menu,
  Info,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Home,
  Map
} from "lucide-react";
import { Link } from "react-router-dom";

type TourControlsProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isInfoOpen: boolean;
  onToggleInfo: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isUiVisible: boolean;
  onToggleUiVisible: () => void;
  isMapOpen: boolean;
  onToggleMap: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  primaryColor?: string;
  secondaryColor?: string;
};

export function TourControls({
  isSidebarOpen,
  onToggleSidebar,
  isInfoOpen,
  onToggleInfo,
  isFullscreen,
  onToggleFullscreen,
  isUiVisible,
  onToggleUiVisible,
  isMapOpen,
  onToggleMap,
  onZoomIn,
  onZoomOut,
  primaryColor = "#14b8a6",
  secondaryColor = "#3b82f6",
}: TourControlsProps) {
  // If UI is completely hidden, only render the show-UI overlay toggle button so they can restore it
  if (!isUiVisible) {
    return (
      <div className="absolute bottom-6 left-6 z-50">
        <button
          onClick={onToggleUiVisible}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300 hover:text-white shadow-2xl backdrop-blur-md transition-all active:scale-95"
          title="Tampilkan UI Kontrol"
        >
          <Eye className="w-5 h-5" style={{ color: primaryColor }} />
          <span className="text-xs font-semibold tracking-wider uppercase">Tampilkan Kontrol</span>
        </button>
      </div>
    );
  }

  const activeStyle = {
    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
    color: "#0f172a",
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Home Button */}
      <Link
        to="/"
        className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition-all active:scale-95"
        title="Kembali ke Beranda"
      >
        <Home className="w-5 h-5" />
      </Link>

      {/* Main Tour Action Toggles */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-lg backdrop-blur-md">
        {/* Toggle Location List Sidebar */}
        <button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-xl transition-all font-bold"
          style={isSidebarOpen ? activeStyle : {}}
          title={isSidebarOpen ? "Tutup Daftar Lokasi" : "Buka Daftar Lokasi"}
        >
          <Menu className={`w-5 h-5 ${!isSidebarOpen ? "text-slate-400" : ""}`} />
        </button>

        {/* Toggle Info Panel */}
        <button
          onClick={onToggleInfo}
          className="p-2.5 rounded-xl transition-all font-bold"
          style={isInfoOpen ? activeStyle : {}}
          title={isInfoOpen ? "Tutup Detail Lokasi" : "Buka Detail Lokasi"}
        >
          <Info className={`w-5 h-5 ${!isInfoOpen ? "text-slate-400" : ""}`} />
        </button>

        {/* Toggle Mini Map Overlay */}
        <button
          onClick={onToggleMap}
          className="p-2.5 rounded-xl transition-all font-bold"
          style={isMapOpen ? activeStyle : {}}
          title={isMapOpen ? "Sembunyikan Denah" : "Tampilkan Denah"}
        >
          <Map className={`w-5 h-5 ${!isMapOpen ? "text-slate-400" : ""}`} />
        </button>
      </div>

      {/* Viewer controls (Zoom / Fullscreen / Hide UI) */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-lg backdrop-blur-md">
        {/* Zoom In */}
        <button
          onClick={onZoomIn}
          className="p-2.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition-all active:scale-90"
          title="Perbesar (Zoom In)"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={onZoomOut}
          className="p-2.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition-all active:scale-90"
          title="Perkecil (Zoom Out)"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        {/* Toggle Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          className="p-2.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition-all active:scale-90"
          title={isFullscreen ? "Keluar Fullscreen" : "Masuk Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>

        {/* Toggle UI Visibility */}
        <button
          onClick={onToggleUiVisible}
          className="p-2.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition-all"
          title="Sembunyikan Semua Kontrol"
        >
          <EyeOff className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </div>
  );
}
