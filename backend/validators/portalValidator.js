import { createCustomerSchema } from "./customerValidator.js";

// Reuse only the phone rule from the customer schema
export const portalLookupSchema = createCustomerSchema.pick({ phone: true });