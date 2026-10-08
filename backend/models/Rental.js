import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: [true, "Material is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
    dailyRate: {
      type: Number,
      required: true,
      min: [0, "Daily rate cannot be negative"],
    },
    status: {
      type: String,
      enum: ["active", "returned"],
      default: "active",
    },
    billedDays: { type: Number },
    totalAmount: { type: Number },
  },
  { timestamps: true }
);

const Rental = mongoose.model("Rental", rentalSchema);

export default Rental;