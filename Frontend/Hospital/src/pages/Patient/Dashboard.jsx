import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    appointments: 0,
    prescriptions: 0,
    bills: 0,
    pendingBills: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [apptRes, presRes, billRes] = await Promise.all([
          api.get('/all-appointment'),
          api.get('/all-prescription'),
          api.get('/all-bill'),
        ])

        const bills = billRes.data.data

        setStats({
          appointments: apptRes.data.data.length,
          prescriptions: presRes.data.data.length,
          bills: bills.length,
          pendingBills: bills.filter(b => b.status === 'pending').length,
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
    { label: 'My Appointments', value: stats.appointments, color: 'primary', icon: 'bi-calendar-check' },
    { label: 'My Prescriptions', value: stats.prescriptions, color: 'success', icon: 'bi-file-medical' },
    { label: 'Total Bills', value: stats.bills, color: 'primary', icon: 'bi-receipt' },
    { label: 'Pending Bills', value: stats.pendingBills, color: 'warning', icon: 'bi-hourglass-split' },
  ]

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4">Patient Dashboard</h4>

          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="row g-4">
              {cards.map((card) => (
                <div className="col-md-3" key={card.label}>
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