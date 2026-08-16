import mongoose from "mongoose"

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ["medicine", "equipment", "consumable"],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    required: true // e.g. "tablets", "bottles", "units"
  },
  unitPrice: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date
  },
  supplier: {
    type: String,
    trim: true
  },
  lowStockAlert: {
    type: Number,
    default: 10 // Alert when quantity drops to or below this
  }
}, { timestamps: true })

const Inventory = mongoose.model("Inventory", inventorySchema)
export default Inventory