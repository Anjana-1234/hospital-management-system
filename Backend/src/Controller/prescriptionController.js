import Prescription from "../Module/Prescription.js"

export const addPrescriptionController = async (req, res) => {
  try {
    const { appointmentId, doctorId, patientId, medicines, diagnosis, advice, followUpDate } = req.body

    const prescription = new Prescription({
      appointmentId,
      doctorId,
      patientId,
      medicines,
      diagnosis,
      advice,
      followUpDate
    })
    const result = await prescription.save()

    return res.json({
      success: true,
      code: 201,
      message: "Prescription added successfully",
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

export const getAllPrescriptionsController = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("appointmentId")
      .populate("doctorId")
      .populate("patientId")

    return res.json({
      success: true,
      code: 200,
      message: "Prescriptions fetched successfully",
      data: prescriptions,
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


export const getPrescriptionByPatientController = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.patientId })
      .populate("appointmentId")
      .populate("doctorId")

    if (!prescriptions.length) {
      return res.json({
        success: false,
        code: 404,
        message: "No prescriptions found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Prescriptions fetched successfully",
      data: prescriptions,
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

export const updatePrescriptionController = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!prescription) {
      return res.json({
        success: false,
        code: 404,
        message: "Prescription not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Prescription updated successfully",
      data: prescription,
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

export const deletePrescriptionController = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id)

    if (!prescription) {
      return res.json({
        success: false,
        code: 404,
        message: "Prescription not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Prescription deleted successfully",
      data: null,
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