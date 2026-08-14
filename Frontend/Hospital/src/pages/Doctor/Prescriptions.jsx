import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    appointmentId: '',
    doctorId: '',
    patientId: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    diagnosis: '',
    advice: '',
    followUpDate: ''
  })
  const [showForm, setShowForm] = useState(false)

  const fetchAll = async () => {
    try {
      const [presRes, patRes, apptRes] = await Promise.all([
        api.get('/all-prescription'),
        api.get('/all-patient'),
        api.get('/all-appointment'),
      ])
      setPrescriptions(presRes.data.data)
      setPatients(patRes.data.data)
      setAppointments(apptRes.data.data)
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

  // Medicine change karo
  const handleMedicineChange = (index, e) => {
    const updated = [...formData.medicines]
    updated[index][e.target.name] = e.target.value
    setFormData({ ...formData, medicines: updated })
  }

  // Medicine add karo
  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: '', dosage: '', frequency: '', duration: '' }]
    })
  }

  // Medicine remove karo
  const removeMedicine = (index) => {
    const updated = formData.medicines.filter((_, i) => i !== index)
    setFormData({ ...formData, medicines: updated })
  }

  // Prescription add karo
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/add-prescription', formData)
      if (res.data.success) {
        setShowForm(false)
        setFormData({
          appointmentId: '',
          doctorId: '',
          patientId: '',
          medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
          diagnosis: '',
          advice: '',
          followUpDate: ''
        })
        fetchAll()
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to add prescription')
    }
  }

  // Delete karo
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await api.delete(`/delete-prescription/${id}`)
      fetchAll()
    } catch (err) {
      setError('Failed to delete prescription')
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
            <h4>💊 Prescriptions</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Prescription'}
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Add Prescription Form */}
          {showForm && (
            <div className="card p-4 mb-4 shadow-sm">
              <h5 className="mb-3">Add Prescription</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">

                  {/* Appointment select */}
                  <div className="col-md-6">
                    <label className="form-label">Appointment</label>
                    <select name="appointmentId" className="form-select"
                      onChange={handleChange} required>
                      <option value="">Select Appointment</option>
                      {appointments.map(appt => (
                        <option key={appt._id} value={appt._id}>
                          {appt.patientId?.userId?.name} — {new Date(appt.appointmentDate).toLocaleDateString()}
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

                  {/* Medicines */}
                  <div className="col-12">
                    <label className="form-label">Medicines</label>
                    {formData.medicines.map((med, index) => (
                      <div key={index} className="row g-2 mb-2">
                        <div className="col-md-3">
                          <input name="name" className="form-control"
                            placeholder="Medicine name"
                            value={med.name}
                            onChange={(e) => handleMedicineChange(index, e)}
                            required />
                        </div>
                        <div className="col-md-3">
                          <input name="dosage" className="form-control"
                            placeholder="Dosage (e.g. 500mg)"
                            value={med.dosage}
                            onChange={(e) => handleMedicineChange(index, e)} />
                        </div>
                        <div className="col-md-3">
                          <input name="frequency" className="form-control"
                            placeholder="Frequency (e.g. Twice a day)"
                            value={med.frequency}
                            onChange={(e) => handleMedicineChange(index, e)} />
                        </div>
                        <div className="col-md-2">
                          <input name="duration" className="form-control"
                            placeholder="Duration (e.g. 7 days)"
                            value={med.duration}
                            onChange={(e) => handleMedicineChange(index, e)} />
                        </div>
                        {formData.medicines.length > 1 && (
                          <div className="col-md-1">
                            <button type="button"
                              className="btn btn-danger btn-sm w-100"
                              onClick={() => removeMedicine(index)}>
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={addMedicine}>
                      + Add Medicine
                    </button>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Diagnosis</label>
                    <input name="diagnosis" className="form-control"
                      placeholder="Diagnosis" onChange={handleChange} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Follow Up Date</label>
                    <input name="followUpDate" type="date"
                      className="form-control" onChange={handleChange} />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Advice</label>
                    <textarea name="advice" className="form-control"
                      placeholder="Advice for patient"
                      rows={2} onChange={handleChange} />
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-success">
                      Save Prescription
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Prescriptions Table */}
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
                    <th>Diagnosis</th>
                    <th>Medicines</th>
                    <th>Advice</th>
                    <th>Follow Up</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No prescriptions found
                      </td>
                    </tr>
                  ) : (
                    prescriptions.map((pres, index) => (
                      <tr key={pres._id}>
                        <td>{index + 1}</td>
                        <td>{pres.patientId?.userId?.name}</td>
                        <td>{pres.diagnosis || '—'}</td>
                        <td>
                          {pres.medicines.map((med, i) => (
                            <div key={i}>
                              <strong>{med.name}</strong> — {med.dosage} — {med.frequency} — {med.duration}
                            </div>
                          ))}
                        </td>
                        <td>{pres.advice || '—'}</td>
                        <td>
                          {pres.followUpDate
                            ? new Date(pres.followUpDate).toLocaleDateString()
                            : '—'}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(pres._id)}
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

export default Prescriptions