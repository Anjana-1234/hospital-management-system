import Appointment from "../Module/Appointment.js"
import Doctor from "../Module/Doctor.js"

export const bookAppointmentController = async (req, res) => {
  try {
    const { doctorId, patientId, appointmentDate, timeSlot, reason } = req.body

    // Check that the same doctor isn't already booked for this date/slot
    const isExist = await Appointment.findOne({ doctorId, appointmentDate, timeSlot })
    if (isExist) {
      return res.json({
        success: false,
        code: 400,
        message: "This slot is already booked",
        data: null,
        error: true,
      })
    }

    const appointment = new Appointment({
      doctorId,
      patientId,
      appointmentDate,
      timeSlot,
      reason
    })
    const result = await appointment.save()

    return res.json({
      success: true,
      code: 201,
      message: "Appointment booked successfully",
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

export const getAllAppointmentsController = async (req, res) => {
  try {
    const filter = {}

    // Doctor can only view their own appointments
    if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id })
      if (!doctorProfile) {
        return res.json({
          success: true,
          code: 200,
          message: "Appointments fetched successfully",
          data: [],
          error: false,
        })
      }
      filter.doctorId = doctorProfile._id
    }

    const appointments = await Appointment.find(filter)
      .populate("doctorId")
      .populate("patientId")

    return res.json({
      success: true,
      code: 200,
      message: "Appointments fetched successfully",
      data: appointments,
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

export const getAppointmentByIdController = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctorId")
      .populate("patientId")

    if (!appointment) {
      return res.json({
        success: false,
        code: 404,
        message: "Appointment not found",
        data: null,
        error: true,
      })
    }

    // Doctor can only view their own appointment
    if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id })
      if (!doctorProfile || appointment.doctorId?._id.toString() !== doctorProfile._id.toString()) {
        return res.json({
          success: false,
          code: 403,
          message: "You are not authorized to view this appointment",
          data: null,
          error: true,
        })
      }
    }

    return res.json({
      success: true,
      code: 200,
      message: "Appointment fetched successfully",
      data: appointment,
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


export const updateAppointmentStatusController = async (req, res) => {
  try {
    const { status, appointmentDate, timeSlot } = req.body

    // Status is optional — only validate if provided (reschedule doesn't include status)
    const validStatus = ["pending", "confirmed", "completed", "cancelled"]
    if (status !== undefined && !validStatus.includes(status)) {
      return res.json({
        success: false,
        code: 400,
        message: "Invalid status",
        data: null,
        error: true,
      })
    }

    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.json({
        success: false,
        code: 404,
        message: "Appointment not found",
        data: null,
        error: true,
      })
    }

    // Doctor can only update their own appointment
    if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id })
      if (!doctorProfile || appointment.doctorId.toString() !== doctorProfile._id.toString()) {
        return res.json({
          success: false,
          code: 403,
          message: "You are not authorized to update this appointment",
          data: null,
          error: true,
        })
      }
    }

    // A completed appointment cannot be rescheduled
    if (appointment.status === "completed" && (appointmentDate || timeSlot)) {
      return res.json({
        success: false,
        code: 400,
        message: "Completed appointment cannot be rescheduled",
        data: null,
        error: true,
      })
    }

    if (status !== undefined) appointment.status = status
    if (appointmentDate !== undefined) appointment.appointmentDate = appointmentDate
    if (timeSlot !== undefined) appointment.timeSlot = timeSlot

    await appointment.save()

    return res.json({
      success: true,
      code: 200,
      message: "Appointment status updated successfully",
      data: appointment,
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

export const cancelAppointmentController = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.json({
        success: false,
        code: 404,
        message: "Appointment not found",
        data: null,
        error: true,
      })
    }

    // Doctor can only cancel their own appointment
    if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id })
      if (!doctorProfile || appointment.doctorId.toString() !== doctorProfile._id.toString()) {
        return res.json({
          success: false,
          code: 403,
          message: "You are not authorized to cancel this appointment",
          data: null,
          error: true,
        })
      }
    }

    // A completed appointment cannot be cancelled
    if (appointment.status === "completed") {
      return res.json({
        success: false,
        code: 400,
        message: "Completed appointment cannot be cancelled",
        data: null,
        error: true,
      })
    }

    appointment.status = "cancelled"
    await appointment.save()

    return res.json({
      success: true,
      code: 200,
      message: "Appointment cancelled successfully",
      data: appointment,
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