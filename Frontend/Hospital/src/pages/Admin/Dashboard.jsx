import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar.jsx'
import Sidebar from '../../components/Sidebar.jsx'
import api from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todaysAppointments: 0,
    totalRevenue: 0,
    pendingLabRequests: 0,
    lowStockCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard-stats')
        if (res.data.success) {
          setStats(res.data.data)
        } else {
          setError(res.data.message)
        }
      } catch (err) {
        setError('Failed to fetch dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Patients', value: stats.totalPatients, color: 'primary', icon: 'bi-people' },
    { label: "Today's Appointments", value: stats.todaysAppointments, color: 'primary', icon: 'bi-calendar-check' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, color: 'success', icon: 'bi-cash-stack' },
    { label: 'Pending Lab Requests', value: stats.pendingLabRequests, color: 'primary', icon: 'bi-clipboard2-pulse' },
    { label: 'Low Stock Items', value: stats.lowStockCount, color: 'warning', icon: 'bi-exclamation-triangle' },
  ]

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4">Admin Dashboard</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="row g-4">
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
          )}

        </div>
      </div>
    </>
  )
}

export default Dashboard
