import Inventory from "../Module/Inventory.js"

export const addInventoryController = async (req, res) => {
  try {
    const { name, category, quantity, unit, expiryDate, supplier, lowStockAlert } = req.body

    const item = new Inventory({
      name,
      category,
      quantity,
      unit,
      expiryDate,
      supplier,
      lowStockAlert
    })
    const result = await item.save()

    return res.json({
      success: true,
      code: 201,
      message: "Item added successfully",
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


export const getAllInventoryController = async (req, res) => {
  try {
    const items = await Inventory.find()

    return res.json({
      success: true,
      code: 200,
      message: "Inventory fetched successfully",
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

export const getLowStockController = async (req, res) => {
  try {
    // Jinki quantity lowStockAlert se kam hai
    const items = await Inventory.find({
      $expr: { $lte: ["$quantity", "$lowStockAlert"] }
    })

    return res.json({
      success: true,
      code: 200,
      message: "Low stock items fetched successfully",
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


export const updateInventoryController = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!item) {
      return res.json({
        success: false,
        code: 404,
        message: "Item not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Item updated successfully",
      data: item,
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

export const deleteInventoryController = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id)

    if (!item) {
      return res.json({
        success: false,
        code: 404,
        message: "Item not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Item deleted successfully",
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