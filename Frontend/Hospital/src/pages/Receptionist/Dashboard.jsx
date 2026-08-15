import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    todaysAppointments: 0,
    patientsRegisteredToday: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [apptRes, patRes] = await Promise.all([
          api.get('/all-appointment'),
          api.get('/all-patient'),
        ])

        const today = new Date().toDateString()
        const appointments = apptRes.data.data || []
        const patients = patRes.data.data || []

        setStats({
          todaysAppointments: appointments.filter(
            (a) => new Date(a.appointmentDate).toDateString() === today
          ).length,
          patientsRegisteredToday: patients.filter(
            (p) => new Date(p.createdAt).toDateString() === today
          ).length,
        })
      } catch (err) {
        setError('Failed to fetch dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    { label: "Today's Appointments", value: stats.todaysAppointments, color: 'primary', icon: 'bi-calendar-check' },
    { label: 'Patients Registered Today', value: stats.patientsRegisteredToday, color: 'success', icon: 'bi-person-plus' },
  ]

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4">Receptionist Dashboard</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Quick actions */}
          <div className="d-flex gap-3 mb-4">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/receptionist/patients')}
            >
              <i className="bi bi-person-plus me-2"></i>Register Patient
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/receptionist/appointments')}
            >
              <i className="bi bi-calendar-plus me-2"></i>Book Appointment
            </button>
          </div>

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
