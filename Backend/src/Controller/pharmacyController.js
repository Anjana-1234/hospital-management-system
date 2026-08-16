import Prescription from "../Module/Prescription.js"
import Inventory from "../Module/Inventory.js"
import { escapeRegex } from "../utils/escapeRegex.js"

export const getPendingPrescriptionsController = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ status: "pending" })
      .populate("appointmentId")
      .populate("doctorId")
      .populate("patientId")

    return res.json({
      success: true,
      code: 200,
      message: "Pending prescriptions fetched successfully",
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

export const dispensePrescriptionController = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)

    if (!prescription) {
      return res.json({
        success: false,
        code: 404,
        message: "Prescription not found",
        data: null,
        error: true,
      })
    }

    if (prescription.status === "dispensed") {
      return res.json({
        success: false,
        code: 400,
        message: "Prescription already dispensed",
        data: null,
        error: true,
      })
    }

    // Check stock availability for every medicine before deducting anything
    const inventoryItems = []
    for (const med of prescription.medicines) {
      const item = await Inventory.findOne({ name: new RegExp(`^${escapeRegex(med.name.trim())}$`, "i") })
      const requiredQty = med.quantity || 1

      if (!item || item.quantity < requiredQty) {
        return res.json({
          success: false,
          code: 400,
          message: `Insufficient stock for ${med.name}`,
          data: null,
          error: true,
        })
      }

      inventoryItems.push({ item, requiredQty })
    }

    // All medicines have enough stock — deduct and mark dispensed
    for (const { item, requiredQty } of inventoryItems) {
      item.quantity -= requiredQty
      await item.save()
    }

    prescription.status = "dispensed"
    await prescription.save()

    return res.json({
      success: true,
      code: 200,
      message: "Prescription dispensed successfully",
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

export const getLowStockController = async (req, res) => {
  try {
    const LOW_STOCK_THRESHOLD = 10
    const EXPIRY_WINDOW_DAYS = 30

    const expiryLimit = new Date()
    expiryLimit.setDate(expiryLimit.getDate() + EXPIRY_WINDOW_DAYS)

    const items = await Inventory.find({
      $or: [
        { quantity: { $lte: LOW_STOCK_THRESHOLD } },
        { expiryDate: { $ne: null, $lte: expiryLimit } }
      ]
    })

    return res.json({
      success: true,
      code: 200,
      message: "Low stock / expiring items fetched successfully",
      data: items,
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
