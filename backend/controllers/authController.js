import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Admin login
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    // password has select:false, so we ask for it explicitly
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the logged-in admin's profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};