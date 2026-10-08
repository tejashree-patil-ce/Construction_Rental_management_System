import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { validate } from "../middleware/validate.js";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../validators/customerValidator.js";

const router = express.Router();

router
  .route("/")
  .get(getCustomers)
  .post(validate(createCustomerSchema), createCustomer);

router
  .route("/:id")
  .get(getCustomerById)
  .put(validate(updateCustomerSchema), updateCustomer)
  .delete(deleteCustomer);

export default router;