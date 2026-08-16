import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const RevenueReport = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [report, setReport] = useState({ totalRevenue: 0, paidCount: 0, unpaidCount: 0, invoices: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReport = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      const query = params.toString() ? `?${params.toString()}` : ''

      const res = await api.get(`/revenue-report${query}`)
      if (res.data.success) {
        setReport(res.data.data)
      } else {
        setError(res.data.message || 'Failed to fetch revenue report')
      }
    } catch (err) {
      setError('Failed to fetch revenue report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  const handleFilter = (e) => {
    e.preventDefault()
    fetchReport()
  }

  const statusColor = {
    unpaid: 'warning',
    paid: 'success',
    cancelled: 'danger',
  }

  const cards = [
    { label: 'Total Revenue', value: `Rs. ${report.totalRevenue || 0}`, color: 'success', icon: 'bi-cash-stack' },
    { label: 'Paid Invoices', value: report.paidCount || 0, color: 'success', icon: 'bi-check-circle' },
    { label: 'Unpaid Invoices', value: report.unpaidCount || 0, color: 'danger', icon: 'bi-exclamation-circle' },
  ]

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4"><i className="bi bi-graph-up me-2"></i>Revenue Report</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Date Range Filter */}
          <form onSubmit={handleFilter} className="card p-3 mb-4 shadow-sm">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-filter me-1"></i>Apply Filter
                </button>
              </div>
            </div>
          </form>

          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="row g-4 mb-4">
                {cards.map((card) => (
                  <div className="col-md-4" key={card.label}>
                    <div className="stat-card" style={{ borderLeft: `4px solid var(--color-${card.color})` }}>
                      <div className="stat-card-icon" style={{ color: `var(--color-${card.color})` }}>
                        <i className={`bi ${card.icon}`}></i>
                      </div>
                      <div>
                        <h2 className="stat-card-value">{card.value}</h2>
                        <p className="stat-card-label">{card.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoices Table */}
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Patient</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.invoices?.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          No invoices found in this range
                        </td>
                      </tr>
                    ) : (
                      report.invoices?.map((inv, index) => (
                        <tr key={inv._id}>
                          <td>{index + 1}</td>
                          <td>{inv.patientId?.name || '—'}</td>
                          <td>Rs. {inv.totalAmount || 0}</td>
                          <td>
                            <span className={`badge bg-${statusColor[inv.paymentStatus] || 'secondary'}`}>
                              {inv.paymentStatus}
                            </span>
                          </td>
                          <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}

export default RevenueReport
