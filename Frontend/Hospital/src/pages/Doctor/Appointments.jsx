import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/all-appointment')
      setAppointments(res.data.data)
    } catch (err) {
      setError('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  // Status update karo
  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/update-appointment/${id}`, { status })
      fetchAppointments()
    } catch (err) {
      setError('Failed to update status')
    }
  }

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

          <h4 className="mb-4">📅 My Appointments</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No appointments found
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt, index) => (
                      <tr key={appt._id}>
                        <td>{index + 1}</td>
                        <td>{appt.patientId?.userId?.name}</td>
                        <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                        <td>{appt.timeSlot}</td>
                        <td>{appt.reason || '—'}</td>
                        <td>
                          <span className={`badge bg-${statusColor[appt.status]}`}>
                            {appt.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={appt.status}
                            onChange={(e) => handleStatusUpdate(appt._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default Appointments