import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  School,
  Compass,
  ArrowLeft,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Save,
  CheckCircle,
  AlertCircle,
  MapPin,
  Eye,
  Layers,
  Sparkles,
  Upload,
  Map,
  X
} from "lucide-react";
import { campusInfo as fallbackInfo, tourNodes as fallbackNodes } from "../data/tourNodes";
import type { TourNode } from "../types/tour";

export function AdminPage() {
  const [nodes, setNodes] = useState<TourNode[]>(fallbackNodes);
  const [campusInfo, setCampusInfo] = useState(fallbackInfo);
  const [activeTab, setActiveTab] = useState<"locations" | "campus" | "maps">("locations");
  const [adminName, setAdminName] = useState("Admin");
  const navigate = useNavigate();
  
  // Loading & Alert state
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Partial<TourNode> | null>(null);
  const [facilityInput, setFacilityInput] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    document.title = "Admin Panel | UAN 360°";
    
    // Auth Check
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    
    // Load admin user details
    try {
      const userStr = localStorage.getItem("admin_user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        setAdminName(userObj.name || "Admin");
      }
    } catch (e) {
      console.error(e);
    }
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resNodes = await fetch("http://localhost:5000/api/nodes");
      if (resNodes.ok) {
        const dataNodes = await resNodes.json();
        setNodes(dataNodes);
      }
      
      const resInfo = await fetch("http://localhost:5000/api/campus-info");
      if (resInfo.ok) {
        const dataInfo = await resInfo.json();
        if (dataInfo.maps && typeof dataInfo.maps === "string") {
          try {
            dataInfo.maps = JSON.parse(dataInfo.maps);
          } catch (e) {
            console.error("Gagal mengurai maps:", e);
          }
        }
        if (dataInfo.stats && typeof dataInfo.stats === "string") {
          try {
            dataInfo.stats = JSON.parse(dataInfo.stats);
          } catch (e) {
            console.error("Gagal mengurai stats:", e);
          }
        }
        setCampusInfo(dataInfo);
      }
    } catch (error) {
      console.error("Gagal mengambil data dari backend:", error);
      showToast("error", "Koneksi backend offline. Menjalankan mode demo menggunakan data lokal.");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // --- LOCATION ACTIONS ---

  const handleOpenAddModal = () => {
    setEditingNode({
      id: "",
      name: "",
      category: "Area Outdoor",
      description: "",
      panoramaUrl: "",
      thumbnailUrl: "",
      defaultYaw: 0,
      defaultPitch: 0,
      mapPosition: { x: 50, y: 50 },
      mapId: "kampus-utama",
      facilities: [],
      navigationHotspots: [],
      infoHotspots: []
    });
    setFacilityInput("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (node: TourNode) => {
    setEditingNode({ ...node });
    setFacilityInput("");
    setIsModalOpen(true);
  };

  const handleSaveNode = async () => {
    if (!editingNode || !editingNode.id || !editingNode.name || !editingNode.panoramaUrl) {
      showToast("error", "Harap isi ID Lokasi, Nama Lokasi, dan URL Panorama!");
      return;
    }

    const isNew = !nodes.some((n) => n.id === editingNode.id);
    const url = isNew
      ? "http://localhost:5000/api/nodes"
      : `http://localhost:5000/api/nodes/${editingNode.id}`;
    const method = isNew ? "POST" : "PUT";

    setIsLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify(editingNode)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menyimpan data lokasi.");
      }

      showToast("success", `Sukses ${isNew ? "menambahkan" : "memperbarui"} lokasi "${editingNode.name}"!`);
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error(error);
      showToast("error", error.message || "Gagal menghubungi backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNode = (id: string, name: string) => {
    setDeleteConfirmation({ id, name });
  };

  const executeDeleteNode = async (id: string, name: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/nodes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        }
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus lokasi.");
      }

      showToast("success", `Sukses menghapus lokasi "${name}".`);
      fetchData();
    } catch (error: any) {
      console.error(error);
      showToast("error", error.message || "Gagal menghapus lokasi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "panorama" | "thumbnail") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah berkas gambar.");
      }

      if (editingNode) {
        setEditingNode({
          ...editingNode,
          [target === "panorama" ? "panoramaUrl" : "thumbnailUrl"]: data.url
        });
      }

      showToast("success", `Gambar ${target === "panorama" ? "panorama" : "thumbnail"} berhasil diunggah secara fisik!`);
    } catch (err: any) {
      console.error(err);
      showToast("error", err.message || "Gagal menghubungi server untuk mengunggah gambar.");
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  };

  // Facility Tag Handlers
  const handleAddFacility = () => {
    if (!facilityInput.trim() || !editingNode) return;
    const currentFacilities = editingNode.facilities || [];
    if (currentFacilities.includes(facilityInput.trim())) return;
    
    setEditingNode({
      ...editingNode,
      facilities: [...currentFacilities, facilityInput.trim()]
    });
    setFacilityInput("");
  };

  const handleRemoveFacility = (facilityToRemove: string) => {
    if (!editingNode || !editingNode.facilities) return;
    setEditingNode({
      ...editingNode,
      facilities: editingNode.facilities.filter((f) => f !== facilityToRemove)
    });
  };

  // --- CAMPUS INFO ACTIONS ---

  const handleUpdateCampusInfoField = (field: string, value: any) => {
    setCampusInfo({
      ...campusInfo,
      [field]: value
    });
  };

  const handleSaveCampusInfo = async () => {
    setIsLoading(true);
    try {
      const saveRes = await fetch("http://localhost:5000/api/campus-info", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify(campusInfo)
      });

      if (!saveRes.ok) {
        throw new Error("Gagal menyimpan profil kampus.");
      }
      showToast("success", "Profil Universitas berhasil disimpan secara dinamis ke database!");
    } catch (error) {
      console.error(error);
      showToast("error", "Koneksi backend offline atau tidak mendukung pembaruan profil.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- CAMPUS MAP ACTIONS ---

  const handleMapBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>, mapId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah berkas gambar.");
      }

      const updatedMaps = ((campusInfo as any).maps || []).map((m: any) => {
        if (m.id === mapId) {
          return { ...m, imageUrl: data.url };
        }
        return m;
      });

      setCampusInfo({
        ...campusInfo,
        maps: updatedMaps
      });

      showToast("success", "Gambar denah berhasil diunggah secara fisik!");
    } catch (err: any) {
      console.error(err);
      showToast("error", err.message || "Gagal menghubungi server untuk mengunggah gambar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMap = () => {
    const newMapId = `kampus-${Date.now()}`;
    const newMapName = `Kampus Baru (Zona ${((campusInfo as any).maps?.length || 0) + 1})`;
    const newMaps = [
      ...((campusInfo as any).maps || []),
      {
        id: newMapId,
        name: newMapName,
        imageUrl: "",
        description: "Denah area baru"
      }
    ];
    setCampusInfo({
      ...campusInfo,
      maps: newMaps
    });
  };

  const handleRemoveMap = (mapId: string) => {
    const hasReferencingNodes = nodes.some(node => (node.mapId || "kampus-utama") === mapId);
    if (hasReferencingNodes) {
      showToast("error", "Denah ini tidak dapat dihapus karena masih ada titik lokasi yang terhubung dengannya!");
      return;
    }

    if (mapId === "kampus-utama" && ((campusInfo as any).maps || []).length === 1) {
      showToast("error", "Harus menyisakan minimal 1 denah utama!");
      return;
    }

    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus denah ini? Pilihan ini tidak dapat dibatalkan.");
    if (!confirmDelete) return;

    const newMaps = ((campusInfo as any).maps || []).filter((m: any) => m.id !== mapId);
    setCampusInfo({
      ...campusInfo,
      maps: newMaps
    });
  };

  const handleUpdateMapField = (mapId: string, field: string, value: any) => {
    const newMaps = ((campusInfo as any).maps || []).map((m: any) => {
      if (m.id === mapId) {
        return { ...m, [field]: value };
      }
      return m;
    });
    setCampusInfo({
      ...campusInfo,
      maps: newMaps
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-900">
      {/* Toast Alert */}
      {alert && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-md animate-fade-in ${
          alert.type === "success"
            ? "bg-teal-500/10 border-teal-500/30 text-teal-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}>
          {alert.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-semibold">{alert.message}</span>
        </div>
      )}

      {/* Fullscreen Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 transition-all duration-300">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-teal-500/20 animate-ping"></span>
            <div className="w-10 h-10 rounded-full border-4 border-slate-800 border-t-teal-500 animate-spin"></div>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Menyinkronkan Database...</p>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="w-full max-w-md p-8 rounded-3xl border border-red-500/20 bg-slate-900/60 backdrop-blur-lg shadow-2xl animate-scale-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 shadow-lg shadow-red-500/5">
                <Trash2 className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-extrabold text-white mb-2">Hapus Lokasi Permanen?</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 font-light">
                Apakah Anda yakin ingin menghapus lokasi <strong className="text-white font-bold">"{deleteConfirmation.name}"</strong>? 
                Semua titik navigasi (hotspot) di lokasi lain yang mengarah ke sini akan otomatis dibersihkan secara permanen.
              </p>

              <div className="flex items-center gap-3 w-full font-sans">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 px-5 py-3 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:text-white font-bold text-sm text-slate-400 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const { id, name } = deleteConfirmation;
                    setDeleteConfirmation(null);
                    executeDeleteNode(id, name);
                  }}
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-sm shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-teal-400 to-blue-500 p-2 rounded-xl text-slate-950 shadow-lg">
                <Settings className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-white tracking-wide">CMS Admin Panel</h1>
                <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Kelola Virtual Tour 360°</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
              Halo, <strong className="text-white font-bold">{adminName}</strong>
            </span>
            <Link to="/tour" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-sm transition-colors">
              <Compass className="w-4 h-4" />
              Lihat Virtual Tour
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");
                navigate("/login", { replace: true });
              }}
              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-sm transition-all"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Lokasi</span>
              <h3 className="text-3xl font-extrabold text-white mt-1">{nodes.length}</h3>
            </div>
            <div className="p-3.5 rounded-xl bg-teal-500/10 text-teal-400"><MapPin className="w-6 h-6" /></div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Program Studi</span>
              <h3 className="text-3xl font-extrabold text-white mt-1">{campusInfo.stats[1]?.value || "42"}</h3>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400"><School className="w-6 h-6" /></div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kategori Unik</span>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {Array.from(new Set(nodes.map((n) => n.category))).length}
              </h3>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400"><Layers className="w-6 h-6" /></div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Status Koneksi</span>
              <h3 className="text-sm font-extrabold text-teal-400 mt-2.5 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-ping shrink-0" />
                Dinamis Backend
              </h3>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400"><Sparkles className="w-6 h-6" /></div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-900 mb-8 gap-6">
          <button
            onClick={() => setActiveTab("locations")}
            className={`pb-4 px-2 text-base font-bold transition-all relative ${
              activeTab === "locations" ? "text-teal-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {activeTab === "locations" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 rounded-full" />}
            Kelola Titik Lokasi ({nodes.length})
          </button>
          <button
            onClick={() => setActiveTab("campus")}
            className={`pb-4 px-2 text-base font-bold transition-all relative ${
              activeTab === "campus" ? "text-teal-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {activeTab === "campus" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 rounded-full" />}
            Profil Kampus & Statistik
          </button>
          <button
            onClick={() => setActiveTab("maps")}
            className={`pb-4 px-2 text-base font-bold transition-all relative ${
              activeTab === "maps" ? "text-teal-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {activeTab === "maps" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 rounded-full" />}
            Kelola Denah Peta (Background)
          </button>
        </div>

        {/* --- TAB CONTENT: LOCATIONS --- */}
        {activeTab === "locations" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Daftar Titik 360°</h2>
                <p className="text-xs text-slate-500 font-light mt-1">Gunakan panel ini untuk mengedit data panorama, koordinat awal, dan detail fasilitas lokasi.</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Tambah Lokasi Baru
              </button>
            </div>

            {/* Grid Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nodes.map((node) => (
                <div key={node.id} className="p-5 rounded-2xl border border-slate-900 bg-slate-950 flex flex-col justify-between group hover:border-slate-800 transition-colors">
                  <div>
                    {/* Thumbnail Preview */}
                    <div className="relative h-44 rounded-xl overflow-hidden mb-4 border border-slate-900">
                      <img src={node.thumbnailUrl} alt={node.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-950/80 text-teal-400 border border-slate-800 backdrop-blur-sm">
                        {node.category}
                      </div>
                    </div>

                    <h3 className="font-bold text-white text-lg leading-snug">{node.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold font-mono tracking-wider mt-1">{node.id}</p>
                    <p className="text-xs text-slate-400 font-light mt-3 line-clamp-2 leading-relaxed">
                      {node.description}
                    </p>

                    {/* Facilities Tag List */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {node.facilities?.slice(0, 3).map((fac, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-500 font-light">
                          {fac}
                        </span>
                      ))}
                      {(node.facilities?.length || 0) > 3 && (
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-teal-400 font-bold">
                          +{(node.facilities?.length || 0) - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-900/60">
                    <Link
                      to={`/tour/${node.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </Link>
                    <button
                      onClick={() => handleOpenEditModal(node)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-semibold transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNode(node.id, node.name)}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: CAMPUS INFO --- */}
        {activeTab === "campus" && (
          <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <School className="w-6 h-6 text-teal-400" />
              <h2 className="text-xl font-bold text-white">Profil Kampus Utama</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nama Universitas</label>
                <input
                  type="text"
                  value={campusInfo.name}
                  onChange={(e) => handleUpdateCampusInfoField("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Slogan / Tagline</label>
                <input
                  type="text"
                  value={campusInfo.slogan}
                  onChange={(e) => handleUpdateCampusInfoField("slogan", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Deskripsi Kampus</label>
                <textarea
                  rows={4}
                  value={campusInfo.description}
                  onChange={(e) => handleUpdateCampusInfoField("description", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Stats Counters Editors */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Statistik Kampus</label>
                <div className="grid grid-cols-2 gap-4">
                  {campusInfo.stats.map((stat, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-900 bg-slate-900/10 flex flex-col gap-2">
                      <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">{stat.label}</span>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...campusInfo.stats];
                          newStats[idx].value = e.target.value;
                          handleUpdateCampusInfoField("stats", newStats);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-900 bg-slate-900/80 text-sm text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-slate-900 flex justify-end">
                <button
                  onClick={handleSaveCampusInfo}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  Simpan Profil Kampus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: MAPS MANAGEMENT --- */}
        {activeTab === "maps" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-teal-400" />
                  Manajemen Denah & Background Peta
                </h2>
                <p className="text-xs text-slate-500 font-light mt-1">
                  Unggah foto dari drone atau peta skematik kampus untuk dijadikan latar belakang MiniMap. Kelompokkan titik lokasi berdasarkan areanya.
                </p>
              </div>
              <button
                onClick={handleAddMap}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all shadow-lg text-xs"
              >
                <Plus className="w-4 h-4" />
                Tambah Denah Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {((campusInfo as any).maps || []).map((map: any) => {
                const mapNodes = nodes.filter(n => (n.mapId || "kampus-utama") === map.id);

                return (
                  <div key={map.id} className="p-6 rounded-2xl border border-slate-900 bg-slate-950/80 flex flex-col justify-between gap-5 relative overflow-hidden group shadow-xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="space-y-4">
                      {/* Title & Delete Icon */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 uppercase tracking-widest">
                            ID: {map.id}
                          </span>
                          <input
                            type="text"
                            value={map.name}
                            onChange={(e) => handleUpdateMapField(map.id, "name", e.target.value)}
                            className="bg-transparent text-lg font-bold text-white focus:outline-none focus:border-b border-teal-400 pb-0.5 w-full mt-1.5"
                            placeholder="Nama Denah Kampus"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveMap(map.id)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          title="Hapus Denah"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Map Image Upload & Preview */}
                      <div className="relative h-40 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden flex items-center justify-center bg-cover bg-center shadow-inner group-hover:border-slate-700 transition-all">
                        {map.imageUrl ? (
                          <>
                            <img src={map.imageUrl} alt={map.name} className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none" />
                            <div className="absolute inset-0 bg-slate-950/40" />
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <Map className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                            <p className="text-[10px] text-slate-500">Belum ada foto latar belakang peta.</p>
                            <p className="text-[9px] text-teal-500/70 font-light mt-0.5">Menggunakan visual grid default.</p>
                          </div>
                        )}

                        <label className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-teal-400 font-bold tracking-wider uppercase hover:bg-slate-900 cursor-pointer shadow-lg z-10">
                          Unggah Background
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMapBackgroundUpload(e, map.id)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Deskripsi / Detail Denah</label>
                        <textarea
                          rows={2}
                          value={map.description || ""}
                          onChange={(e) => handleUpdateMapField(map.id, "description", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-900 bg-slate-900/30 text-xs text-slate-300 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                          placeholder="Deskripsi singkat denah kampus ini..."
                        />
                      </div>
                    </div>

                    <div className="pt-3.5 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500">
                      <span>Titik terhubung: <b className="text-slate-300">{mapNodes.length} Lokasi</b></span>
                      <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400">
                        {map.imageUrl ? "Custom Photo" : "Neon Grid Mode"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save All Maps State Button */}
            <div className="pt-6 border-t border-slate-900 flex justify-end">
              <button
                onClick={handleSaveCampusInfo}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <Save className="w-4 h-4" />
                Simpan Konfigurasi Denah
              </button>
            </div>
          </div>
        )}
      </main>

      {/* --- FORM MODAL: ADD / EDIT LOCATION --- */}
      {isModalOpen && editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl h-[85vh] flex flex-col justify-between rounded-3xl border border-slate-900 bg-slate-950 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {nodes.some((n) => n.id === editingNode.id) ? "Edit Detail Lokasi" : "Tambah Lokasi Panorama Baru"}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-light mt-0.5">Lengkapi formulir di bawah ini untuk disimpan langsung ke database tur.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Core Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">ID Lokasi (Slug Unik)</label>
                    <input
                      type="text"
                      disabled={nodes.some((n) => n.id === editingNode.id)}
                      placeholder="contoh: perpustakaan-pusat"
                      value={editingNode.id || ""}
                      onChange={(e) => setEditingNode({ ...editingNode, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Nama Lokasi</label>
                    <input
                      type="text"
                      placeholder="contoh: Gedung Rektorat & Lobby"
                      value={editingNode.name || ""}
                      onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Kategori Lokasi</label>
                    <select
                      value={editingNode.category || "Area Outdoor"}
                      onChange={(e) => setEditingNode({ ...editingNode, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                    >
                      <option value="Area Outdoor">Area Outdoor</option>
                      <option value="Gedung Utama">Gedung Utama</option>
                      <option value="Perpustakaan">Perpustakaan</option>
                      <option value="Laboratorium">Laboratorium</option>
                      <option value="Fasilitas Umum">Fasilitas Umum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Denah Peta (Lokasi Kampus / Zona)</label>
                    <select
                      value={editingNode.mapId || "kampus-utama"}
                      onChange={(e) => setEditingNode({ ...editingNode, mapId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                    >
                      {((campusInfo as any).maps || []).map((m: any) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Deskripsi Lokasi</label>
                    <textarea
                      rows={3}
                      placeholder="Berikan penjelasan singkat mengenai fungsi atau keunikan dari lokasi ini..."
                      value={editingNode.description || ""}
                      onChange={(e) => setEditingNode({ ...editingNode, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Column 2: Media & Coordinates */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex justify-between items-center">
                      <span>Gambar Panorama 360° (Equirectangular)</span>
                      <span className="text-[9px] text-teal-400 font-bold lowercase">Bisa URL atau Upload berkas</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://... atau upload file fisik"
                        value={editingNode.panoramaUrl || ""}
                        onChange={(e) => setEditingNode({ ...editingNode, panoramaUrl: e.target.value })}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      />
                      <label className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer select-none transition-colors">
                        <Upload className="w-3.5 h-3.5 text-teal-400" />
                        Unggah
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "panorama")}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex justify-between items-center">
                      <span>Gambar Miniatur (Thumbnail)</span>
                      <span className="text-[9px] text-teal-400 font-bold lowercase">Bisa URL atau Upload berkas</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://... atau upload file fisik"
                        value={editingNode.thumbnailUrl || ""}
                        onChange={(e) => setEditingNode({ ...editingNode, thumbnailUrl: e.target.value })}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      />
                      <label className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer select-none transition-colors">
                        <Upload className="w-3.5 h-3.5 text-teal-400" />
                        Unggah
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "thumbnail")}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Latency Coordinates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Default Yaw (Rad)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingNode.defaultYaw ?? 0}
                        onChange={(e) => setEditingNode({ ...editingNode, defaultYaw: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Default Pitch (Rad)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingNode.defaultPitch ?? 0}
                        onChange={(e) => setEditingNode({ ...editingNode, defaultPitch: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  {/* Interactive Visual Map Editor */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 flex justify-between items-center">
                      <span>Visual Map Placement (Klik untuk Mengubah)</span>
                      <span className="text-[9px] text-teal-400 font-bold lowercase">Klik/tunjuk pada grid untuk memposisikan titik</span>
                    </label>
                    
                    <div 
                      className="relative h-48 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden cursor-crosshair shadow-inner select-none flex items-center justify-center bg-cover bg-center"
                      style={{ 
                        backgroundImage: (() => {
                          const currentMapId = editingNode.mapId || "kampus-utama";
                          const selectedMap = ((campusInfo as any).maps || []).find((m: any) => m.id === currentMapId) || ((campusInfo as any).maps || [])[0];
                          return selectedMap?.imageUrl ? `url(${selectedMap.imageUrl})` : 'none';
                        })()
                      }}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                        const clampedX = Math.max(0, Math.min(100, x));
                        const clampedY = Math.max(0, Math.min(100, y));
                        
                        setEditingNode({
                          ...editingNode,
                          mapPosition: {
                            ...editingNode.mapPosition,
                            x: clampedX,
                            y: clampedY,
                            shape: editingNode.mapPosition?.shape || 'circle',
                            color: editingNode.mapPosition?.color || '#14b8a6'
                          }
                        });
                      }}
                    >
                      {/* Dark overlay for contrast */}
                      {(() => {
                        const currentMapId = editingNode.mapId || "kampus-utama";
                        const selectedMap = ((campusInfo as any).maps || []).find((m: any) => m.id === currentMapId) || ((campusInfo as any).maps || [])[0];
                        return selectedMap?.imageUrl ? <div className="absolute inset-0 bg-slate-950/45 pointer-events-none z-0" /> : null;
                      })()}

                      {/* Grid Overlay Pattern */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-10">
                        <defs>
                          <pattern id="adminMapGrid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(20, 184, 166, 0.15)" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#adminMapGrid)" />
                        
                        {/* Dynamic lines between other nodes in the same zone */}
                        {nodes.map(nodeA => {
                          const posA = nodeA.mapPosition || { x: 50, y: 50 };
                          const nodeAMapId = nodeA.mapId || "kampus-utama";
                          const currentMapId = editingNode.mapId || "kampus-utama";
                          
                          if (nodeAMapId !== currentMapId) return null;
                          
                          return nodeA.navigationHotspots?.map((hs, index) => {
                            const nodeB = nodes.find(n => n.id === hs.targetNodeId);
                            if (nodeB && (nodeB.mapId || "kampus-utama") === currentMapId && nodeA.id !== editingNode.id && nodeB.id !== editingNode.id) {
                              const posB = nodeB.mapPosition || { x: 50, y: 50 };
                              return (
                                <line
                                  key={`${nodeA.id}-${nodeB.id}-${index}`}
                                  x1={`${posA.x}%`}
                                  y1={`${posA.y}%`}
                                  x2={`${posB.x}%`}
                                  y2={`${posB.y}%`}
                                  stroke="rgba(71, 85, 105, 0.4)"
                                  strokeWidth="1"
                                  strokeDasharray="2 2"
                                />
                              );
                            }
                            return null;
                          });
                        })}
                      </svg>

                      {/* Render Other Nodes in the same zone as Static Hints */}
                      {nodes
                        .filter((n) => n.id !== editingNode.id && (n.mapId || "kampus-utama") === (editingNode.mapId || "kampus-utama"))
                        .map((node) => {
                          const pos = node.mapPosition || { x: 50, y: 50 };
                          const shape = node.mapPosition?.shape || 'circle';
                          const color = node.mapPosition?.color || '#475569';
                          
                          return (
                            <div
                              key={node.id}
                              className="absolute -translate-x-1/2 -translate-y-1/2 opacity-35 pointer-events-none z-10"
                              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                            >
                              {shape === 'square' && <div className="w-2.5 h-2.5 rounded-sm border border-slate-950" style={{ backgroundColor: color }} />}
                              {shape === 'triangle' && <div className="w-2.5 h-2.5 border border-slate-950" style={{ backgroundColor: color, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />}
                              {shape === 'diamond' && <div className="w-2 h-2 rotate-45 border border-slate-950" style={{ backgroundColor: color }} />}
                              {shape === 'circle' && <div className="w-2.5 h-2.5 rounded-full border border-slate-950" style={{ backgroundColor: color }} />}
                            </div>
                          );
                        })}

                      {/* Render Current Editing Node (Glowing Marker) */}
                      {(() => {
                        const pos = editingNode.mapPosition || { x: 50, y: 50 };
                        const shape = editingNode.mapPosition?.shape || 'circle';
                        const color = editingNode.mapPosition?.color || '#14b8a6';
                        
                        return (
                          <div
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center pointer-events-none"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                          >
                            <span 
                              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                              style={{ backgroundColor: color }}
                            />
                            <div className="relative flex items-center justify-center scale-110 shadow-lg shadow-black/80">
                              {shape === 'square' && <div className="w-3.5 h-3.5 rounded-sm border border-white" style={{ backgroundColor: color }} />}
                              {shape === 'triangle' && <div className="w-3.5 h-3.5 border border-white" style={{ backgroundColor: color, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />}
                              {shape === 'diamond' && <div className="w-3 h-3 rotate-45 border border-white" style={{ backgroundColor: color }} />}
                              {shape === 'circle' && <div className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: color }} />}
                            </div>
                          </div>
                        );
                      })()}
                      
                      {/* Visual Marker Label */}
                      <div className="absolute top-2 right-3 text-[8px] bg-slate-900/80 px-2 py-0.5 border border-slate-800 rounded font-mono text-teal-400 select-none uppercase tracking-wider z-20">
                        X: {editingNode.mapPosition?.x ?? 50}% | Y: {editingNode.mapPosition?.y ?? 50}%
                      </div>
                    </div>
                  </div>

                  {/* Shape & Color settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Bentuk Marker Denah</label>
                      <select
                        value={editingNode.mapPosition?.shape || "circle"}
                        onChange={(e) => setEditingNode({
                          ...editingNode,
                          mapPosition: {
                            ...editingNode.mapPosition,
                            x: editingNode.mapPosition?.x ?? 50,
                            y: editingNode.mapPosition?.y ?? 50,
                            shape: e.target.value as any
                          }
                        })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      >
                        <option value="circle">● Lingkaran (Circle)</option>
                        <option value="square">■ Kotak (Square)</option>
                        <option value="triangle">▲ Segitiga (Triangle)</option>
                        <option value="diamond">◆ Wajik (Diamond)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Warna Marker Denah</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={editingNode.mapPosition?.color || "#14b8a6"}
                          onChange={(e) => setEditingNode({
                            ...editingNode,
                            mapPosition: {
                              ...editingNode.mapPosition,
                              x: editingNode.mapPosition?.x ?? 50,
                              y: editingNode.mapPosition?.y ?? 50,
                              color: e.target.value
                            }
                          })}
                          className="w-12 h-[38px] p-1.5 rounded-xl border border-slate-900 bg-slate-900/40 cursor-pointer"
                        />
                        <select
                          value={editingNode.mapPosition?.color || "#14b8a6"}
                          onChange={(e) => setEditingNode({
                            ...editingNode,
                            mapPosition: {
                              ...editingNode.mapPosition,
                              x: editingNode.mapPosition?.x ?? 50,
                              y: editingNode.mapPosition?.y ?? 50,
                              color: e.target.value
                            }
                          })}
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                        >
                          <option value="#14b8a6">Teal (Cyber)</option>
                          <option value="#ec4899">Cyber Pink</option>
                          <option value="#3b82f6">Electric Blue</option>
                          <option value="#8b5cf6">Bright Violet</option>
                          <option value="#f97316">Sun Orange</option>
                          <option value="#eab308">Neon Yellow</option>
                          <option value="#ef4444">Retro Red</option>
                          <option value="#22c55e">Acid Green</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Fine-Tuning Coordinates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Fine-Tuning Posisi X (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingNode.mapPosition?.x ?? 50}
                        onChange={(e) => setEditingNode({
                          ...editingNode,
                          mapPosition: {
                            ...editingNode.mapPosition,
                            x: parseInt(e.target.value) || 0,
                            y: editingNode.mapPosition?.y ?? 50
                          }
                        })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Fine-Tuning Posisi Y (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingNode.mapPosition?.y ?? 50}
                        onChange={(e) => setEditingNode({
                          ...editingNode,
                          mapPosition: {
                            ...editingNode.mapPosition,
                            x: editingNode.mapPosition?.x ?? 50,
                            y: parseInt(e.target.value) || 0
                          }
                        })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Facilities tags editor */}
              <div className="pt-6 border-t border-slate-900">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Peralatan & Fasilitas di Lokasi</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editingNode.facilities?.map((fac, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-400 font-semibold">
                      {fac}
                      <button type="button" onClick={() => handleRemoveFacility(fac)} className="hover:text-red-400 font-extrabold text-sm ml-1">&times;</button>
                    </span>
                  ))}
                  {(editingNode.facilities?.length || 0) === 0 && (
                    <span className="text-xs text-slate-500 italic">Belum ada fasilitas yang ditambahkan.</span>
                  )}
                </div>
                <div className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    placeholder="tambah fasilitas baru..."
                    value={facilityInput}
                    onChange={(e) => setFacilityInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFacility())}
                    className="flex-1 px-4 py-1.5 rounded-xl border border-slate-900 bg-slate-900/40 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-900 bg-slate-950/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveNode}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
