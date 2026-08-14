import Patient from "../Module/Patient.js"
import Appointment from "../Module/Appointment.js"
import Bill from "../Module/Bill.js"
import Inventory from "../Module/Inventory.js"

export const getDashboardStatsController = async (req, res) => {
  try {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const [
      totalPatients,
      todaysAppointments,
      revenueResult,
      lowStockCount
    ] = await Promise.all([
      Patient.countDocuments(),
      Appointment.countDocuments({ appointmentDate: { $gte: startOfDay, $lte: endOfDay } }),
      Bill.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Inventory.countDocuments({ $expr: { $lte: ["$quantity", "$lowStockAlert"] } })
    ])

    const totalRevenue = revenueResult[0]?.total || 0
    const pendingLabRequests = 0 // LabTest model not implemented yet

    return res.json({
      success: true,
      code: 200,
      message: "Dashboard stats fetched successfully",
      data: {
        totalPatients,
        todaysAppointments,
        totalRevenue,
        pendingLabRequests,
        lowStockCount
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
