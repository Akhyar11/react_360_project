import CampusInfo from "../models/CampusInfo.js";

// Helper to safely parse JSON fields of campus info
const parseCampusInfo = (info) => {
  const infoJson = info.toJSON();
  const fields = ["stats", "quickTips"];
  fields.forEach((field) => {
    if (typeof infoJson[field] === "string") {
      try {
        infoJson[field] = JSON.parse(infoJson[field]);
      } catch (e) {
        console.error(`Gagal mengurai kolom JSON '${field}':`, e);
      }
    }
  });
  return infoJson;
};

// GET: Campus Info
export const getCampusInfo = async (req, res) => {
  try {
    const info = await CampusInfo.findOne();
    if (!info) {
      return res.status(404).json({ error: "Profil kampus tidak ditemukan." });
    }
    
    // Parse JSON columns cleanly to prevent React rendering TypeError
    res.json(parseCampusInfo(info));
  } catch (error) {
    console.error("Gagal mengambil profil kampus dari MySQL:", error);
    res.status(500).json({ error: "Gagal mengambil data dari database MySQL." });
  }
};

// PUT: Update Campus Info
export const updateCampusInfo = async (req, res) => {
  const updatedInfo = req.body;
  if (!updatedInfo.name || !updatedInfo.slogan) {
    return res.status(400).json({ error: "Nama dan Slogan wajib diisi." });
  }

  try {
    let info = await CampusInfo.findOne();
    if (!info) {
      info = await CampusInfo.create(updatedInfo);
    } else {
      await info.update(updatedInfo);
    }
    res.json(parseCampusInfo(info));
  } catch (error) {
    console.error("Gagal memperbarui profil kampus di MySQL:", error);
    res.status(500).json({ error: "Gagal memperbarui data di database MySQL." });
  }
};
