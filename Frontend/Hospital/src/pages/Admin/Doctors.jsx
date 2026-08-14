import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    specialization: '', experience: '',
    consultationFee: '', availableDays: [],
  })
  const [showForm, setShowForm] = useState(false)

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  // Saare doctors fetch karo
  const fetchDoctors = async () => {
    try {
      const res = await api.get('/all-doctor')
      setDoctors(res.data.data)
    } catch (err) {
      setError('Failed to fetch doctors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Days checkbox handle
  const handleDayChange = (day) => {
    const updated = formData.availableDays.includes(day)
      ? formData.availableDays.filter(d => d !== day)
      : [...formData.availableDays, day]
    setFormData({ ...formData, availableDays: updated })
  }

  // Doctor add karo
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/add-doctor', formData)
      if (res.data.success) {
        setShowForm(false)
        setFormData({
          name: '', email: '', password: '',
          specialization: '', experience: '',
          consultationFee: '', availableDays: [],
        })
        fetchDoctors()
      }
    } catch (err) {
      setError('Failed to add doctor')
    }
  }

  // Doctor delete karo
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await api.delete(`/delete/${id}`)
      fetchDoctors()
    } catch (err) {
      setError('Failed to delete doctor')
    }
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>👨‍⚕️ Doctors</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Doctor'}
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Add Doctor Form */}
          {showForm && (
            <div className="card p-4 mb-4 shadow-sm">
              <h5 className="mb-3">Add New Doctor</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <input name="name" className="form-control"
                      placeholder="Name" onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <input name="email" type="email" className="form-control"
                      placeholder="Email" onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <input name="password" type="password" className="form-control"
                      placeholder="Password" onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <input name="specialization" className="form-control"
                      placeholder="Specialization" onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <input name="experience" type="number" className="form-control"
                      placeholder="Experience (years)" onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <input name="consultationFee" type="number" className="form-control"
                      placeholder="Consultation Fee" onChange={handleChange} required />
                  </div>

                  {/* Available Days */}
                  <div className="col-12">
                    <label className="form-label">Available Days</label>
                    <div className="d-flex flex-wrap gap-2">
                      {days.map(day => (
                        <div key={day} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.availableDays.includes(day)}
                            onChange={() => handleDayChange(day)}
                          />
                          <label className="form-check-label">{day}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-success">
                      Save Doctor
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Doctors Table */}
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Fee</th>
                    <th>Available</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No doctors found
                      </td>
                    </tr>
                  ) : (
                    doctors.map((doc, index) => (
                      <tr key={doc._id}>
                        <td>{index + 1}</td>
                        <td>{doc.userId?.name}</td>
                        <td>{doc.userId?.email}</td>
                        <td>{doc.specialization}</td>
                        <td>{doc.experience} yrs</td>
                        <td>₹{doc.consultationFee}</td>
                        <td>
                          <span className={`badge ${doc.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                            {doc.isAvailable ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(doc._id)}
                          >
                            Delete
                          </button>
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

export default Doctors