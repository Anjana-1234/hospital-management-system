import Patient from "../Module/Patient.js"
import Appointment from "../Module/Appointment.js"
import Prescription from "../Module/Prescription.js"
import LabTest from "../Module/LabTest.js"
import Inventory from "../Module/Inventory.js"
import User from "../Module/User.js"

const buildDateFilter = (field, startDate, endDate) => {
  if (!startDate && !endDate) return {}

  const range = {}
  if (startDate) range.$gte = new Date(startDate)
  if (endDate) {
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)
    range.$lte = end
  }
  return { [field]: range }
}

export const getPatientReportController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const filter = buildDateFilter("createdAt", startDate, endDate)

    const patients = await Patient.find(filter).sort({ createdAt: -1 })

    return res.json({
      success: true,
      code: 200,
      message: "Patient report generated successfully",
      data: {
        count: patients.length,
        patients,
      },
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

export const getAppointmentReportController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const filter = buildDateFilter("appointmentDate", startDate, endDate)

    const appointments = await Appointment.find(filter)
      .populate("doctorId")
      .populate("patientId")
      .sort({ appointmentDate: -1 })

    const statusBreakdown = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    }
    appointments.forEach((appt) => {
      if (statusBreakdown[appt.status] !== undefined) statusBreakdown[appt.status]++
    })

    return res.json({
      success: true,
      code: 200,
      message: "Appointment report generated successfully",
      data: {
        count: appointments.length,
        statusBreakdown,
        appointments,
      },
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

export const getPharmacyReportController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const filter = {
      status: "dispensed",
      ...buildDateFilter("createdAt", startDate, endDate),
    }

    const dispensedPrescriptions = await Prescription.find(filter)
      .populate("patientId")
      .populate("doctorId")
      .sort({ createdAt: -1 })

    // Reuse the low-stock / expiring-soon logic from the pharmacist report
    const LOW_STOCK_THRESHOLD = 10
    const EXPIRY_WINDOW_DAYS = 30
    const expiryLimit = new Date()
    expiryLimit.setDate(expiryLimit.getDate() + EXPIRY_WINDOW_DAYS)

    const lowStockItems = await Inventory.find({
      $or: [
        { quantity: { $lte: LOW_STOCK_THRESHOLD } },
        { expiryDate: { $ne: null, $lte: expiryLimit } }
      ]
    })

    return res.json({
      success: true,
      code: 200,
      message: "Pharmacy report generated successfully",
      data: {
        dispensedCount: dispensedPrescriptions.length,
        dispensedPrescriptions,
        lowStockItems,
      },
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

export const getLabReportController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const filter = buildDateFilter("date", startDate, endDate)

    const labTests = await LabTest.find(filter)
      .populate("patientId")
      .populate("requestedBy", "-password")
      .sort({ date: -1 })

    const statusBreakdown = {
      requested: 0,
      collected: 0,
      completed: 0,
    }
    labTests.forEach((test) => {
      if (statusBreakdown[test.status] !== undefined) statusBreakdown[test.status]++
    })

    return res.json({
      success: true,
      code: 200,
      message: "Lab report generated successfully",
      data: {
        count: labTests.length,
        statusBreakdown,
        labTests,
      },
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

export const getStaffReportController = async (req, res) => {
  try {
    const users = await User.find().select("-password")

    const roleCounts = {}
    users.forEach((user) => {
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1
    })

    return res.json({
      success: true,
      code: 200,
      message: "Staff report generated successfully",
      data: {
        totalStaff: users.length,
        roleCounts,
        users,
      },
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
