import Customer from "../models/Customer.js";
import Rental from "../models/Rental.js";
import { calculateBill } from "../utils/billing.js";

// Allowlist: ONLY these fields are ever sent to the public
const toPublicRental = (rental, now) => ({
  material: rental.material?.materialName,
  quantity: rental.quantity,
  startDate: rental.startDate,
  dailyRate: rental.dailyRate,
  status: rental.status,
  billing: calculateBill({
    startDate: rental.startDate,
    endDate: now,
    quantity: rental.quantity,
    dailyRate: rental.dailyRate,
  }),
});

// @desc    Customer looks up their active rentals by phone number
// @route   POST /api/portal/rentals
// @access  Public
export const lookupRentals = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const now = new Date();

    const customer = await Customer.findOne({ phone });

    let rentals = [];
    if (customer) {
      rentals = await Rental.find({ customer: customer._id, status: "active" })
        .populate("material", "materialName")
        .sort({ startDate: 1 });
    }

    // Unknown phone and "no active rentals" look exactly the same
    const hasRentals = rentals.length > 0;

    res.json({
      success: true,
      data: {
        customerName: hasRentals ? customer.name.split(" ")[0] : null,
        serverTime: now,
        rentals: rentals.map((rental) => toPublicRental(rental, now)),
      },
    });
  } catch (error) {
    next(error);
  }
};