import express from "express";
import { getCampusInfo, updateCampusInfo } from "../controllers/campusController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getCampusInfo)
  .put(protect, updateCampusInfo); // Protected with JWT middleware

export default router;
