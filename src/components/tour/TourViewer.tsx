import { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import type { TourNode } from "../../types/tour";

// CSS Imports
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

type TourViewerProps = {
  activeNode: TourNode;
  onNavigate: (targetNodeId: string) => void;
  onOpenInfo: (infoHotspotId: string) => void;
  onInit: (viewerInstance: Viewer) => void;
  onLoadStart: () => void;
  onLoadEnd: () => void;
};

type MarkerItem = {
  id: string;
  yaw: number;
  pitch: number;
  html: string;
  anchor: string;
  scale: [number, number];
};

export function TourViewer({
  activeNode,
  onNavigate,
  onOpenInfo,
  onInit,
  onLoadStart,
  onLoadEnd,
}: TourViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  // Helper to construct Markers from TourNode data
  const generateMarkers = (node: TourNode): MarkerItem[] => {
    const markers: MarkerItem[] = [];

    // Navigation markers
    if (node.navigationHotspots) {
      node.navigationHotspots.forEach((nav) => {
        markers.push({
          id: `nav:${nav.targetNodeId}`,
          yaw: nav.yaw,
          pitch: nav.pitch,
          html: `
            <div class="cursor-pointer flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95" style="transform-origin: bottom center;">
              <!-- Pulsing outer circle -->
              <div class="relative w-12 h-12 flex items-center justify-center">
                <span class="absolute inline-flex h-full w-full rounded-full bg-teal-400/40 animate-ping opacity-75"></span>
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/40 border-2 border-slate-950">
                  <!-- Chevron Up Icon representing moving forward -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                </div>
              </div>
              <!-- Tooltip text below -->
              <div class="bg-slate-950/95 border border-slate-800 text-slate-100 text-[11px] px-2 py-1 rounded-lg shadow-2xl mt-1 pointer-events-none font-semibold tracking-wide flex items-center gap-1.5 whitespace-nowrap">
                <span>🚶 ${nav.label}</span>
              </div>
            </div>
          `,
          anchor: "bottom center",
          scale: [0.75, 1.25],
        });
      });
    }

    // Information markers
    if (node.infoHotspots) {
      node.infoHotspots.forEach((info) => {
        markers.push({
          id: `info:${info.id}`,
          yaw: info.yaw,
          pitch: info.pitch,
          html: `
            <div class="cursor-pointer flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95" style="transform-origin: bottom center;">
              <!-- Pulsing blue circle -->
              <div class="relative w-10 h-10 flex items-center justify-center">
                <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400/30 animate-pulse opacity-60"></span>
                <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md border-2 border-slate-950">
                  <!-- Info Circle Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </div>
              </div>
              <!-- Tooltip text below -->
              <div class="bg-slate-950/95 border border-slate-800 text-slate-100 text-[11px] px-2 py-1 rounded-lg shadow-2xl mt-1 pointer-events-none font-semibold tracking-wide whitespace-nowrap">
                🔍 ${info.label}
              </div>
            </div>
          `,
          anchor: "bottom center",
          scale: [0.75, 1.25],
        });
      });
    }

    return markers;
  };

  // Initialize photo sphere viewer on mount
  useEffect(() => {
    if (!containerRef.current) return;

    onLoadStart();

    // Instantiate PSV Core
    const viewer = new Viewer({
      container: containerRef.current,
      panorama: activeNode.panoramaUrl,
      defaultYaw: activeNode.defaultYaw || 0,
      defaultPitch: activeNode.defaultPitch || 0,
      navbar: false, // hide the default built-in navbar
      loadingImg: "", // hide the default loader image (we use custom overlay loader)
      touchmoveTwoFingers: false, // allow easy single finger pan on mobile
      mousewheel: true, // support mousewheel zoom
      plugins: [
        [
          MarkersPlugin,
          {
            markers: generateMarkers(activeNode),
          },
        ],
      ],
    });

    viewerRef.current = viewer;
    onInit(viewer);

    // Marker click event handling
    const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin;
    markersPlugin.addEventListener("select-marker", ({ marker }: { marker: { id: string } }) => {
      const markerId = marker.id;
      if (markerId.startsWith("nav:")) {
        const targetId = markerId.replace("nav:", "");
        onNavigate(targetId);
      } else if (markerId.startsWith("info:")) {
        const infoId = markerId.replace("info:", "");
        onOpenInfo(infoId);
      }
    });

    // Handle panorama load finish
    viewer.addEventListener("ready", () => {
      onLoadEnd();
    });

    // Cleanup on unmount
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update panorama and markers when activeNode changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    onLoadStart();

    // Transition panorama smoothly
    viewer
      .setPanorama(activeNode.panoramaUrl, {
        showLoader: false, // hide internal loader (we use React loading overlay)
        position: {
          yaw: activeNode.defaultYaw || 0,
          pitch: activeNode.defaultPitch || 0,
        },
      })
      .then(() => {
        // Update markers in MarkersPlugin
        const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin;
        if (markersPlugin) {
          markersPlugin.setMarkers(generateMarkers(activeNode));
        }
        onLoadEnd();
      })
      .catch((error) => {
        console.error("Gagal mengganti panorama: ", error);
        onLoadEnd();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNode.id]);

  return (
    <div className="relative w-full h-full bg-slate-950">
      {/* 360 Viewer Container */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
