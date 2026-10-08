import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);

    const exists = await User.findOne({ email: ADMIN_EMAIL });

    if (exists) {
      console.log("Admin already exists:", ADMIN_EMAIL);
    } else {
      await User.create({
        name: ADMIN_NAME || "Admin",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });
      console.log("Admin created:", ADMIN_EMAIL);
    }
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();