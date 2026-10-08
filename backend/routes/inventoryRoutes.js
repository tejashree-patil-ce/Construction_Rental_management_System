import express from "express";
import {
  createMaterial,
  getInventory,
  getMaterialById,
  updateMaterial,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.route("/").get(getInventory).post(createMaterial);
router.route("/:id").get(getMaterialById).put(updateMaterial);

export default router;