import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar.jsx'
import Sidebar from '../../components/Sidebar.jsx'
import api from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    todayAppointments: 0,
    revenue: 0,
    pharmacyAlerts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patients, appointments, bills, lowStock] = await Promise.all([
          api.get('/all-patient'),
          api.get('/all-appointment'),
          api.get('/all-bill'),
          api.get('/low-stock'),
        ])

        const todayStr = new Date().toDateString()
        const todayAppointments = appointments.data.data.filter(
          (appt) => new Date(appt.appointmentDate).toDateString() === todayStr
        ).length

        const revenue = bills.data.data
          .filter((bill) => bill.status === 'paid')
          .reduce((sum, bill) => sum + bill.totalAmount, 0)

        setStats({
          patients: patients.data.data.length,
          todayAppointments,
          revenue,
          pharmacyAlerts: lowStock.data.data.length,
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
    { label: 'Total Patients', value: stats.patients, color: 'success', icon: '🤒' },
    { label: "Today's Appointments", value: stats.todayAppointments, color: 'warning', icon: '📅' },
    { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, color: 'primary', icon: '💰' },
    { label: 'Pharmacy Alerts', value: stats.pharmacyAlerts, color: 'danger', icon: '⚠️' },
  ]

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4">📊 Admin Dashboard</h4>

          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="row g-4">
              {cards.map((card) => (
                <div className="col-md-3" key={card.label}>
                  <div className={`card border-${card.color} shadow-sm`}>
                    <div className="card-body text-center">
                      <div style={{ fontSize: '2rem' }}>{card.icon}</div>
                      <h2 className={`text-${card.color} fw-bold`}>{card.value}</h2>
                      <p className="text-muted mb-0">{card.label}</p>
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