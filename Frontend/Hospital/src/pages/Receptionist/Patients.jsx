import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const emptyForm = {
  name: '', email: '',
  age: '', gender: 'male',
  bloodGroup: 'A+', phone: '', address: ''
}

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Fetch all patients
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

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  // Add or update patient
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = editingId
        ? await api.put(`/update-patient/${editingId}`, formData)
        : await api.post('/add-patient', formData)

      if (res.data.success) {
        resetForm()
        fetchPatients()
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError(editingId ? 'Failed to update patient' : 'Failed to add patient')
    }
  }

  // Prefill form for editing
  const handleEditClick = (patient) => {
    setFormData({
      name: patient.name || '',
      email: patient.email || '',
      age: patient.age || '',
      gender: patient.gender || 'male',
      bloodGroup: patient.bloodGroup || 'A+',
      phone: patient.phone || '',
      address: patient.address || ''
    })
    setEditingId(patient._id)
    setShowForm(true)
  }

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4><i className="bi bi-person-plus me-2"></i>Patients</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => showForm ? resetForm() : setShowForm(true)}
            >
              {showForm ? 'Cancel' : '+ Add Patient'}
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Add / Edit Patient Form */}
          {showForm && (
            <div className="card p-4 mb-4 shadow-sm">
              <h5 className="mb-3">{editingId ? 'Edit Patient' : 'Add New Patient'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <input name="name" className="form-control"
                      placeholder="Name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <input name="email" type="email" className="form-control"
                      placeholder="Email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <input name="age" type="number" className="form-control"
                      placeholder="Age" value={formData.age} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select name="bloodGroup" className="form-select" value={formData.bloodGroup} onChange={handleChange}>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input name="phone" className="form-control"
                      placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="col-md-12">
                    <input name="address" className="form-control"
                      placeholder="Address" value={formData.address} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-success">
                      {editingId ? 'Update Patient' : 'Save Patient'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Search */}
          <div className="mb-3" style={{ maxWidth: '360px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Patients Table */}
          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
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
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No patients found
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient, index) => (
                      <tr key={patient._id}>
                        <td>{index + 1}</td>
                        <td>{patient.name}</td>
                        <td>{patient.email}</td>
                        <td>{patient.age}</td>
                        <td className="text-capitalize">{patient.gender}</td>
                        <td>{patient.bloodGroup}</td>
                        <td>{patient.phone}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEditClick(patient)}
                          >
                            <i className="bi bi-pencil me-1"></i>Edit
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
