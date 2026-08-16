import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const PatientView = () => {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [records, setRecords] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState('')
  const [noteText, setNoteText] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

  const fetchDetails = async (patientId) => {
    setDetailLoading(true)
    try {
      const [historyRes, notesRes] = await Promise.all([
        api.get(`/patient-history/${patientId}`),
        api.get(`/patient-notes/${patientId}`),
      ])
      setRecords(historyRes.data.data || [])
      setNotes(notesRes.data.data || [])
    } catch (err) {
      setError('Failed to fetch patient details')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
    setNoteText('')
    fetchDetails(patient._id)
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!noteText.trim()) return
    setSubmitting(true)
    try {
      const res = await api.post('/add-patient-note', {
        patientId: selectedPatient._id,
        note: noteText
      })
      if (res.data.success) {
        setNoteText('')
        fetchDetails(selectedPatient._id)
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to add note')
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

          <h4 className="mb-4"><i className="bi bi-clipboard-heart me-2"></i>Patients</h4>

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

            {/* Patient detail panel */}
            <div className="col-md-8">
              {!selectedPatient ? (
                <div className="card p-4 shadow-sm text-center text-muted">
                  Select a patient to view their record
                </div>
              ) : (
                <>
                  <div className="card p-4 shadow-sm mb-4">
                    <div className="mb-3">
                      <h5 className="mb-0">{selectedPatient.name}</h5>
                      <span className="small text-muted">{selectedPatient.email}</span>
                    </div>

                    <h6 className="mb-2">Medical History</h6>
                    {detailLoading ? (
                      <div className="d-flex justify-content-center mt-3">
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

                  <div className="card p-4 shadow-sm">
                    <h6 className="mb-3">Nurse Notes</h6>

                    {detailLoading ? (
                      <div className="d-flex justify-content-center mt-3">
                        <div className="spinner-border text-primary" />
                      </div>
                    ) : (
                      <div className="mb-3" style={{ maxHeight: '260px', overflowY: 'auto' }}>
                        {notes.length === 0 ? (
                          <p className="text-muted text-center mb-0">No notes yet</p>
                        ) : (
                          notes.map((n) => (
                            <div key={n._id} className="border rounded p-2 mb-2" style={{ borderColor: 'var(--color-border)' }}>
                              <div className="d-flex justify-content-between">
                                <span className="fw-semibold small">{n.addedBy?.name || '—'}</span>
                                <span className="small text-muted">{new Date(n.date).toLocaleString()}</span>
                              </div>
                              <p className="mb-0 mt-1">{n.note}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    <form onSubmit={handleAddNote}>
                      <label className="form-label">Add Note</label>
                      <textarea
                        className="form-control mb-2"
                        rows={2}
                        placeholder="Vitals, observations, etc."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        required
                      />
                      <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add Note'}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </>
  )
}

export default PatientView
