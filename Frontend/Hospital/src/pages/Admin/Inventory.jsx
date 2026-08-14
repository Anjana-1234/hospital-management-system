import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Inventory = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '', category: 'medicine',
    quantity: '', unit: '',
    expiryDate: '', supplier: '',
    lowStockAlert: 10
  })
  const [showForm, setShowForm] = useState(false)

  // Fetch inventory
  const fetchInventory = async () => {
    try {
      const res = await api.get('/all-inventory')
      setItems(res.data.data)
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

  // Item add karo
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/add-inventory', formData)
      if (res.data.success) {
        setShowForm(false)
        setFormData({
          name: '', category: 'medicine',
          quantity: '', unit: '',
          expiryDate: '', supplier: '',
          lowStockAlert: 10
        })
        fetchInventory()
      }
    } catch (err) {
      setError('Failed to add item')
    }
  }

  // Item delete karo
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await api.delete(`/delete-inventory/${id}`)
      fetchInventory()
    } catch (err) {
      setError('Failed to delete item')
    }
  }

  // Low stock check
  const isLowStock = (item) => item.quantity <= item.lowStockAlert

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
            <h4>📦 Inventory</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Item'}
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Low Stock Alert */}
          {items.some(isLowStock) && (
            <div className="alert alert-warning">
              ⚠️ Kuch items ka stock kam hai — check karo!
            </div>
          )}

          {/* Add Item Form */}
          {showForm && (
            <div className="card p-4 mb-4 shadow-sm">
              <h5 className="mb-3">Add New Item</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <input name="name" className="form-control"
                      placeholder="Item Name" onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <select name="category" className="form-select"
                      onChange={handleChange}>
                      <option value="medicine">Medicine</option>
                      <option value="equipment">Equipment</option>
                      <option value="consumable">Consumable</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input name="unit" className="form-control"
                      placeholder="Unit (e.g. tablets, bottles)"
                      onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <input name="quantity" type="number" className="form-control"
                      placeholder="Quantity" onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <input name="lowStockAlert" type="number" className="form-control"
                      placeholder="Low Stock Alert" onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <input name="expiryDate" type="date" className="form-control"
                      onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <input name="supplier" className="form-control"
                      placeholder="Supplier Name" onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-success">
                      Save Item
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
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Expiry</th>
                    <th>Supplier</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center text-muted">
                        No items found
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={item._id}
                        className={isLowStock(item) ? 'table-danger' : ''}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>
                          <span className={`badge bg-${categoryColor[item.category]}`}>
                            {item.category}
                          </span>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{item.unit}</td>
                        <td>
                          {item.expiryDate
                            ? new Date(item.expiryDate).toLocaleDateString()
                            : '—'}
                        </td>
                        <td>{item.supplier || '—'}</td>
                        <td>
                          {isLowStock(item) ? (
                            <span className="badge bg-danger">Low Stock ⚠️</span>
                          ) : (
                            <span className="badge bg-success">OK ✅</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
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