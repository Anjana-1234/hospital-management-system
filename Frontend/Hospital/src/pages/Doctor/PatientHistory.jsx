import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const PatientHistory = () => {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    diagnosis: '',
    prescriptionNotes: '',
    treatmentNotes: ''
  })

  const fetchPatients = async () => {
    try {
      const res = await api.get('/all-patient')
      setPatients(res.data.data || [])
    } catch (err) {
      setError('Failed to fetch patients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchHistory = async (patientId) => {
    setHistoryLoading(true)
    try {
      const res = await api.get(`/patient-history/${patientId}`)
      setRecords(res.data.data || [])
    } catch (err) {
      setError('Failed to fetch patient history')
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
    setShowForm(false)
    fetchHistory(patient._id)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.post('/add-medical-record', {
        patientId: selectedPatient._id,
        ...formData
      })
      if (res.data.success) {
        setShowForm(false)
        setFormData({ diagnosis: '', prescriptionNotes: '', treatmentNotes: '' })
        fetchHistory(selectedPatient._id)
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to add medical record')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4"><i className="bi bi-clipboard2-pulse me-2"></i>Patient History</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row g-4">

            {/* Patient search / list */}
            <div className="col-md-4">
              <div className="card p-3 shadow-sm">
                <label className="form-label">Search Patient</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {loading ? (
                  <div className="d-flex justify-content-center mt-3">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : (
                  <div className="list-group" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                    {filteredPatients.length === 0 ? (
                      <p className="text-muted text-center mt-2">No patients found</p>
                    ) : (
                      filteredPatients.map((p) => (
                        <button
                          type="button"
                          key={p._id}
                          className={`list-group-item list-group-item-action ${selectedPatient?._id === p._id ? 'active' : ''}`}
                          onClick={() => handleSelectPatient(p)}
                        >
                          <div className="fw-semibold">{p.name}</div>
                          <div className="small text-muted">{p.email}</div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* History panel */}
            <div className="col-md-8">
              {!selectedPatient ? (
                <div className="card p-4 shadow-sm text-center text-muted">
                  Select a patient to view their medical record history
                </div>
              ) : (
                <div className="card p-4 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="mb-0">{selectedPatient.name}</h5>
                      <span className="small text-muted">{selectedPatient.email}</span>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setShowForm(!showForm)}
                    >
                      {showForm ? 'Cancel' : '+ Add New Record'}
                    </button>
                  </div>

                  {showForm && (
                    <form onSubmit={handleSubmit} className="mb-4 border rounded p-3" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label">Diagnosis</label>
                          <input
                            name="diagnosis"
                            className="form-control"
                            placeholder="Diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Prescription Notes</label>
                          <textarea
                            name="prescriptionNotes"
                            className="form-control"
                            rows={2}
                            placeholder="Prescription notes"
                            value={formData.prescriptionNotes}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Treatment Notes</label>
                          <textarea
                            name="treatmentNotes"
                            className="form-control"
                            rows={2}
                            placeholder="Treatment notes"
                            value={formData.treatmentNotes}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-success" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Record'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {historyLoading ? (
                    <div className="d-flex justify-content-center mt-4">
                      <div className="spinner-border text-primary" />
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Diagnosis</th>
                            <th>Prescription Notes</th>
                            <th>Treatment Notes</th>
                            <th>Doctor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {records.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center text-muted">
                                No medical records found
                              </td>
                            </tr>
                          ) : (
                            records.map((rec) => (
                              <tr key={rec._id}>
                                <td>{new Date(rec.date).toLocaleDateString()}</td>
                                <td>{rec.diagnosis || '—'}</td>
                                <td>{rec.prescriptionNotes || '—'}</td>
                                <td>{rec.treatmentNotes || '—'}</td>
                                <td>{rec.doctorId?.name || '—'}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </>
  )
}

export default PatientHistory
