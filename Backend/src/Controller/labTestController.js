import LabTest from "../Module/LabTest.js"
import { requireFields } from "../utils/validateFields.js"

export const requestLabTestController = async (req, res) => {
  try {
    if (requireFields(req, res, ["patientId", "testType"])) return;

    const { patientId, testType } = req.body

    const labTest = new LabTest({
      patientId,
      requestedBy: req.user.id,
      testType
    })
    const result = await labTest.save()

    return res.json({
      success: true,
      code: 201,
      message: "Lab test requested successfully",
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

export const getMyRequestsController = async (req, res) => {
  try {
    const tests = await LabTest.find({ requestedBy: req.user.id })
      .populate("patientId")
      .sort({ date: -1 })

    return res.json({
      success: true,
      code: 200,
      message: "Lab test requests fetched successfully",
      data: tests,
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

export const getAllLabTestsController = async (req, res) => {
  try {
    const { status } = req.query
    const filter = status ? { status } : {}

    const tests = await LabTest.find(filter)
      .populate("patientId")
      .populate("requestedBy", "-password")
      .sort({ date: -1 })

    return res.json({
      success: true,
      code: 200,
      message: "Lab tests fetched successfully",
      data: tests,
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

export const updateLabTestStatusController = async (req, res) => {
  try {
    const { status, result } = req.body

    const validStatus = ["requested", "collected", "completed"]
    if (status && !validStatus.includes(status)) {
      return res.json({
        success: false,
        code: 400,
        message: "Invalid status",
        data: null,
        error: true,
      })
    }

    const update = {}
    if (status) update.status = status
    if (result !== undefined) update.result = result

    const labTest = await LabTest.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    )

    if (!labTest) {
      return res.json({
        success: false,
        code: 404,
        message: "Lab test not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Lab test updated successfully",
      data: labTest,
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
