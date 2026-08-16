import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const LOW_STOCK_THRESHOLD = 10
const EXPIRY_WINDOW_DAYS = 30

const Inventory = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '', category: 'medicine',
    quantity: '', unit: '', unitPrice: '',
    expiryDate: '', supplier: '',
    lowStockAlert: 10
  })

  // Inline edit state
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({ quantity: '', unitPrice: '' })

  const fetchInventory = async () => {
    try {
      const res = await api.get('/all-inventory')
      setItems(res.data.data || [])
    } catch (err) {
      setError('Failed to fetch inventory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/add-inventory', formData)
      if (res.data.success) {
        setShowForm(false)
        setFormData({
          name: '', category: 'medicine',
          quantity: '', unit: '', unitPrice: '',
          expiryDate: '', supplier: '',
          lowStockAlert: 10
        })
        fetchInventory()
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to add medicine')
    }
  }

  const startEdit = (item) => {
    setEditId(item._id)
    setEditData({ quantity: item.quantity, unitPrice: item.unitPrice || 0 })
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditData({ quantity: '', unitPrice: '' })
  }

  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/update-inventory/${id}`, {
        quantity: Number(editData.quantity),
        unitPrice: Number(editData.unitPrice),
      })
      if (res.data.success) {
        cancelEdit()
        fetchInventory()
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to update item')
    }
  }

  const isLowStock = (item) => item.quantity <= (item.lowStockAlert ?? LOW_STOCK_THRESHOLD)

  const isExpiringSoon = (item) => {
    if (!item.expiryDate) return false
    const limit = new Date()
    limit.setDate(limit.getDate() + EXPIRY_WINDOW_DAYS)
    return new Date(item.expiryDate) <= limit
  }

  const categoryColor = {
    medicine: 'primary',
    equipment: 'warning',
    consumable: 'info',
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4><i className="bi bi-capsule me-2"></i>Inventory</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Medicine'}
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {items.some((item) => isLowStock(item) || isExpiringSoon(item)) && (
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Some items are low on stock or nearing expiry — check the highlighted rows below.
            </div>
          )}

          {/* Add Medicine Form */}
          {showForm && (
            <div className="card p-4 mb-4 shadow-sm">
              <h5 className="mb-3">Add New Medicine</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <input name="name" className="form-control"
                      placeholder="Medicine Name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <select name="category" className="form-select"
                      value={formData.category} onChange={handleChange}>
                      <option value="medicine">Medicine</option>
                      <option value="equipment">Equipment</option>
                      <option value="consumable">Consumable</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input name="unit" className="form-control"
                      placeholder="Unit (e.g. tablets, bottles)"
                      value={formData.unit} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3">
                    <input name="quantity" type="number" className="form-control"
                      placeholder="Stock Quantity" value={formData.quantity} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3">
                    <input name="unitPrice" type="number" step="0.01" className="form-control"
                      placeholder="Unit Price" value={formData.unitPrice} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3">
                    <input name="lowStockAlert" type="number" className="form-control"
                      placeholder="Low Stock Alert" value={formData.lowStockAlert} onChange={handleChange} />
                  </div>
                  <div className="col-md-3">
                    <input name="expiryDate" type="date" className="form-control"
                      value={formData.expiryDate} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <input name="supplier" className="form-control"
                      placeholder="Supplier Name" value={formData.supplier} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-success">
                      Save Medicine
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Inventory Table */}
          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Unit</th>
                    <th>Unit Price</th>
                    <th>Expiry</th>
                    <th>Alerts</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center text-muted">
                        No medicines found
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => {
                      const lowStock = isLowStock(item)
                      const expiringSoon = isExpiringSoon(item)
                      const editing = editId === item._id
                      return (
                        <tr key={item._id}
                          className={(lowStock || expiringSoon) ? 'table-warning' : ''}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>
                            <span className={`badge bg-${categoryColor[item.category]}`}>
                              {item.category}
                            </span>
                          </td>
                          <td>
                            {editing ? (
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                style={{ width: '90px' }}
                                value={editData.quantity}
                                onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                              />
                            ) : item.quantity}
                          </td>
                          <td>{item.unit}</td>
                          <td>
                            {editing ? (
                              <input
                                type="number"
                                step="0.01"
                                className="form-control form-control-sm"
                                style={{ width: '100px' }}
                                value={editData.unitPrice}
                                onChange={(e) => setEditData({ ...editData, unitPrice: e.target.value })}
                              />
                            ) : `Rs. ${item.unitPrice ?? 0}`}
                          </td>
                          <td>
                            {item.expiryDate
                              ? new Date(item.expiryDate).toLocaleDateString()
                              : '—'}
                          </td>
                          <td>
                            {lowStock && (
                              <span className="badge bg-warning text-dark d-block mb-1">
                                <i className="bi bi-exclamation-triangle me-1"></i>Low Stock
                              </span>
                            )}
                            {expiringSoon && (
                              <span className="badge bg-warning text-dark d-block">
                                <i className="bi bi-hourglass-split me-1"></i>Expiring Soon
                              </span>
                            )}
                            {!lowStock && !expiringSoon && (
                              <span className="badge bg-success">
                                <i className="bi bi-check-circle me-1"></i>OK
                              </span>
                            )}
                          </td>
                          <td>
                            {editing ? (
                              <div className="d-flex gap-1">
                                <button className="btn btn-success btn-sm" onClick={() => saveEdit(item._id)}>
                                  Save
                                </button>
                                <button className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button className="btn btn-primary btn-sm" onClick={() => startEdit(item)}>
                                <i className="bi bi-pencil me-1"></i>Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default Inventory
