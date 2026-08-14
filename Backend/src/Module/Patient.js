import mongoose from "mongoose"

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  medicalHistory: [
    {
      condition: String,
      diagnosedAt: Date,
      notes: String
    }
  ]
}, { timestamps: true })

const Patient = mongoose.model("Patient", patientSchema)
export default Patient