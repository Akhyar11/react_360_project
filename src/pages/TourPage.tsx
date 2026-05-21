import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Viewer } from "@photo-sphere-viewer/core";
import { HelpCircle, X, Sparkles, Navigation2, Compass, AlertTriangle } from "lucide-react";
import { tourNodes as fallbackNodes, campusInfo as fallbackInfo } from "../data/tourNodes";
import { TourViewer } from "../components/tour/TourViewer";
import { LocationList } from "../components/tour/LocationList";
import { LocationInfoPanel } from "../components/tour/LocationInfoPanel";
import { TourControls } from "../components/tour/TourControls";
import { MiniMap } from "../components/tour/MiniMap";
import { School } from "lucide-react";
import type { InfoHotspot } from "../types/tour";
import { updateFavicon } from "../utils/favicon";

export function TourPage() {
  const { locationId } = useParams<{ locationId?: string }>();
  const navigate = useNavigate();

  // Dynamic state for locations & campus branding
  const [nodes, setNodes] = useState(fallbackNodes);
  const [maps, setMaps] = useState<any[]>([]);
  const [campusInfo, setCampusInfo] = useState<any>(fallbackInfo);

  const campusName = campusInfo.name || "Campus";
  const primaryColor = campusInfo.primaryColor || "#14b8a6";
  const secondaryColor = campusInfo.secondaryColor || "#3b82f6";

  // Find active node based on URL param or fallback to first node
  const defaultNode = nodes[0] || fallbackNodes[0];
  const activeNode = nodes.find((node) => node.id === locationId) || defaultNode;

  // Fetch locations and campus info dynamically on mount
  useEffect(() => {
    fetch("/api/nodes")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => setNodes(data))
      .catch((err) => console.log("Backend offline, menggunakan data statis lokal: ", err));

    fetch("/api/campus-info")
      .then((res) => res.json())
      .then((data) => {
        if (data.maps) setMaps(data.maps);
        setCampusInfo(data);
        if (data.logoUrl) updateFavicon(data.logoUrl);
      })
      .catch((err) => console.log("Gagal mengambil data kampus:", err));
  }, []);

  // Apply brand colors as CSS variables globally whenever they change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", primaryColor);
    root.style.setProperty("--color-secondary", secondaryColor);
  }, [primaryColor, secondaryColor]);

  // State Management
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(true);
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  
  // Selected info hotspot state for modal popover
  const [selectedInfoHotspot, setSelectedInfoHotspot] = useState<InfoHotspot | null>(null);

  // Reference to Photo Sphere Viewer instance
  const viewerRef = useRef<Viewer | null>(null);

  // Sync tab title based on activeNode name
  useEffect(() => {
    if (activeNode) {
      document.title = `Virtual Tour: ${activeNode.name} | ${campusName}`;
    }
  }, [activeNode, campusName]);

  // Sync URL if locationId is invalid or missing
  useEffect(() => {
    if (!locationId || !nodes.some((node) => node.id === locationId)) {
      navigate(`/tour/${defaultNode.id}`, { replace: true });
    }
  }, [locationId, navigate, defaultNode.id, nodes]);

  // Handle Fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Navigation handlers
  const handleNavigate = (targetId: string) => {
    setIsLoading(true);
    setErrorState(null);
    navigate(`/tour/${targetId}`);
  };

  const handleOpenInfoHotspot = (infoHotspotId: string) => {
    const hotspot = activeNode.infoHotspots.find((h) => h.id === infoHotspotId);
    if (hotspot) {
      setSelectedInfoHotspot(hotspot);
    }
  };

  // Zoom handlers using Photo Sphere Viewer API
  const handleZoomIn = () => {
    if (viewerRef.current) {
      const zoom = viewerRef.current.getZoomLevel();
      viewerRef.current.zoom(zoom + 10);
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      const zoom = viewerRef.current.getZoomLevel();
      viewerRef.current.zoom(zoom - 10);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Gagal mengaktifkan Fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden flex flex-col md:flex-row text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-900">
      {/* 1. Sidebar Location (Left) */}
      {isUiVisible && isSidebarOpen && (
        <aside className="w-full md:w-80 h-1/3 md:h-full z-30 flex-shrink-0 order-2 md:order-1 relative shadow-2xl">
          <LocationList
            nodes={nodes}
            activeNodeId={activeNode.id}
            onSelect={handleNavigate}
            maps={maps}
          />
        </aside>
      )}

      {/* 2. Main Tour View Container */}
      <main className="relative flex-1 h-2/3 md:h-full order-1 md:order-2 flex flex-col overflow-hidden">
        {/* Photo Sphere Viewer */}
        <div className="absolute inset-0 w-full h-full z-0">
          <TourViewer
            activeNode={activeNode}
            onNavigate={handleNavigate}
            onOpenInfo={handleOpenInfoHotspot}
            onInit={(instance) => {
              viewerRef.current = instance;
            }}
            onLoadStart={() => {
              setIsLoading(true);
              setErrorState(null);
            }}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
          />
        </div>

        {/* Global Loading Spinner / Transition Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center gap-4 transition-all duration-300">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-teal-500/20 animate-ping"></span>
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-teal-500 animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-white text-lg tracking-wide uppercase flex items-center gap-2">
                <Compass className="w-5 h-5 text-teal-400 animate-spin-slow" />
                Memuat Panorama 360°
              </h3>
              <p className="text-slate-400 text-xs mt-1 font-light">Menyiapkan lingkungan imersif virtual tour...</p>
            </div>
          </div>
        )}

        {/* Error Fallback State */}
        {errorState && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center">
            <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-4 animate-bounce">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Gagal Memuat Panorama</h2>
            <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
              {errorState}
            </p>
            <button
              onClick={() => handleNavigate(activeNode.id)}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 text-slate-950 font-bold rounded-xl shadow-lg active:scale-95 transition-all"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Floating Top Header Info */}
        {isUiVisible && (
          <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex items-start justify-between gap-3">
            {/* Left: Active Location Badge */}
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3.5 pointer-events-auto">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-950 shadow-md shrink-0"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <Navigation2 className="w-4 h-4 -rotate-45 text-white" />
              </div>
              <div>
                <span
                  className="text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5"
                  style={{ color: primaryColor }}
                >
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  Lokasi Aktif
                </span>
                <h1 className="font-bold text-sm text-white">{activeNode.name}</h1>
              </div>
            </div>

            {/* Right: Campus Identity Badge */}
            <div className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 pointer-events-auto ml-auto">
              <div className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 overflow-hidden flex items-center justify-center shrink-0">
                {campusInfo.logoUrl ? (
                  <img src={campusInfo.logoUrl.startsWith("/") || campusInfo.logoUrl.startsWith("http") ? campusInfo.logoUrl : `/${campusInfo.logoUrl}`} alt="Logo" className="w-full h-full object-contain p-0.5" />
                ) : (
                  <School className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight max-w-[120px] truncate">{campusName}</p>
                {campusInfo.slogan && (
                  <p className="text-[9px] text-slate-500 font-light leading-tight max-w-[120px] truncate">{campusInfo.slogan}</p>
                )}
              </div>
              {/* Gradient accent bar */}
              <div
                className="hidden sm:block w-0.5 h-7 rounded-full ml-0.5"
                style={{ background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})` }}
              />
            </div>
          </div>
        )}

        {/* Floating Side Components: MiniMap */}
        {isUiVisible && isMapOpen && (
          <div className="absolute bottom-24 right-4 z-20 hidden md:block">
            <MiniMap
              nodes={nodes}
              activeNodeId={activeNode.id}
              onSelect={handleNavigate}
              maps={maps}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          </div>
        )}

        {/* Floating Bottom Controls Row */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-full px-4">
          <TourControls
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isInfoOpen={isInfoOpen}
            onToggleInfo={() => setIsInfoOpen(!isInfoOpen)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            isUiVisible={isUiVisible}
            onToggleUiVisible={() => setIsUiVisible(!isUiVisible)}
            isMapOpen={isMapOpen}
            onToggleMap={() => setIsMapOpen(!isMapOpen)}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />
        </div>
      </main>

      {/* 3. Detail Info Panel (Right) */}
      {isUiVisible && isInfoOpen && (
        <aside className="w-full md:w-80 h-1/3 md:h-full z-30 flex-shrink-0 order-3 relative shadow-2xl">
          <LocationInfoPanel
            node={activeNode}
            isOpen={isInfoOpen}
            onClose={() => setIsInfoOpen(false)}
          />
        </aside>
      )}

      {/* 4. Info Hotspot Detail Popover Modal */}
      {selectedInfoHotspot && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {/* Background Accent glow */}
            <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <button
              onClick={() => setSelectedInfoHotspot(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2.5">
              <HelpCircle className="w-4 h-4" />
              <span>Detail Fasilitas Kampus</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">
              {selectedInfoHotspot.label}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-light mb-6">
              {selectedInfoHotspot.description}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedInfoHotspot(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold transition-colors"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default TourPage;
