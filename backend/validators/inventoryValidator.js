import { z } from "zod";

const quantity = (label) =>
  z
    .number({
      required_error: `${label} is required`,
      invalid_type_error: `${label} must be a number`,
    })
    .int(`${label} must be a whole number`)
    .min(0, `${label} cannot be negative`);

export const createMaterialSchema = z.object({
  materialName: z
    .string({ required_error: "Material name is required" })
    .trim()
    .min(2, "Material name must be at least 2 characters"),
  totalQuantity: quantity("Total quantity"),
  dailyRate: z
    .number({
      required_error: "Daily rate is required",
      invalid_type_error: "Daily rate must be a number",
    })
    .min(0, "Daily rate cannot be negative"),
});

export const updateMaterialSchema = createMaterialSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });