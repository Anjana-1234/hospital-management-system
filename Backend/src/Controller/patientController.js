import Patient from "../Module/Patient.js"
import User from "../Module/User.js"
import bcrypt from "bcrypt"

export const addPatientController = async (req, res) => {
  try {
    const { name, email, password, age, gender, bloodGroup, phone, address } = req.body

    const isExist = await User.findOne({ email })
    if (isExist) {
      return res.json({
        success: false,
        code: 400,
        message: "Email already exist",
        data: null,
        error: true,
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashedPassword, role: "patient" })
    const savedUser = await user.save()

    const patient = new Patient({
      userId: savedUser._id,
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
      data: { user: savedUser, patient: savedPatient },
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
    const patients = await Patient.find().populate("userId", "-password")
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
    const patient = await Patient.findById(req.params.id).populate("userId", "-password")
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
    ).populate("userId", "-password")

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
    await User.findByIdAndDelete(patient.userId)

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