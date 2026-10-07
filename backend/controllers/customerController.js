import Customer from "../models/Customer.js";

// @desc    Create a customer
// @route   POST /api/customers
export const createCustomer = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    const customer = await Customer.create({ name, phone, address });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers (optional: ?phone=9000000000)
// @route   GET /api/customers
export const getCustomers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.phone) {
      filter.phone = req.query.phone;
    }

    const customers = await Customer.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get one customer
// @route   GET /api/customers/:id
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    customer.name = req.body.name ?? customer.name;
    customer.phone = req.body.phone ?? customer.phone;
    customer.address = req.body.address ?? customer.address;

    const updatedCustomer = await customer.save();

    res.json({
      success: true,
      message: "Customer updated successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    next(error);
  }
};