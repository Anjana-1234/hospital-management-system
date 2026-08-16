import Department from "../Module/Department.js"
import { requireFields } from "../utils/validateFields.js"

export const addDepartmentController = async (req, res) => {
  try {
    if (requireFields(req, res, ["name"])) return;

    const { name, description } = req.body

    const isExist = await Department.findOne({ name })
    if (isExist) {
      return res.json({
        success: false,
        code: 400,
        message: "Department already exist",
        data: null,
        error: true,
      })
    }

    const department = new Department({ name, description })
    const result = await department.save()

    return res.json({
      success: true,
      code: 201,
      message: "Department added successfully",
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

export const getAllDepartmentsController = async (req, res) => {
  try {
    const departments = await Department.find()
    return res.json({
      success: true,
      code: 200,
      message: "Departments fetched successfully",
      data: departments,
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

export const getDepartmentByIdController = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
    if (!department) {
      return res.json({
        success: false,
        code: 404,
        message: "Department not found",
        data: null,
        error: true,
      })
    }
    return res.json({
      success: true,
      code: 200,
      message: "Department fetched successfully",
      data: department,
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

export const updateDepartmentController = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!department) {
      return res.json({
        success: false,
        code: 404,
        message: "Department not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Department updated successfully",
      data: department,
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

export const deleteDepartmentController = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id)

    if (!department) {
      return res.json({
        success: false,
        code: 404,
        message: "Department not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Department deleted successfully",
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
