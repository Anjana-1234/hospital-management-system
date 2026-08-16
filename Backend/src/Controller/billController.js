import Bill from "../Module/Bill.js"
import { requireFields } from "../utils/validateFields.js"

export const addBillController = async (req, res) => {
  try {
    if (requireFields(req, res, ["patientId"])) return;

    const { patientId, appointmentId, items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.json({
        success: false,
        code: 400,
        message: "At least one bill item is required",
        data: null,
        error: true,
      })
    }
    const invalidIndex = items.findIndex((item) => !item.description || item.amount === undefined)
    if (invalidIndex !== -1) {
      return res.json({
        success: false,
        code: 400,
        message: `Item #${invalidIndex + 1} is missing a description or amount`,
        data: null,
        error: true,
      })
    }

    // Automatically calculate the total
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

export const createBasicInvoiceController = async (req, res) => {
  try {
    const { patientId, appointmentId, consultationFee } = req.body

    if (!patientId || consultationFee === undefined) {
      return res.json({
        success: false,
        code: 400,
        message: "patientId and consultationFee are required",
        data: null,
        error: true,
      })
    }

    const bill = new Bill({
      patientId,
      appointmentId,
      items: [{ description: "Consultation Fee", amount: consultationFee }],
      totalAmount: consultationFee,
      consultationFee,
      labFee: 0,
      pharmacyFee: 0,
      paymentStatus: "unpaid"
    })
    const result = await bill.save()

    return res.json({
      success: true,
      code: 201,
      message: "Invoice created successfully",
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

    // If marked as paid, also save the paidAt date
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