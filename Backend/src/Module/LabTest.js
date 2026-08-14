import mongoose from "mongoose"

const labTestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  testType: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["requested", "collected", "completed"],
    default: "requested"
  },
  result: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

const LabTest = mongoose.model("LabTest", labTestSchema)
export default LabTest
