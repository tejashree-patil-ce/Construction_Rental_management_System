import mongoose from "mongoose";

const wholeNumber = {
  validator: Number.isInteger,
  message: "{PATH} must be a whole number",
};

const inventorySchema = new mongoose.Schema(
  {
    materialName: {
      type: String,
      required: [true, "Material name is required"],
      unique: true,
      trim: true,
    },
    totalQuantity: {
      type: Number,
      required: [true, "Total quantity is required"],
      min: [0, "Total quantity cannot be negative"],
      validate: wholeNumber,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: [0, "Available quantity cannot be negative"],
      validate: wholeNumber,
    },
    dailyRate: {
      type: Number,
      required: [true, "Daily rate is required"],
      min: [0, "Daily rate cannot be negative"],
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: calculated, never stored in the database
inventorySchema.virtual("rentedQuantity").get(function () {
  return this.totalQuantity - this.availableQuantity;
});

// Extra rule: available stock can never exceed total stock
inventorySchema.pre("validate", function () {
  if (this.availableQuantity > this.totalQuantity) {
    this.invalidate(
      "availableQuantity",
      "Available quantity cannot exceed total quantity"
    );
  }
});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;