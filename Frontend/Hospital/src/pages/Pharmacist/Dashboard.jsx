import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const LOW_STOCK_THRESHOLD = 10
const EXPIRY_WINDOW_DAYS = 30

const Dashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    lowStock: 0,
    expiringSoon: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prescRes, alertRes] = await Promise.all([
          api.get('/pending-prescriptions'),
          api.get('/low-stock-alerts'),
        ])

        const pending = prescRes.data.data || []
        const alerts = alertRes.data.data || []

        const expiryLimit = new Date()
        expiryLimit.setDate(expiryLimit.getDate() + EXPIRY_WINDOW_DAYS)

        const lowStock = alerts.filter((item) => item.quantity <= LOW_STOCK_THRESHOLD)
        const expiringSoon = alerts.filter(
          (item) => item.expiryDate && new Date(item.expiryDate) <= expiryLimit
        )

        setStats({
          pending: pending.length,
          lowStock: lowStock.length,
          expiringSoon: expiringSoon.length,
        })
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    { label: 'Pending Prescriptions', value: stats.pending, color: 'primary', icon: 'bi-prescription2' },
    { label: 'Low Stock Items', value: stats.lowStock, color: 'warning', icon: 'bi-capsule' },
    { label: 'Expiring Soon', value: stats.expiringSoon, color: 'warning', icon: 'bi-exclamation-triangle' },
  ]

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4">Pharmacist Dashboard</h4>

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
