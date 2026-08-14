import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
    default: "patient"
  }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;