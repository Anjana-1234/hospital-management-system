import mongoose from "mongoose"

const billSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment"
  },
  items: [
    {
      description: { type: String, required: true }, // e.g. "Consultation", "X-Ray", "Blood Test"
      amount:      { type: Number, required: true }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending"
  },
  paidAt: {
    type: Date
  },
  // Basic invoice fields — filled in by receptionist at booking time, lab/pharmacy
  // fees get added later by those roles as charges occur
  consultationFee: {
    type: Number,
    default: 0
  },
  labFee: {
    type: Number,
    default: 0
  },
  pharmacyFee: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "cancelled"],
    default: "unpaid"
  }
}, { timestamps: true })

const Bill = mongoose.model("Bill", billSchema)
export default Bill