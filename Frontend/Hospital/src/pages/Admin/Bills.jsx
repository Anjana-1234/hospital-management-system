import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Bills = () => {
  const [bills, setBills] = useState([])
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    patientId: '', appointmentId: '', items: [{ description: '', amount: '' }]
  })
  const [showForm, setShowForm] = useState(false)

  // Fetch all data
  const fetchAll = async () => {
    try {
      const [billRes, patRes, apptRes] = await Promise.all([
        api.get('/all-bill'),
        api.get('/all-patient'),
        api.get('/all-appointment'),
      ])
      setBills(billRes.data.data)
      setPatients(patRes.data.data)
      setAppointments(apptRes.data.data)
    } catch (err) {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Item change karo
  const handleItemChange = (index, e) => {
    const updated = [...formData.items]
    updated[index][e.target.name] = e.target.value
    setFormData({ ...formData, items: updated })
  }

  // Item add karo
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', amount: '' }]
    })
  }

  // Item remove karo
  const removeItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: updated })
  }

  // Bill add karo
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/add-bill', formData)
      if (res.data.success) {
        setShowForm(false)
        setFormData({
          patientId: '', appointmentId: '',
          items: [{ description: '', amount: '' }]
        })
        fetchAll()
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to add bill')
    }
  }

  // Status update karo
  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/update-bill/${id}`, { status })
      fetchAll()
    } catch (err) {
      setError('Failed to update status')
    }
  }

  // Delete karo
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await api.delete(`/delete-bill/${id}`)
      fetchAll()
    } catch (err) {
      setError('Failed to delete bill')
    }
  }

  const statusColor = {
    pending: 'warning',
    paid: 'success',
    cancelled: 'danger',
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>💰 Bills</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Bill'}
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Add Bill Form */}
          {showForm && (
            <div className="card p-4 mb-4 shadow-sm">
              <h5 className="mb-3">Add New Bill</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">

                  {/* Patient select */}
                  <div className="col-md-6">
                    <label className="form-label">Patient</label>
                    <select name="patientId" className="form-select"
                      onChange={handleChange} required>
                      <option value="">Select Patient</option>
                      {patients.map(pat => (
                        <option key={pat._id} value={pat._id}>
                          {pat.userId?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Appointment select */}
                  <div className="col-md-6">
                    <label className="form-label">Appointment</label>
                    <select name="appointmentId" className="form-select"
                      onChange={handleChange}>
                      <option value="">Select Appointment</option>
                      {appointments.map(appt => (
                        <option key={appt._id} value={appt._id}>
                          {appt.patientId?.userId?.name} — {new Date(appt.appointmentDate).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Items */}
                  <div className="col-12">
                    <label className="form-label">Bill Items</label>
                    {formData.items.map((item, index) => (
                      <div key={index} className="d-flex gap-2 mb-2">
                        <input
                          name="description"
                          className="form-control"
                          placeholder="Description (e.g. Consultation)"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, e)}
                          required
                        />
                        <input
                          name="amount"
                          type="number"
                          className="form-control"
                          placeholder="Amount"
                          value={item.amount}
                          onChange={(e) => handleItemChange(index, e)}
                          required
                        />
                        {formData.items.length > 1 && (
                          <button type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeItem(index)}>
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={addItem}>
                      + Add Item
                    </button>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-success">
                      Save Bill
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Bills Table */}
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
                    <th>Patient</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Paid At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No bills found
                      </td>
                    </tr>
                  ) : (
                    bills.map((bill, index) => (
                      <tr key={bill._id}>
                        <td>{index + 1}</td>
                        <td>{bill.patientId?.userId?.name}</td>
                        <td>
                          {bill.items.map((item, i) => (
                            <div key={i}>
                              {item.description} — ₹{item.amount}
                            </div>
                          ))}
                        </td>
                        <td>₹{bill.totalAmount}</td>
                        <td>
                          <span className={`badge bg-${statusColor[bill.status]}`}>
                            {bill.status}
                          </span>
                        </td>
                        <td>
                          {bill.paidAt
                            ? new Date(bill.paidAt).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="d-flex gap-1">
                          <select
                            className="form-select form-select-sm"
                            value={bill.status}
                            onChange={(e) => handleStatusUpdate(bill._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(bill._id)}
                          >
                            ✕
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

export default Bills