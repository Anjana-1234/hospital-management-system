import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const TABS = [
  { key: 'patients', label: 'Patients', endpoint: '/reports/patients', dateFilter: true },
  { key: 'appointments', label: 'Appointments', endpoint: '/reports/appointments', dateFilter: true },
  { key: 'revenue', label: 'Revenue', endpoint: '/revenue-report', dateFilter: true },
  { key: 'pharmacy', label: 'Pharmacy', endpoint: '/reports/pharmacy', dateFilter: true },
  { key: 'lab', label: 'Lab', endpoint: '/reports/lab', dateFilter: true },
  { key: 'staff', label: 'Staff', endpoint: '/reports/staff', dateFilter: false },
]

const appointmentStatusColor = {
  pending: 'warning',
  confirmed: 'primary',
  completed: 'success',
  cancelled: 'danger',
}

const labStatusColor = {
  requested: 'warning',
  collected: 'primary',
  completed: 'success',
}

const paymentStatusColor = {
  unpaid: 'warning',
  paid: 'success',
  cancelled: 'danger',
}

const Reports = () => {
  const [activeTab, setActiveTab] = useState('patients')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const currentTab = TABS.find((t) => t.key === activeTab)

  const fetchReport = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (currentTab.dateFilter) {
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)
      }
      const query = params.toString() ? `?${params.toString()}` : ''

      const res = await api.get(`${currentTab.endpoint}${query}`)
      if (res.data.success) {
        setData(res.data.data)
      } else {
        setError(res.data.message || 'Failed to fetch report')
      }
    } catch (err) {
      setError('Failed to fetch report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const handleFilter = (e) => {
    e.preventDefault()
    fetchReport()
  }

  const isLowStock = (item) => item.quantity <= (item.lowStockAlert ?? 10)
  const isExpiringSoon = (item) => {
    if (!item.expiryDate) return false
    const limit = new Date()
    limit.setDate(limit.getDate() + 30)
    return new Date(item.expiryDate) <= limit
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4"><i className="bi bi-file-earmark-bar-graph me-2"></i>Reports</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <ul className="nav nav-tabs mb-3">
            {TABS.map((tab) => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {currentTab.dateFilter && (
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
          )}

          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <>
              {/* Patients Report */}
              {activeTab === 'patients' && data && (
                <>
                  <div className="row g-4 mb-4">
                    <div className="col-md-4">
                      <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                        <div className="stat-card-icon" style={{ color: 'var(--color-primary)' }}>
                          <i className="bi bi-people"></i>
                        </div>
                        <div>
                          <h2 className="stat-card-value">{data.count}</h2>
                          <p className="stat-card-label">Total Patients</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Age</th>
                          <th>Gender</th>
                          <th>Phone</th>
                          <th>Registered On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.patients.length === 0 ? (
                          <tr><td colSpan="7" className="text-center text-muted">No patients found</td></tr>
                        ) : (
                          data.patients.map((p, i) => (
                            <tr key={p._id}>
                              <td>{i + 1}</td>
                              <td>{p.name}</td>
                              <td>{p.email}</td>
                              <td>{p.age}</td>
                              <td>{p.gender}</td>
                              <td>{p.phone}</td>
                              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Appointments Report */}
              {activeTab === 'appointments' && data && (
                <>
                  <div className="row g-4 mb-4">
                    {Object.entries(data.statusBreakdown).map(([status, count]) => (
                      <div className="col-md-3" key={status}>
                        <div className="stat-card" style={{ borderLeft: `4px solid var(--color-${appointmentStatusColor[status]})` }}>
                          <div className="stat-card-icon" style={{ color: `var(--color-${appointmentStatusColor[status]})` }}>
                            <i className="bi bi-calendar-check"></i>
                          </div>
                          <div>
                            <h2 className="stat-card-value">{count}</h2>
                            <p className="stat-card-label text-capitalize">{status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Date</th>
                          <th>Time Slot</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.appointments.length === 0 ? (
                          <tr><td colSpan="6" className="text-center text-muted">No appointments found</td></tr>
                        ) : (
                          data.appointments.map((a, i) => (
                            <tr key={a._id}>
                              <td>{i + 1}</td>
                              <td>{a.patientId?.name || '—'}</td>
                              <td>{a.doctorId?.specialization || '—'}</td>
                              <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                              <td>{a.timeSlot}</td>
                              <td>
                                <span className={`badge bg-${appointmentStatusColor[a.status]}`}>{a.status}</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Revenue Report */}
              {activeTab === 'revenue' && data && (
                <>
                  <div className="row g-4 mb-4">
                    <div className="col-md-4">
                      <div className="stat-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
                        <div className="stat-card-icon" style={{ color: 'var(--color-success)' }}>
                          <i className="bi bi-cash-stack"></i>
                        </div>
                        <div>
                          <h2 className="stat-card-value">Rs. {data.totalRevenue || 0}</h2>
                          <p className="stat-card-label">Total Revenue</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="stat-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
                        <div className="stat-card-icon" style={{ color: 'var(--color-success)' }}>
                          <i className="bi bi-check-circle"></i>
                        </div>
                        <div>
                          <h2 className="stat-card-value">{data.paidCount || 0}</h2>
                          <p className="stat-card-label">Paid Invoices</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="stat-card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
                        <div className="stat-card-icon" style={{ color: 'var(--color-danger)' }}>
                          <i className="bi bi-exclamation-circle"></i>
                        </div>
                        <div>
                          <h2 className="stat-card-value">{data.unpaidCount || 0}</h2>
                          <p className="stat-card-label">Unpaid Invoices</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                        {data.invoices?.length === 0 ? (
                          <tr><td colSpan="5" className="text-center text-muted">No invoices found</td></tr>
                        ) : (
                          data.invoices?.map((inv, i) => (
                            <tr key={inv._id}>
                              <td>{i + 1}</td>
                              <td>{inv.patientId?.name || '—'}</td>
                              <td>Rs. {inv.totalAmount || 0}</td>
                              <td>
                                <span className={`badge bg-${paymentStatusColor[inv.paymentStatus] || 'secondary'}`}>
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

              {/* Pharmacy Report */}
              {activeTab === 'pharmacy' && data && (
                <>
                  <div className="row g-4 mb-4">
                    <div className="col-md-4">
                      <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                        <div className="stat-card-icon" style={{ color: 'var(--color-primary)' }}>
                          <i className="bi bi-capsule"></i>
                        </div>
                        <div>
                          <h2 className="stat-card-value">{data.dispensedCount}</h2>
                          <p className="stat-card-label">Dispensed Prescriptions</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="stat-card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
                        <div className="stat-card-icon" style={{ color: 'var(--color-warning)' }}>
                          <i className="bi bi-exclamation-triangle"></i>
                        </div>
                        <div>
                          <h2 className="stat-card-value">{data.lowStockItems.length}</h2>
                          <p className="stat-card-label">Low Stock / Expiring Items</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h6 className="mb-2">Dispensed Prescriptions</h6>
                  <div className="table-responsive mb-4">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Patient</th>
                          <th>Medicines</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.dispensedPrescriptions.length === 0 ? (
                          <tr><td colSpan="4" className="text-center text-muted">No dispensed prescriptions found</td></tr>
                        ) : (
                          data.dispensedPrescriptions.map((p, i) => (
                            <tr key={p._id}>
                              <td>{i + 1}</td>
                              <td>{p.patientId?.name || '—'}</td>
                              <td>
                                {p.medicines?.map((m) => m.name).join(', ')}
                              </td>
                              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <h6 className="mb-2">Low Stock / Expiring Items</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Stock</th>
                          <th>Expiry</th>
                          <th>Alert</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.lowStockItems.length === 0 ? (
                          <tr><td colSpan="5" className="text-center text-muted">No low stock or expiring items</td></tr>
                        ) : (
                          data.lowStockItems.map((item, i) => (
                            <tr key={item._id} className="table-warning">
                              <td>{i + 1}</td>
                              <td>{item.name}</td>
                              <td>{item.quantity} {item.unit}</td>
                              <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '—'}</td>
                              <td>
                                {isLowStock(item) && (
                                  <span className="badge bg-warning text-dark d-block mb-1">Low Stock</span>
                                )}
                                {isExpiringSoon(item) && (
                                  <span className="badge bg-warning text-dark d-block">Expiring Soon</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Lab Report */}
              {activeTab === 'lab' && data && (
                <>
                  <div className="row g-4 mb-4">
                    {Object.entries(data.statusBreakdown).map(([status, count]) => (
                      <div className="col-md-4" key={status}>
                        <div className="stat-card" style={{ borderLeft: `4px solid var(--color-${labStatusColor[status]})` }}>
                          <div className="stat-card-icon" style={{ color: `var(--color-${labStatusColor[status]})` }}>
                            <i className="bi bi-flask"></i>
                          </div>
                          <div>
                            <h2 className="stat-card-value">{count}</h2>
                            <p className="stat-card-label text-capitalize">{status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Patient</th>
                          <th>Test Type</th>
                          <th>Requested By</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.labTests.length === 0 ? (
                          <tr><td colSpan="6" className="text-center text-muted">No lab tests found</td></tr>
                        ) : (
                          data.labTests.map((t, i) => (
                            <tr key={t._id}>
                              <td>{i + 1}</td>
                              <td>{t.patientId?.name || '—'}</td>
                              <td>{t.testType}</td>
                              <td>{t.requestedBy?.name || '—'}</td>
                              <td>
                                <span className={`badge bg-${labStatusColor[t.status]}`}>{t.status}</span>
                              </td>
                              <td>{new Date(t.date).toLocaleDateString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Staff Report */}
              {activeTab === 'staff' && data && (
                <>
                  <div className="row g-4 mb-4">
                    {Object.entries(data.roleCounts).map(([role, count]) => (
                      <div className="col-md-3" key={role}>
                        <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                          <div className="stat-card-icon" style={{ color: 'var(--color-primary)' }}>
                            <i className="bi bi-person-badge"></i>
                          </div>
                          <div>
                            <h2 className="stat-card-value">{count}</h2>
                            <p className="stat-card-label text-capitalize">{role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.users.length === 0 ? (
                          <tr><td colSpan="5" className="text-center text-muted">No staff found</td></tr>
                        ) : (
                          data.users.map((u, i) => (
                            <tr key={u._id}>
                              <td>{i + 1}</td>
                              <td>{u.name}</td>
                              <td>{u.email}</td>
                              <td><span className="badge bg-primary text-uppercase">{u.role}</span></td>
                              <td>
                                <span className={`badge ${u.isActive ? 'bg-success' : 'bg-danger'}`}>
                                  {u.isActive ? 'Yes' : 'No'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </>
  )
}

export default Reports
