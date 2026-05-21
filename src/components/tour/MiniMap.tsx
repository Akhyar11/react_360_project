import { Map, Navigation } from "lucide-react";
import type { TourNode } from "../../types/tour";

type MiniMapProps = {
  nodes: TourNode[];
  activeNodeId: string;
  onSelect: (nodeId: string) => void;
};

export function MiniMap({ nodes, activeNodeId, onSelect }: MiniMapProps) {
  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md w-72 relative overflow-hidden">
      {/* Background Tech Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-1.5">
          <Map className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Denah Kampus UAN</span>
        </div>
        <div className="flex gap-1">
          <div className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-teal-400 font-bold tracking-widest uppercase">
            Schematic
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative h-44 rounded-xl border border-slate-900 bg-slate-950 overflow-hidden flex items-center justify-center shadow-inner">
        {/* Draw Schematic Connection Roads/Paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {/* Path 1: Gerbang (50, 85) to Lobby (50, 60) */}
          <line x1="50%" y1="85%" x2="50%" y2="60%" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Path 2: Lobby (50, 60) to Perpustakaan (30, 40) */}
          <line x1="50%" y1="60%" x2="30%" y2="40%" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Path 3: Perpustakaan (30, 40) to Observatorium (60, 25) */}
          <line x1="30%" y1="40%" x2="60%" y2="25%" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Path 4: Observatorium (60, 25) to Lapangan (75, 60) */}
          <line x1="60%" y1="25%" x2="75%" y2="60%" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Path 5: Lapangan (75, 60) to Gerbang (50, 85) */}
          <line x1="75%" y1="60%" x2="50%" y2="85%" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>

        {/* Nodes / Points */}
        {nodes.map((node) => {
          const isActive = node.id === activeNodeId;
          const pos = node.mapPosition || { x: 50, y: 50 };

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
                <div className="relative flex h-5 w-5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-teal-400 border border-slate-950 flex items-center justify-center">
                    <Navigation className="w-2 h-2 text-slate-950 animate-pulse rotate-45" />
                  </span>
                </div>
              ) : (
                <div className="h-2.5 w-2.5 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:border-teal-400 group-hover:bg-teal-500/20 transition-colors" />
              )}

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-950 border border-slate-800 text-[10px] text-white py-1 px-2 rounded whitespace-nowrap shadow-xl pointer-events-none z-30 font-medium">
                {node.name}
              </div>
            </button>
          );
        })}

        {/* Map Watermark / Branding */}
        <div className="absolute bottom-2 left-2 text-[9px] text-slate-700 tracking-wider font-mono select-none uppercase pointer-events-none">
          Grid-Overlay v1.0
        </div>
      </div>
    </div>
  );
}
