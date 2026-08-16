import PatientNote from "../Module/PatientNote.js"
import { requireFields } from "../utils/validateFields.js"

export const addPatientNoteController = async (req, res) => {
  try {
    if (requireFields(req, res, ["patientId", "note"])) return;

    const { patientId, note } = req.body

    const patientNote = new PatientNote({
      patientId,
      addedBy: req.user.id,
      note
    })
    const result = await patientNote.save()

    return res.json({
      success: true,
      code: 201,
      message: "Note added successfully",
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

export const getPatientNotesController = async (req, res) => {
  try {
    const notes = await PatientNote.find({ patientId: req.params.patientId })
      .populate("addedBy", "-password")
      .sort({ date: -1 })

    return res.json({
      success: true,
      code: 200,
      message: "Patient notes fetched successfully",
      data: notes,
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
