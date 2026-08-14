import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "../DBConn/dbConn.js";
import User from "../Module/User.js";

// Change these before running the script
const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "admin@hospital.com";
const ADMIN_PASSWORD = "ChangeMe123!";

const createAdmin = async () => {
  await connectDB();

  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin"
    });
    await admin.save();

    console.log(`Admin created successfully — email: ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error("Error creating admin:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();
