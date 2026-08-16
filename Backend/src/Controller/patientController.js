import Patient from "../Module/Patient.js"

export const addPatientController = async (req, res) => {
  try {
    const { name, email, age, gender, bloodGroup, phone, address } = req.body

    const isExist = await Patient.findOne({ email })
    if (isExist) {
      return res.json({
        success: false,
        code: 400,
        message: "Email already exist",
        data: null,
        error: true,
      })
    }

    const patient = new Patient({
      name,
      email,
      age,
      gender,
      bloodGroup,
      phone,
      address
    })
    const savedPatient = await patient.save()

    return res.json({
      success: true,
      code: 201,
      message: "Patient added successfully",
      data: savedPatient,
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

export const getAllPatientsController = async (req, res) => {
  try {
    const { search } = req.query

    // If a search query is provided, filter by name/email/phone
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } }
          ]
        }
      : {}

    const patients = await Patient.find(filter)
    return res.json({
      success: true,
      code: 200,
      message: "Patients fetched successfully",
      data: patients,
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

export const getPatientByIdController = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
    if (!patient) {
      return res.json({
        success: false,
        code: 404,
        message: "Patient not found",
        data: null,
        error: true,
      })
    }
    return res.json({
      success: true,
      code: 200,
      message: "Patient fetched successfully",
      data: patient,
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

export const updatePatientController = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!patient) {
      return res.json({
        success: false,
        code: 404,
        message: "Patient not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Patient updated successfully",
      data: patient,
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

export const deletePatientController = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
    if (!patient) {
      return res.json({
        success: false,
        code: 404,
        message: "Patient not found",
        data: null,
        error: true,
      })
    }

    await Patient.findByIdAndDelete(req.params.id)

    return res.json({
      success: true,
      code: 200,
      message: "Patient deleted successfully",
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