import { useState, useMemo } from "react";
import { MapPin, CheckCircle2, Search, Filter } from "lucide-react";
import type { TourNode } from "../../types/tour";

type LocationListProps = {
  nodes: TourNode[];
  activeNodeId: string;
  onSelect: (nodeId: string) => void;
};

export function LocationList({ nodes, activeNodeId, onSelect }: LocationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = useMemo(() => {
    const cats = new Set(nodes.map((node) => node.category));
    return ["Semua", ...Array.from(cats)];
  }, [nodes]);

  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Semua" || node.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [nodes, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 border-r border-slate-900">
      {/* Header Info */}
      <div className="p-4 border-b border-slate-900">
        <h3 className="text-lg font-bold text-white tracking-wide">Daftar Lokasi Tour</h3>
        <p className="text-xs text-slate-500 font-light mt-0.5">Pilih titik untuk berpindah secara instan</p>
      </div>

      {/* Search and Filters */}
      <div className="p-4 gap-3 flex flex-col border-b border-slate-900 bg-slate-950/50">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nama lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/80 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
                selectedCategory === category
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Location Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredNodes.length > 0 ? (
          filteredNodes.map((node) => {
            const isActive = node.id === activeNodeId;
            return (
              <button
                key={node.id}
                onClick={() => onSelect(node.id)}
                className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all border text-left ${
                  isActive
                    ? "bg-slate-900/80 border-teal-500/50 shadow-lg shadow-teal-500/5"
                    : "bg-slate-950 hover:bg-slate-900 border-slate-900/40 hover:border-slate-800"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                  <img
                    src={node.thumbnailUrl}
                    alt={node.name}
                    className="w-full h-full object-cover"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-teal-500/25 flex items-center justify-center backdrop-blur-[1px]">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-1 py-0.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                      {node.category}
                    </span>
                  </div>
                  <h4 className={`font-semibold text-sm truncate ${isActive ? "text-teal-400" : "text-white"}`}>
                    {node.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 font-light leading-relaxed">
                    {node.description}
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-12 px-4">
            <MapPin className="w-8 h-8 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Tidak ada lokasi yang cocok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
