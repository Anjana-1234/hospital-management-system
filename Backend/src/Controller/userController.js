import User from "../Module/User.js"

export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    return res.json({
      success: true,
      code: 200,
      message: "Users fetched successfully",
      data: users,
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

export const updateUserController = async (req, res) => {
  try {
    const { role, isActive } = req.body

    // Sirf role aur isActive hi update karne dena — password/email yahan se change nahi
    const updateData = {}
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password")

    if (!user) {
      return res.json({
        success: false,
        code: 404,
        message: "User not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "User updated successfully",
      data: user,
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

export const deleteUserController = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.json({
        success: false,
        code: 404,
        message: "User not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "User deleted successfully",
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
