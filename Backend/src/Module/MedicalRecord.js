import mongoose from "mongoose"

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  diagnosis: {
    type: String,
    trim: true
  },
  prescriptionNotes: {
    type: String
  },
  treatmentNotes: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema)
export default MedicalRecord
