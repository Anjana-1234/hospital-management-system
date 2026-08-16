import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Invoices = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [actingId, setActingId] = useState(null)

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const query = filter === 'all' ? '' : `?paymentStatus=${filter}`
      const res = await api.get(`/all-invoices${query}`)
      setInvoices(res.data.data || [])
    } catch (err) {
      setError('Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [filter])

  const handleFinalize = async (id) => {
    setError('')
    setActingId(id)
    try {
      const res = await api.put(`/finalize-invoice/${id}`)
      if (res.data.success) {
        fetchInvoices()
      } else {
        setError(res.data.message || 'Failed to finalize invoice')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to finalize invoice')
    } finally {
      setActingId(null)
    }
  }

  const handleRecordPayment = async (id) => {
    setError('')
    setActingId(id)
    try {
      const res = await api.put(`/record-payment/${id}`)
      if (res.data.success) {
        fetchInvoices()
      } else {
        setError(res.data.message || 'Failed to record payment')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment')
    } finally {
      setActingId(null)
    }
  }

  const statusColor = {
    unpaid: 'warning',
    paid: 'success',
    cancelled: 'danger',
  }

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'unpaid', label: 'Unpaid' },
    { key: 'paid', label: 'Paid' },
  ]

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4"><i className="bi bi-receipt-cutoff me-2"></i>Invoices</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <ul className="nav nav-tabs mb-3">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link ${filter === tab.key ? 'active' : ''}`}
                  onClick={() => setFilter(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

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
                    <th>Consultation</th>
                    <th>Lab</th>
                    <th>Pharmacy</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center text-muted">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv, index) => (
                      <tr key={inv._id}>
                        <td>{index + 1}</td>
                        <td>{inv.patientId?.name || '—'}</td>
                        <td>Rs. {inv.consultationFee || 0}</td>
                        <td>Rs. {inv.labFee || 0}</td>
                        <td>Rs. {inv.pharmacyFee || 0}</td>
                        <td><strong>Rs. {inv.totalAmount || 0}</strong></td>
                        <td>
                          <span className={`badge bg-${statusColor[inv.paymentStatus] || 'secondary'}`}>
                            {inv.paymentStatus}
                          </span>
                        </td>
                        <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex gap-1">
                            {inv.paymentStatus === 'unpaid' && (
                              <button
                                className="btn btn-primary btn-sm text-nowrap"
                                disabled={actingId === inv._id}
                                onClick={() => handleFinalize(inv._id)}
                              >
                                {actingId === inv._id ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : 'Finalize'}
                              </button>
                            )}
                            {inv.paymentStatus === 'unpaid' && (
                              <button
                                className="btn btn-success btn-sm text-nowrap"
                                disabled={actingId === inv._id}
                                onClick={() => handleRecordPayment(inv._id)}
                              >
                                {actingId === inv._id ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : 'Record Payment'}
                              </button>
                            )}
                            {inv.paymentStatus === 'paid' && (
                              <span className="text-muted small">—</span>
                            )}
                          </div>
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

export default Invoices
