import mongoose from "mongoose"

const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true
  },
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
  medicines: [
    {
      name:      { type: String, required: true },
      dosage:    { type: String }, // e.g. "500mg"
      frequency: { type: String }, // e.g. "Twice a day"
      duration:  { type: String }, // e.g. "7 days"
      quantity:  { type: Number, default: 1 } // units to dispense from inventory
    }
  ],
  diagnosis: {
    type: String,
    trim: true
  },
  advice: {
    type: String
  },
  followUpDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ["pending", "dispensed"],
    default: "pending"
  }
}, { timestamps: true })

const Prescription = mongoose.model("Prescription", prescriptionSchema)
export default Prescription