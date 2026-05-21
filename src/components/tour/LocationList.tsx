import { useState, useMemo } from "react";
import { 
  MapPin, 
  CheckCircle2, 
  Search, 
  Filter, 
  Folder, 
  FolderOpen, 
  ChevronDown, 
  ChevronRight,
  FileText
} from "lucide-react";
import type { TourNode } from "../../types/tour";

type LocationListProps = {
  nodes: TourNode[];
  activeNodeId: string;
  onSelect: (nodeId: string) => void;
  maps?: any[];
  primaryColor?: string;
  secondaryColor?: string;
};

export function LocationList({ 
  nodes, 
  activeNodeId, 
  onSelect, 
  maps = [],
  primaryColor = "#14b8a6",
  secondaryColor = "#3b82f6"
}: LocationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  
  // Collapsed state for maps / folders. Keys are mapId, values are boolean (true = expanded).
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = { "tanpa-zona": true };
    maps.forEach((m) => {
      initial[m.id] = true;
    });
    return initial;
  });

  const toggleFolder = (mapId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [mapId]: !prev[mapId]
    }));
  };

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

  // Group nodes by their mapId / folder
  const groupedNodes = useMemo(() => {
    const groups: Record<string, TourNode[]> = {};
    
    // Initialize groups for existing maps
    maps.forEach((map) => {
      groups[map.id] = [];
    });
    
    // Group for nodes with no mapId or unregistered mapId
    groups["tanpa-zona"] = [];

    filteredNodes.forEach((node) => {
      const mapId = node.mapId || "kampus-utama";
      if (groups[mapId]) {
        groups[mapId].push(node);
      } else {
        // Fallback to "tanpa-zona" or "kampus-utama"
        if (groups["kampus-utama"]) {
          groups["kampus-utama"].push(node);
        } else {
          groups["tanpa-zona"].push(node);
        }
      }
    });

    return groups;
  }, [filteredNodes, maps]);

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
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
                  isSelected
                    ? "text-slate-950 shadow-md"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80"
                }`}
                style={isSelected ? { backgroundColor: primaryColor, boxShadow: `0 4px 6px -1px ${primaryColor}30, 0 2px 4px -1px ${primaryColor}10` } : {}}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Scroll Area (Hierarchical Tree View) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {maps.length > 0 ? (
          <>
            {/* Render Map Folders */}
            {maps.map((map) => {
              const folderNodes = groupedNodes[map.id] || [];
              const isExpanded = expandedFolders[map.id] !== false; // default true
              
              if (folderNodes.length === 0 && searchTerm) return null; // Hide empty folders during search

              return (
                <div key={map.id} className="space-y-1.5">
                  {/* Folder Header */}
                  <button
                    onClick={() => toggleFolder(map.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900/30 hover:bg-slate-900/60 border border-slate-900/40 hover:border-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 tracking-wide uppercase">
                      {isExpanded ? (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                          <FolderOpen className="w-4 h-4" style={{ color: primaryColor, fill: `${primaryColor}15` }} />
                        </>
                      ) : (
                        <>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          <Folder className="w-4 h-4 text-slate-500" />
                        </>
                      )}
                      <span className="truncate">{map.name}</span>
                    </div>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full font-mono">
                      {folderNodes.length}
                    </span>
                  </button>

                  {/* Folder Contents */}
                  {isExpanded && (
                    <div className="pl-4 border-l border-slate-900/80 ml-3.5 space-y-2 pt-1">
                      {folderNodes.length > 0 ? (
                        folderNodes.map((node) => {
                          const isActive = node.id === activeNodeId;
                          return (
                            <button
                              key={node.id}
                              onClick={() => onSelect(node.id)}
                              className={`w-full flex items-start gap-2.5 p-2 rounded-xl transition-all border text-left ${
                                isActive
                                  ? "bg-slate-900"
                                  : "bg-transparent hover:bg-slate-900/50 border-transparent"
                              }`}
                              style={isActive ? { borderColor: `${primaryColor}60`, boxShadow: `0 4px 6px -1px ${primaryColor}10` } : {}}
                            >
                              {/* Small File/Pin Icon */}
                              <div className="relative shrink-0 mt-0.5">
                                <FileText className={`w-4 h-4 ${!isActive ? "text-slate-500" : ""}`} style={isActive ? { color: primaryColor } : {}} />
                              </div>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-semibold text-xs truncate ${isActive ? "font-bold" : "text-slate-300"}`} style={isActive ? { color: primaryColor } : {}}>
                                  {node.name}
                                </h4>
                                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-light">
                                  {node.description}
                                </p>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-[10px] text-slate-600 pl-6 py-1 italic">
                          Folder ini kosong
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Render "Lain-lain / Tanpa Zona" if it has nodes */}
            {groupedNodes["tanpa-zona"] && groupedNodes["tanpa-zona"].length > 0 && (
              <div className="space-y-1.5">
                <button
                  onClick={() => toggleFolder("tanpa-zona")}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900/30 hover:bg-slate-900/60 border border-slate-900/40 hover:border-slate-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wide uppercase">
                    {expandedFolders["tanpa-zona"] !== false ? (
                      <>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        <FolderOpen className="w-4 h-4 text-slate-500" style={{ fill: "rgba(100,116,139,0.1)" }} />
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        <Folder className="w-4 h-4 text-slate-500" />
                      </>
                    )}
                    <span>Titik Lainnya</span>
                  </div>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full font-mono">
                    {groupedNodes["tanpa-zona"].length}
                  </span>
                </button>

                {expandedFolders["tanpa-zona"] !== false && (
                  <div className="pl-4 border-l border-slate-900/80 ml-3.5 space-y-2 pt-1">
                    {groupedNodes["tanpa-zona"].map((node) => {
                      const isActive = node.id === activeNodeId;
                      return (
                        <button
                          key={node.id}
                          onClick={() => onSelect(node.id)}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-xl transition-all border text-left ${
                            isActive
                              ? "bg-slate-900"
                              : "bg-transparent hover:bg-slate-900/50 border-transparent"
                          }`}
                          style={isActive ? { borderColor: `${primaryColor}60`, boxShadow: `0 4px 6px -1px ${primaryColor}10` } : {}}
                        >
                          <div className="relative shrink-0 mt-0.5">
                            <FileText className={`w-4 h-4 ${!isActive ? "text-slate-500" : ""}`} style={isActive ? { color: primaryColor } : {}} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-xs truncate ${isActive ? "font-bold" : "text-slate-300"}`} style={isActive ? { color: primaryColor } : {}}>
                              {node.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-light">
                              {node.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Fallback when no maps loaded */
          filteredNodes.length > 0 ? (
            filteredNodes.map((node) => {
              const isActive = node.id === activeNodeId;
              return (
                <button
                  key={node.id}
                  onClick={() => onSelect(node.id)}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all border text-left ${
                    isActive
                      ? "bg-slate-900/80"
                      : "bg-slate-950 hover:bg-slate-900 border-slate-900/40 hover:border-slate-800"
                  }`}
                  style={isActive ? { borderColor: `${primaryColor}80`, boxShadow: `0 10px 15px -3px ${primaryColor}10` } : {}}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                    <img src={node.thumbnailUrl} alt={node.name} className="w-full h-full object-cover" />
                    {isActive && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center backdrop-blur-[1px]"
                        style={{ backgroundColor: `${primaryColor}40` }}
                      >
                        <CheckCircle2 className="w-5 h-5" style={{ color: primaryColor }} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-1 py-0.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                        {node.category}
                      </span>
                    </div>
                    <h4 className={`font-semibold text-sm truncate ${!isActive ? "text-white" : ""}`} style={isActive ? { color: primaryColor } : {}}>
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
          )
        )}
      </div>
    </div>
  );
}
