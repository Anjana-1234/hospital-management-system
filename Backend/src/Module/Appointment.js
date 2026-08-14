import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true // e.g. "10:00 - 10:30"
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending"
  },
  reason: {
    type: String,
    trim: true
  },
  notes: {
    type: String // Doctor ke notes appointment ke baad
  }
}, { timestamps: true })

const Appointment = mongoose.model("Appointment", appointmentSchema)
export default Appointment