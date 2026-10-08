import Rental from "../models/Rental.js";
import Customer from "../models/Customer.js";
import Inventory from "../models/Inventory.js";
import { calculateBill } from "../utils/billing.js";
import { AppError } from "../utils/AppError.js";

// Adds a "billing" object to a rental
// Active rental → bill as of NOW. Returned rental → the saved final values.
const addBilling = (rental) => {
  const data = rental.toObject();

  if (rental.status === "active") {
    data.billing = calculateBill({
      startDate: rental.startDate,
      endDate: new Date(),
      quantity: rental.quantity,
      dailyRate: rental.dailyRate,
    });
  } else {
    const { elapsedDays } = calculateBill({
      startDate: rental.startDate,
      endDate: rental.returnDate,
      quantity: rental.quantity,
      dailyRate: rental.dailyRate,
    });
    data.billing = {
      elapsedDays,
      billedDays: rental.billedDays,
      totalAmount: rental.totalAmount,
    };
  }

  return data;
};

// @desc    Start a rental
// @route   POST /api/rentals
export const createRental = async (req, res, next) => {
  try {
    // Zod already checked: valid ids, whole-number quantity >= 1,
    // and startDate is a real date that is not in the future (or missing)
    const { customerId, materialId, quantity, startDate } = req.body;
    const start = startDate ?? new Date();

    const customerExists = await Customer.exists({ _id: customerId });
    if (!customerExists) {
      res.status(404);
      throw new Error("Customer not found");
    }

    const material = await Inventory.findById(materialId);
    if (!material) {
      res.status(404);
      throw new Error("Material not found");
    }

    // Atomic: check stock AND subtract in a single database operation
    const reserved = await Inventory.findOneAndUpdate(
      { _id: materialId, availableQuantity: { $gte: quantity } },
      { $inc: { availableQuantity: -quantity } }
    );

    if (!reserved) {
      throw new AppError(
        `Insufficient stock. Only ${material.availableQuantity} available`,
        400,
        "INSUFFICIENT_STOCK"
      );
    }

    let rental;
    try {
      rental = await Rental.create({
        customer: customerId,
        material: materialId,
        quantity,
        startDate: start,
        dailyRate: reserved.dailyRate,
      });
    } catch (err) {
      // Rental could not be saved, so give the stock back
      await Inventory.updateOne(
        { _id: materialId },
        { $inc: { availableQuantity: quantity } }
      );
      throw err;
    }

    await rental.populate([
      { path: "customer", select: "name phone" },
      { path: "material", select: "materialName" },
    ]);

    res.status(201).json({
      success: true,
      message: "Rental started successfully",
      data: addBilling(rental),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List rentals (?status=active|returned, ?customer=<id>)
// @route   GET /api/rentals
export const getRentals = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.customer) filter.customer = req.query.customer;

    const rentals = await Rental.find(filter)
      .populate("customer", "name phone")
      .populate("material", "materialName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: rentals.length,
      data: rentals.map(addBilling),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List active rentals with the bill as of now
// @route   GET /api/rentals/active
export const getActiveRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find({ status: "active" })
      .populate("customer", "name phone")
      .populate("material", "materialName")
      .sort({ startDate: 1 });

    res.json({
      success: true,
      count: rentals.length,
      data: rentals.map(addBilling),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get one rental
// @route   GET /api/rentals/:id
export const getRentalById = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate("customer", "name phone address")
      .populate("material", "materialName");

    if (!rental) {
      res.status(404);
      throw new Error("Rental not found");
    }

    res.json({ success: true, data: addBilling(rental) });
  } catch (error) {
    next(error);
  }
};

// @desc    Return the material and finalize the bill
// @route   PUT /api/rentals/:id/return
export const returnRental = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      res.status(404);
      throw new Error("Rental not found");
    }

    if (rental.status !== "active") {
      throw new AppError("Rental is already returned", 400, "ALREADY_RETURNED");
    }

    // Zod already turned returnDate into a real Date (or left it missing)
    const now = new Date();
    const returnDate = req.body.returnDate ?? now;

    if (returnDate > now) {
      res.status(400);
      throw new Error("Return date cannot be in the future");
    }
    if (returnDate < rental.startDate) {
      res.status(400);
      throw new Error("Return date cannot be before the start date");
    }

    const bill = calculateBill({
      startDate: rental.startDate,
      endDate: returnDate,
      quantity: rental.quantity,
      dailyRate: rental.dailyRate,
    });

    // Only matches while still "active", so a double click can't return twice
    const updated = await Rental.findOneAndUpdate(
      { _id: rental._id, status: "active" },
      {
        status: "returned",
        returnDate,
        billedDays: bill.billedDays,
        totalAmount: bill.totalAmount,
      },
      { new: true }
    )
      .populate("customer", "name phone")
      .populate("material", "materialName");

    if (!updated) {
      throw new AppError("Rental is already returned", 400, "ALREADY_RETURNED");
    }

    // Put the plates back into stock
    await Inventory.updateOne(
      { _id: rental.material },
      { $inc: { availableQuantity: rental.quantity } }
    );

    res.json({
      success: true,
      message: "Material returned successfully",
      data: addBilling(updated),
    });
  } catch (error) {
    next(error);
  }
};