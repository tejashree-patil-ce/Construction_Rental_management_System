import express from "express";
import {
  createMaterial,
  getInventory,
  getMaterialById,
  updateMaterial,
} from "../controllers/inventoryController.js";
import { validate } from "../middleware/validate.js";
import {
  createMaterialSchema,
  updateMaterialSchema,
} from "../validators/inventoryValidator.js";

const router = express.Router();

router
  .route("/")
  .get(getInventory)
  .post(validate(createMaterialSchema), createMaterial);

router
  .route("/:id")
  .get(getMaterialById)
  .put(validate(updateMaterialSchema), updateMaterial);

export default router;