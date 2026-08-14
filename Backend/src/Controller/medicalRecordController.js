import MedicalRecord from "../Module/MedicalRecord.js"

export const addMedicalRecordController = async (req, res) => {
  try {
    const { patientId, diagnosis, prescriptionNotes, treatmentNotes } = req.body

    const record = new MedicalRecord({
      patientId,
      doctorId: req.user.id,
      diagnosis,
      prescriptionNotes,
      treatmentNotes
    })
    const result = await record.save()

    return res.json({
      success: true,
      code: 201,
      message: "Medical record added successfully",
      data: result,
      error: false,
    })

  } catch (err) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: err.message,
      error: true,
    })
  }
}

export const getPatientHistoryController = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId })
      .populate("doctorId", "-password")
      .sort({ date: -1 })

    return res.json({
      success: true,
      code: 200,
      message: "Patient history fetched successfully",
      data: records,
      error: false,
    })
  } catch (err) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: err.message,
      error: true,
    })
  }
}

export const getMyRecordsController = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ doctorId: req.user.id })
      .populate("patientId")
      .sort({ date: -1 })

    return res.json({
      success: true,
      code: 200,
      message: "Medical records fetched successfully",
      data: records,
      error: false,
    })
  } catch (err) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: err.message,
      error: true,
    })
  }
}
