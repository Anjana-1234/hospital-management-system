import User from "../Module/User.js"
import bcrypt from "bcrypt"
import { requireFields } from "../utils/validateFields.js"

export const getAdminExistsController = async (req, res) => {
  try {
    const adminExists = await User.exists({ role: "admin" })

    return res.json({
      success: true,
      code: 200,
      message: "Admin existence checked",
      data: { exists: !!adminExists },
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

// No auth middleware here on purpose — this must be reachable before any account exists.
// Safety comes from the logic below, not from route protection.
export const setupFirstAdminController = async (req, res) => {
  try {
    // Gate: refuse outright if an admin already exists, regardless of what's in the body
    const adminExists = await User.exists({ role: "admin" })
    if (adminExists) {
      return res.json({
        success: false,
        code: 403,
        message: "Setup already completed",
        data: null,
        error: true,
      })
    }

    if (requireFields(req, res, ["name", "email", "password"])) return;

    // Only name/email/password are ever read from the body — role is never taken from
    // the client, so this route can only ever create an admin account.
    const { name, email, password } = req.body

    const isExist = await User.findOne({ email })
    if (isExist) {
      return res.json({
        success: false,
        code: 400,
        message: "Email already exist",
        data: null,
        error: true,
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = new User({ name, email, password: hashedPassword, role: "admin" })
    const result = await admin.save()

    return res.json({
      success: true,
      code: 201,
      message: "Admin account created successfully",
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
