import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Harap sertakan file gambar untuk diunggah!" });
  }

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.status(200).json({
    message: "Gambar berhasil diunggah secara fisik!",
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

export default router;
