import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import PatientSearchSelect from '../../components/PatientSearchSelect'
import api from '../../services/api'

const emptyForm = { patientId: '', consultationFee: '' }

const BillingBasic = () => {
  const [bills, setBills] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState(emptyForm)

  const fetchAll = async () => {
    try {
      const [billRes, patRes] = await Promise.all([
        api.get('/all-bill'),
        api.get('/all-patient'),
      ])
      setBills(billRes.data.data || [])
      setPatients(patRes.data.data || [])
    } catch (err) {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!formData.patientId) {
      setError('Please select a patient')
      return
    }
    try {
      const res = await api.post('/create-basic-invoice', {
        patientId: formData.patientId,
        consultationFee: Number(formData.consultationFee)
      })
      if (res.data.success) {
        setFormData(emptyForm)
        setSuccess('Invoice created successfully')
        fetchAll()
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to create invoice')
    }
  }

  const paymentStatusColor = {
    unpaid: 'warning',
    paid: 'success',
    cancelled: 'danger',
  }

  // Most recent invoices first
  const recentBills = [...bills]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4"><i className="bi bi-receipt me-2"></i>Billing</h4>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Create Basic Invoice Form */}
          <div className="card p-4 mb-4 shadow-sm">
            <h5 className="mb-3">Create Basic Invoice</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Patient</label>
                  <PatientSearchSelect
                    patients={patients}
                    value={formData.patientId}
                    onChange={(id) => setFormData({ ...formData, patientId: id })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Consultation Fee</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    required
                    min="0"
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button type="submit" className="btn btn-success w-100">
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Recent Invoices */}
          <h5 className="mb-3">Recent Invoices</h5>
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
                    <th>Patient</th>
                    <th>Consultation Fee</th>
                    <th>Lab Fee</th>
                    <th>Pharmacy Fee</th>
                    <th>Total</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBills.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No invoices yet
                      </td>
                    </tr>
                  ) : (
                    recentBills.map((bill, index) => (
                      <tr key={bill._id}>
                        <td>{index + 1}</td>
                        <td>{bill.patientId?.name}</td>
                        <td>Rs. {bill.consultationFee ?? bill.totalAmount}</td>
                        <td>Rs. {bill.labFee ?? 0}</td>
                        <td>Rs. {bill.pharmacyFee ?? 0}</td>
                        <td>Rs. {bill.totalAmount}</td>
                        <td>
                          <span className={`badge bg-${paymentStatusColor[bill.paymentStatus] || 'warning'}`}>
                            {bill.paymentStatus || 'unpaid'}
                          </span>
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

export default BillingBasic
