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
      duration:  { type: String }  // e.g. "7 days"
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
  }
}, { timestamps: true })

const Prescription = mongoose.model("Prescription", prescriptionSchema)
export default Prescription