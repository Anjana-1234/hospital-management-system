import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Dashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/all-appointment')
        const all = res.data.data || []

        const today = new Date().toDateString()
        const todays = all.filter((a) => new Date(a.appointmentDate).toDateString() === today)

        setAppointments(todays)
      } catch (err) {
        setError('Failed to fetch appointments')
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const statusColor = {
    pending: 'warning',
    confirmed: 'primary',
    completed: 'success',
    cancelled: 'danger',
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4">Nurse Dashboard</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <>
              <div className="row g-4 mb-4">
                <div className="col-md-4">
                  <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                    <div className="stat-card-icon" style={{ color: 'var(--color-primary)' }}>
                      <i className="bi bi-calendar-check"></i>
                    </div>
                    <div>
                      <h2 className="stat-card-value">{appointments.length}</h2>
                      <p className="stat-card-label">Today's Appointments</p>
                    </div>
                  </div>
                </div>
              </div>

              <h5 className="mb-3">Today's Appointments — All Doctors</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Patient</th>
                      <th>Doctor Specialization</th>
                      <th>Time Slot</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          No appointments today
                        </td>
                      </tr>
                    ) : (
                      appointments.map((appt, index) => (
                        <tr key={appt._id}>
                          <td>{index + 1}</td>
                          <td>{appt.patientId?.name}</td>
                          <td>{appt.doctorId?.specialization || '—'}</td>
                          <td>{appt.timeSlot}</td>
                          <td>
                            <span className={`badge bg-${statusColor[appt.status]}`}>
                              {appt.status}
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

        </div>
      </div>
    </>
  )
}

export default Dashboard
