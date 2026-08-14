import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  qualifications: [String],
  experience: {
    type: Number,
    default: 0
  },
  consultationFee: {
    type: Number,
    required: true
  },
  availableDays: {
    type: [String],
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  availableTime: {
    start: { type: String, default: "09:00" },
    end:   { type: String, default: "17:00" }
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

const Doctor = mongoose.model("Doctor", doctorSchema)
export default Doctor