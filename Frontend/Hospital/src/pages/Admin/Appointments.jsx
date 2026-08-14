import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    doctorId: '', patientId: '',
    appointmentDate: '', timeSlot: '', reason: ''
  })
  const [showForm, setShowForm] = useState(false)

  // Fetch all data
  const fetchAll = async () => {
    try {
      const [apptRes, docRes, patRes] = await Promise.all([
        api.get('/all-appointment'),
        api.get('/all-doctor'),
        api.get('/all-patient'),
      ])
      setAppointments(apptRes.data.data)
      setDoctors(docRes.data.data)
      setPatients(patRes.data.data)
    } catch (err) {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Appointment book karo
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/book-appointment', formData)
      if (res.data.success) {
        setShowForm(false)
        setFormData({
          doctorId: '', patientId: '',
          appointmentDate: '', timeSlot: '', reason: ''
        })
        fetchAll()
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to book appointment')
    }
  }

  // Status update karo
  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/update-appointment/${id}`, { status })
      fetchAll()
    } catch (err) {
      setError('Failed to update status')
    }
  }

  // Status badge color
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

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>📅 Appointments</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Book Appointment'}
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Book Appointment Form */}
          {showForm && (
            <div className="card p-4 mb-4 shadow-sm">
              <h5 className="mb-3">Book Appointment</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">

                  {/* Doctor select */}
                  <div className="col-md-6">
                    <label className="form-label">Doctor</label>
                    <select name="doctorId" className="form-select"
                      onChange={handleChange} required>
                      <option value="">Select Doctor</option>
                      {doctors.map(doc => (
                        <option key={doc._id} value={doc._id}>
                          {doc.userId?.name} — {doc.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Patient select */}
                  <div className="col-md-6">
                    <label className="form-label">Patient</label>
                    <select name="patientId" className="form-select"
                      onChange={handleChange} required>
                      <option value="">Select Patient</option>
                      {patients.map(pat => (
                        <option key={pat._id} value={pat._id}>
                          {pat.userId?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Date</label>
                    <input name="appointmentDate" type="date"
                      className="form-control" onChange={handleChange} required />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Time Slot</label>
                    <input name="timeSlot" className="form-control"
                      placeholder="e.g. 10:00 - 10:30"
                      onChange={handleChange} required />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Reason</label>
                    <input name="reason" className="form-control"
                      placeholder="Reason for visit"
                      onChange={handleChange} />
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-success">
                      Book Appointment
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Appointments Table */}
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
                    <th>Doctor</th>
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
                      <td colSpan="8" className="text-center text-muted">
                        No appointments found
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt, index) => (
                      <tr key={appt._id}>
                        <td>{index + 1}</td>
                        <td>{appt.patientId?.userId?.name}</td>
                        <td>{appt.doctorId?.userId?.name}</td>
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