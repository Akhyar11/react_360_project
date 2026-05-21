import TourNode from "../models/TourNode.js";

// Helper to safely parse JSON columns in TourNode
const parseNodeFields = (node) => {
  const nodeJson = node.toJSON();
  const jsonFields = ["mapPosition", "facilities", "navigationHotspots", "infoHotspots"];
  jsonFields.forEach((field) => {
    if (typeof nodeJson[field] === "string") {
      try {
        nodeJson[field] = JSON.parse(nodeJson[field]);
      } catch (e) {
        console.error(`Gagal mengurai kolom JSON '${field}':`, e);
      }
    }
  });
  return nodeJson;
};

// 1. GET: All Tour Nodes
export const getAllNodes = async (req, res) => {
  try {
    const nodes = await TourNode.findAll();
    res.json(nodes.map((node) => parseNodeFields(node)));
  } catch (error) {
    console.error("Gagal mengambil daftar lokasi dari MySQL:", error);
    res.status(500).json({ error: "Gagal mengambil data dari database MySQL." });
  }
};

// 2. GET: Single Tour Node by ID
export const getNodeById = async (req, res) => {
  const { id } = req.params;
  try {
    const node = await TourNode.findByPk(id);
    if (!node) {
      return res.status(404).json({ error: "Node lokasi tidak ditemukan." });
    }
    res.json(parseNodeFields(node));
  } catch (error) {
    console.error(`Gagal mengambil lokasi '${id}' dari MySQL:`, error);
    res.status(500).json({ error: "Gagal mengambil data dari database MySQL." });
  }
};

// 3. POST: Create a New Tour Node
export const createNode = async (req, res) => {
  const newNode = req.body;
  
  if (!newNode.id || !newNode.name || !newNode.panoramaUrl) {
    return res.status(400).json({ error: "ID, Nama, dan Panorama URL wajib diisi." });
  }

  try {
    // Check if ID already exists
    const existingNode = await TourNode.findByPk(newNode.id);
    if (existingNode) {
      return res.status(400).json({ error: `Node lokasi dengan ID '${newNode.id}' sudah terdaftar.` });
    }

    // Ensure default structures
    newNode.navigationHotspots = newNode.navigationHotspots || [];
    newNode.infoHotspots = newNode.infoHotspots || [];
    newNode.facilities = newNode.facilities || [];
    newNode.mapPosition = newNode.mapPosition || { x: 50, y: 50 };

    const createdNode = await TourNode.create(newNode);
    res.status(201).json(parseNodeFields(createdNode));
  } catch (error) {
    console.error("Gagal menyimpan lokasi baru di MySQL:", error);
    res.status(500).json({ error: "Gagal menyimpan lokasi baru ke database MySQL." });
  }
};

// 4. PUT: Update an Existing Tour Node
export const updateNode = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    const node = await TourNode.findByPk(id);
    if (!node) {
      return res.status(404).json({ error: "Node lokasi tidak ditemukan." });
    }

    // Prevent ID changing on PUT
    delete updatedFields.id;

    await node.update(updatedFields);
    res.json(parseNodeFields(node));
  } catch (error) {
    console.error(`Gagal memperbarui lokasi '${id}' di MySQL:`, error);
    res.status(500).json({ error: "Gagal menyimpan perubahan lokasi ke database MySQL." });
  }
};

// 5. DELETE: Delete a Tour Node
export const deleteNode = async (req, res) => {
  const { id } = req.params;

  try {
    const node = await TourNode.findByPk(id);
    if (!node) {
      return res.status(404).json({ error: "Node lokasi tidak ditemukan." });
    }

    // Delete the node
    await node.destroy();

    // Clean up references in other nodes' navigationHotspots
    const allNodes = await TourNode.findAll();
    for (const n of allNodes) {
      let hotspots = n.navigationHotspots;
      if (typeof hotspots === "string") {
        try {
          hotspots = JSON.parse(hotspots);
        } catch (e) {
          hotspots = [];
        }
      }
      
      if (Array.isArray(hotspots) && hotspots.some((h) => h.targetNodeId === id)) {
        const filtered = hotspots.filter((h) => h.targetNodeId !== id);
        await n.update({ navigationHotspots: filtered });
      }
    }

    res.json({ message: `Node lokasi '${id}' berhasil dihapus dan referensi hotspot dibersihkan.` });
  } catch (error) {
    console.error(`Gagal menghapus lokasi '${id}' di MySQL:`, error);
    res.status(500).json({ error: "Gagal menghapus lokasi dari database MySQL." });
  }
};
