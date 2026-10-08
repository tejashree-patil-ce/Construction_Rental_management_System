import Inventory from "../models/Inventory.js";

// @desc    Add a material
// @route   POST /api/inventory
export const createMaterial = async (req, res, next) => {
  try {
    const { materialName, totalQuantity, dailyRate } = req.body;

    // New stock starts fully available, so we set this ourselves
    const material = await Inventory.create({
      materialName,
      totalQuantity,
      availableQuantity: totalQuantity,
      dailyRate,
    });

    res.status(201).json({
      success: true,
      message: "Material added successfully",
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all materials
// @route   GET /api/inventory
export const getInventory = async (req, res, next) => {
  try {
    const materials = await Inventory.find().sort({ materialName: 1 });

    res.json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get one material
// @route   GET /api/inventory/:id
export const getMaterialById = async (req, res, next) => {
  try {
    const material = await Inventory.findById(req.params.id);

    if (!material) {
      res.status(404);
      throw new Error("Material not found");
    }

    res.json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

// @desc    Update name, total stock or daily rate
// @route   PUT /api/inventory/:id
export const updateMaterial = async (req, res, next) => {
  try {
    const material = await Inventory.findById(req.params.id);

    if (!material) {
      res.status(404);
      throw new Error("Material not found");
    }

    const { materialName, totalQuantity, dailyRate } = req.body;

    if (totalQuantity !== undefined) {
      const rented = material.totalQuantity - material.availableQuantity;

      if (totalQuantity < rented) {
        res.status(400);
        throw new Error(
          `Total quantity cannot be less than currently rented quantity (${rented})`
        );
      }

      // Keep the rented count the same, move only the free stock
      material.availableQuantity = totalQuantity - rented;
      material.totalQuantity = totalQuantity;
    }

    if (materialName !== undefined) material.materialName = materialName;
    if (dailyRate !== undefined) material.dailyRate = dailyRate;

    const updated = await material.save();

    res.json({
      success: true,
      message: "Material updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};