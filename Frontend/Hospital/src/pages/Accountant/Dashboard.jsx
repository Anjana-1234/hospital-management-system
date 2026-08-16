import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    unpaidCount: 0,
    todaysRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [reportRes, invoicesRes] = await Promise.all([
          api.get('/revenue-report'),
          api.get('/all-invoices'),
        ])

        const report = reportRes.data.data || { totalRevenue: 0, unpaidCount: 0 }
        const invoices = invoicesRes.data.data || []

        const today = new Date().toDateString()
        const todaysRevenue = invoices
          .filter((inv) => inv.paymentStatus === 'paid' && new Date(inv.createdAt).toDateString() === today)
          .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)

        setStats({
          totalRevenue: report.totalRevenue || 0,
          unpaidCount: report.unpaidCount || 0,
          todaysRevenue,
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
    { label: 'Total Revenue (Paid)', value: `Rs. ${stats.totalRevenue}`, color: 'success', icon: 'bi-cash-stack' },
    { label: 'Unpaid Invoices', value: stats.unpaidCount, color: 'danger', icon: 'bi-receipt-cutoff' },
    { label: "Today's Revenue", value: `Rs. ${stats.todaysRevenue}`, color: 'success', icon: 'bi-graph-up' },
  ]

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4">Accountant Dashboard</h4>

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
