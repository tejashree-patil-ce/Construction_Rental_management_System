import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string({ required_error: "Customer name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  address: z.string().trim().max(250, "Address is too long").optional(),
});

// Same fields, but all optional, with at least one required
export const updateCustomerSchema = createCustomerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });