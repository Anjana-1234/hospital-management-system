import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    age: '', gender: 'male',
    bloodGroup: 'A+', phone: '', address: ''
  })
  const [showForm, setShowForm] = useState(false)

  // Saare patients fetch karo
  const fetchPatients = async () => {
    try {
      const res = await api.get('/all-patient')
      setPatients(res.data.data)
    } catch (err) {
      setError('Failed to fetch patients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Patient add karo
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/add-patient', formData)
      if (res.data.success) {
        setShowForm(false)
        setFormData({
          name: '', email: '', password: '',
          age: '', gender: 'male',
          bloodGroup: 'A+', phone: '', address: ''
        })
        fetchPatients()
      }
    } catch (err) {
      setError('Failed to add patient')
    }
  }

  // Patient delete karo
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await api.delete(`/delete-patient/${id}`)
      fetchPatients()
    } catch (err) {
      setError('Failed to delete patient')
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
            <h4>🤒 Patients</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Patient'}
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Add Patient Form */}
          {showForm && (
            <div className="card p-4 mb-4 shadow-sm">
              <h5 className="mb-3">Add New Patient</h5>
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
                    <input name="age" type="number" className="form-control"
                      placeholder="Age" onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <select name="gender" className="form-select" onChange={handleChange}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select name="bloodGroup" className="form-select" onChange={handleChange}>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input name="phone" className="form-control"
                      placeholder="Phone" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <input name="address" className="form-control"
                      placeholder="Address" onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-success">
                      Save Patient
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Patients Table */}
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
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Blood Group</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No patients found
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient, index) => (
                      <tr key={patient._id}>
                        <td>{index + 1}</td>
                        <td>{patient.userId?.name}</td>
                        <td>{patient.userId?.email}</td>
                        <td>{patient.age}</td>
                        <td className="text-capitalize">{patient.gender}</td>
                        <td>{patient.bloodGroup}</td>
                        <td>{patient.phone}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(patient._id)}
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

export default Patients