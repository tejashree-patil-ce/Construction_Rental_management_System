import { z } from "zod";

const objectId = (label) =>
  z
    .string({ required_error: `${label} is required` })
    .regex(/^[a-f\d]{24}$/i, `${label} must be a valid id`);

export const createRentalSchema = z.object({
  customerId: objectId("Customer id"),
  materialId: objectId("Material id"),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  startDate: z.coerce
    .date({ invalid_type_error: "Invalid start date" })
    .refine((d) => d <= new Date(), "Start date cannot be in the future")
    .optional(),
});

export const returnRentalSchema = z.object({
  returnDate: z.coerce
    .date({ invalid_type_error: "Invalid return date" })
    .optional(),
});