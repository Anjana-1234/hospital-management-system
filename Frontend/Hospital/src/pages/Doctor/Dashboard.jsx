import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingLabResults: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [apptRes, labRes] = await Promise.all([
          api.get('/all-appointment'),
          api.get('/my-lab-requests'),
        ])

        const appointments = apptRes.data.data || []
        const labRequests = labRes.data.data || []

        const today = new Date().toDateString()
        const todayAppointments = appointments.filter(
          (a) => new Date(a.appointmentDate).toDateString() === today
        ).length
        const pendingLabResults = labRequests.filter(
          (l) => l.status === 'requested' || l.status === 'collected'
        ).length

        setStats({ todayAppointments, pendingLabResults })
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    { label: "Today's Appointments", value: stats.todayAppointments, color: 'primary', icon: 'bi-calendar-check' },
    { label: 'Pending Lab Results', value: stats.pendingLabResults, color: 'warning', icon: 'bi-flask' },
  ]

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4">Doctor Dashboard</h4>

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

              <div className="col-md-4">
                <Link to="/doctor/patient-history" className="stat-card text-decoration-none" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                  <div className="stat-card-icon" style={{ color: 'var(--color-primary)' }}>
                    <i className="bi bi-search"></i>
                  </div>
                  <div>
                    <h2 className="stat-card-value" style={{ fontSize: '1.1rem' }}>Search Patients</h2>
                    <p className="stat-card-label">View patient history</p>
                  </div>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default Dashboard
