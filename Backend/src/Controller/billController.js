import Bill from "../Module/Bill.js"

export const addBillController = async (req, res) => {
  try {
    const { patientId, appointmentId, items } = req.body

    // Total automatically calculate karo
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

    const bill = new Bill({
      patientId,
      appointmentId,
      items,
      totalAmount
    })
    const result = await bill.save()

    return res.json({
      success: true,
      code: 201,
      message: "Bill added successfully",
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

export const getAllBillsController = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("patientId")
      .populate("appointmentId")

    return res.json({
      success: true,
      code: 200,
      message: "Bills fetched successfully",
      data: bills,
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

export const getBillByPatientController = async (req, res) => {
  try {
    const bills = await Bill.find({ patientId: req.params.patientId })
      .populate("appointmentId")

    if (!bills.length) {
      return res.json({
        success: false,
        code: 404,
        message: "No bills found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Bills fetched successfully",
      data: bills,
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


export const updateBillStatusController = async (req, res) => {
  try {
    const { status } = req.body

    const validStatus = ["pending", "paid", "cancelled"]
    if (!validStatus.includes(status)) {
      return res.json({
        success: false,
        code: 400,
        message: "Invalid status",
        data: null,
        error: true,
      })
    }

    const updateData = { status }

    // Agar paid kiya toh paidAt date bhi save karo
    if (status === "paid") {
      updateData.paidAt = new Date()
    }

    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    if (!bill) {
      return res.json({
        success: false,
        code: 404,
        message: "Bill not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Bill status updated successfully",
      data: bill,
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


export const deleteBillController = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id)

    if (!bill) {
      return res.json({
        success: false,
        code: 404,
        message: "Bill not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Bill deleted successfully",
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