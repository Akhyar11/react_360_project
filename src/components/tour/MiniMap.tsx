import { useState, useEffect } from "react";
import { Map, Navigation } from "lucide-react";
import type { TourNode } from "../../types/tour";

type CampusMapData = {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
};

type MiniMapProps = {
  nodes: TourNode[];
  activeNodeId: string;
  onSelect: (nodeId: string) => void;
  maps?: CampusMapData[];
};

// Helper function to render high-tech markers based on shape and color
function renderMarkerShape(shape: 'circle' | 'square' | 'triangle' | 'diamond', color: string, isActive: boolean) {
  const baseClass = isActive
    ? "scale-125 shadow-[0_0_10px_rgba(255,255,255,0.7)] ring-2 ring-white/70 animate-pulse transition-all duration-300"
    : "group-hover:scale-130 group-hover:brightness-125 transition-all duration-200 border border-slate-950";

  if (shape === 'square') {
    return (
      <div 
        className={`w-3.5 h-3.5 rounded-sm ${baseClass}`} 
        style={{ backgroundColor: color }}
      />
    );
  }
  if (shape === 'triangle') {
    return (
      <div 
        className={`w-3.5 h-3.5 ${baseClass}`} 
        style={{ 
          backgroundColor: color, 
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        }}
      />
    );
  }
  if (shape === 'diamond') {
    return (
      <div 
        className={`w-3 h-3 rotate-45 ${baseClass}`} 
        style={{ backgroundColor: color }}
      />
    );
  }
  // Default 'circle'
  return (
    <div 
      className={`w-3.5 h-3.5 rounded-full ${baseClass}`} 
      style={{ backgroundColor: color }}
    />
  );
}

export function MiniMap({ nodes, activeNodeId, onSelect, maps = [] }: MiniMapProps) {
  const activeNode = nodes.find(n => n.id === activeNodeId);
  
  // Track which map is currently selected for viewing
  const [selectedMapId, setSelectedMapId] = useState<string>("kampus-utama");

  // Sync selected map with active location whenever active location changes
  useEffect(() => {
    if (activeNode?.mapId) {
      setSelectedMapId(activeNode.mapId);
    }
  }, [activeNodeId, activeNode]);

  // Safely parse maps array defensively if it comes as a string representation
  const parsedMaps = Array.isArray(maps) 
    ? maps 
    : (typeof maps === "string" ? JSON.parse(maps) : []);

  const activeMap = parsedMaps.find((m: any) => m.id === selectedMapId) || parsedMaps[0];
  
  // Filter nodes belonging to the currently selected map
  const visibleNodes = nodes.filter(node => (node.mapId || "kampus-utama") === selectedMapId);

  return (
    <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md w-72 relative overflow-hidden">
      {/* Background Tech Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 relative z-10">
        <div className="flex items-center gap-1.5">
          <Map className="w-4 h-4 text-teal-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Denah Kampus UAN</span>
        </div>
        <div className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-teal-400 font-bold tracking-widest uppercase select-none">
          Live Map
        </div>
      </div>

      {/* Map Switcher Tabs */}
      {parsedMaps.length > 1 && (
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1.5 scrollbar-none relative z-10 border-b border-slate-900">
          {parsedMaps.map((map: any) => (
            <button
              key={map.id}
              onClick={() => setSelectedMapId(map.id)}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedMapId === map.id
                  ? "bg-gradient-to-r from-teal-500/20 to-blue-600/20 border border-teal-500/40 text-teal-300 shadow-md shadow-teal-500/5"
                  : "bg-slate-900/60 border border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800"
              }`}
            >
              {map.name}
            </button>
          ))}
        </div>
      )}

      {/* Map Area */}
      <div 
        className="relative h-44 rounded-xl border border-slate-900 bg-slate-950 overflow-hidden flex items-center justify-center shadow-inner bg-cover bg-center transition-all duration-300"
        style={{ backgroundImage: activeMap?.imageUrl ? `url(${activeMap.imageUrl})` : 'none' }}
      >
        {/* Semi-transparent dark overlay to ensure high contrast against drone maps */}
        {activeMap?.imageUrl && (
          <div className="absolute inset-0 bg-slate-950/45 pointer-events-none z-0" />
        )}

        {/* SVG Grid and Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-10">
          {/* Glowing grid lines (Only show grid overlay if there's no custom uploaded background image, or overlay lightly if there is) */}
          <defs>
            <pattern id="mapGrid" width="10%" height="10%" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(20, 184, 166, 0.15)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" className={activeMap?.imageUrl ? "opacity-40" : "opacity-100"} />
          
          {/* Dynamic connection lines based on hotspots */}
          {(() => {
            const lines: React.ReactNode[] = [];
            const processed = new Set<string>();
            
            visibleNodes.forEach(nodeA => {
              const posA = nodeA.mapPosition || { x: 50, y: 50 };
              const colorA = nodeA.mapPosition?.color || '#14b8a6';
              
              nodeA.navigationHotspots?.forEach(hs => {
                const nodeB = visibleNodes.find(n => n.id === hs.targetNodeId);
                if (nodeB) {
                  const posB = nodeB.mapPosition || { x: 50, y: 50 };
                  const pairKey = [nodeA.id, nodeB.id].sort().join('-');
                  
                  if (!processed.has(pairKey)) {
                    processed.add(pairKey);
                    lines.push(
                      <line
                        key={pairKey}
                        x1={`${posA.x}%`}
                        y1={`${posA.y}%`}
                        x2={`${posB.x}%`}
                        y2={`${posB.y}%`}
                        stroke={colorA}
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        className="opacity-75 animate-pulse"
                      />
                    );
                  }
                }
              });
            });
            return lines;
          })()}
        </svg>

        {/* Nodes / Points */}
        {visibleNodes.map((node) => {
          const isActive = node.id === activeNodeId;
          const pos = node.mapPosition || { x: 50, y: 50 };
          const shape = node.mapPosition?.shape || 'circle';
          const color = node.mapPosition?.color || '#14b8a6';

          return (
            <button
              key={node.id}
              onClick={() => onSelect(node.id)}
              className="absolute group -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 z-20"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              title={node.name}
            >
              {/* Pulsing indicator if active */}
              {isActive ? (
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <span 
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70"
                    style={{ backgroundColor: color }}
                  />
                  <span className="relative flex items-center justify-center">
                    {renderMarkerShape(shape, color, true)}
                    <Navigation className="absolute w-2 h-2 text-white animate-bounce rotate-45 z-10" />
                  </span>
                </div>
              ) : (
                renderMarkerShape(shape, color, false)
              )}

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-950 border border-slate-800 text-[10px] text-white py-1 px-2 rounded whitespace-nowrap shadow-xl pointer-events-none z-30 font-medium">
                {node.name}
              </div>
            </button>
          );
        })}

        {/* Map Watermark / Branding */}
        <div className="absolute bottom-2 left-2 text-[8px] text-slate-400/50 tracking-widest font-mono select-none uppercase pointer-events-none z-10">
          {activeMap?.name || "UAN Campus Map"}
        </div>
      </div>
      
      {/* Active node description */}
      {activeNode && activeNode.mapId === selectedMapId && (
        <div className="mt-2.5 pt-2 border-t border-slate-900 text-[10px] text-slate-400 font-light flex items-center justify-between">
          <span>Titik Aktif:</span>
          <span className="font-semibold text-teal-400">{activeNode.name}</span>
        </div>
      )}
    </div>
  );
}
