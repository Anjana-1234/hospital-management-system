import Bill from "../Module/Bill.js"
import LabTest from "../Module/LabTest.js"
import Prescription from "../Module/Prescription.js"
import Inventory from "../Module/Inventory.js"
import { escapeRegex } from "../utils/escapeRegex.js"

export const getAllInvoicesController = async (req, res) => {
  try {
    const { paymentStatus } = req.query
    const filter = paymentStatus ? { paymentStatus } : {}

    const invoices = await Bill.find(filter)
      .populate("patientId")
      .populate("appointmentId")
      .sort({ createdAt: -1 })

    return res.json({
      success: true,
      code: 200,
      message: "Invoices fetched successfully",
      data: invoices,
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

export const finalizeInvoiceController = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)

    if (!bill) {
      return res.json({
        success: false,
        code: 404,
        message: "Invoice not found",
        data: null,
        error: true,
      })
    }

    // Pull in any completed lab tests for this patient not yet billed
    const labTests = await LabTest.find({
      patientId: bill.patientId,
      status: "completed",
      billed: false,
    })
    const newLabFee = labTests.reduce((sum, test) => sum + (test.fee || 0), 0)

    // Pull in any dispensed prescriptions for this patient not yet billed
    const prescriptions = await Prescription.find({
      patientId: bill.patientId,
      status: "dispensed",
      billed: false,
    })

    let newPharmacyFee = 0
    for (const prescription of prescriptions) {
      for (const med of prescription.medicines) {
        const item = await Inventory.findOne({ name: new RegExp(`^${escapeRegex(med.name.trim())}$`, "i") })
        const price = item?.unitPrice || 0
        newPharmacyFee += price * (med.quantity || 1)
      }
    }

    bill.labFee = (bill.labFee || 0) + newLabFee
    bill.pharmacyFee = (bill.pharmacyFee || 0) + newPharmacyFee
    bill.totalAmount = bill.consultationFee + bill.labFee + bill.pharmacyFee

    await bill.save()

    // Mark pulled-in charges as billed so they aren't counted again
    await LabTest.updateMany(
      { _id: { $in: labTests.map((t) => t._id) } },
      { billed: true }
    )
    await Prescription.updateMany(
      { _id: { $in: prescriptions.map((p) => p._id) } },
      { billed: true }
    )

    return res.json({
      success: true,
      code: 200,
      message: "Invoice finalized successfully",
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

export const recordPaymentController = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "paid", status: "paid", paidAt: new Date() },
      { new: true }
    )

    if (!bill) {
      return res.json({
        success: false,
        code: 404,
        message: "Invoice not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Payment recorded successfully",
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

export const getRevenueReportController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const dateFilter = {}
    if (startDate || endDate) {
      dateFilter.createdAt = {}
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate)
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        dateFilter.createdAt.$lte = end
      }
    }

    const invoices = await Bill.find(dateFilter)
      .populate("patientId")
      .sort({ createdAt: -1 })

    const paidInvoices = invoices.filter((inv) => inv.paymentStatus === "paid")
    const unpaidInvoices = invoices.filter((inv) => inv.paymentStatus === "unpaid")

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)

    return res.json({
      success: true,
      code: 200,
      message: "Revenue report generated successfully",
      data: {
        totalRevenue,
        paidCount: paidInvoices.length,
        unpaidCount: unpaidInvoices.length,
        invoices,
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
