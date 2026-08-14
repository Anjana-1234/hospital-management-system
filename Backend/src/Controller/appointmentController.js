import Appointment from "../Module/Appointment.js"

export const bookAppointmentController = async (req, res) => {
  try {
    const { doctorId, patientId, appointmentDate, timeSlot, reason } = req.body

    // Check karo — same doctor, same date, same slot already booked toh nahi
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
    const appointments = await Appointment.find()
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
    const { status } = req.body

    // Sirf valid status hi allow karo
    const validStatus = ["pending", "confirmed", "completed", "cancelled"]
    if (!validStatus.includes(status)) {
      return res.json({
        success: false,
        code: 400,
        message: "Invalid status",
        data: null,
        error: true,
      })
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!appointment) {
      return res.json({
        success: false,
        code: 404,
        message: "Appointment not found",
        data: null,
        error: true,
      })
    }

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

    // Completed appointment cancel nahi ho sakti
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