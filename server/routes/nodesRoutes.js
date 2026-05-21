import express from "express";
import {
  getAllNodes,
  getNodeById,
  createNode,
  updateNode,
  deleteNode
} from "../controllers/nodesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getAllNodes)
  .post(protect, createNode); // Protected with JWT middleware

router.route("/:id")
  .get(getNodeById)
  .put(protect, updateNode) // Protected with JWT middleware
  .delete(protect, deleteNode); // Protected with JWT middleware

export default router;
