import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const LabRequests = () => {
  const [patients, setPatients] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    patientId: '',
    testType: ''
  })

  const fetchAll = async () => {
    try {
      const [patRes, reqRes] = await Promise.all([
        api.get('/all-patient'),
        api.get('/my-lab-requests'),
      ])
      setPatients(patRes.data.data || [])
      setRequests(reqRes.data.data || [])
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const res = await api.post('/request-lab-test', formData)
      if (res.data.success) {
        setSuccess('Lab test requested successfully')
        setFormData({ patientId: '', testType: '' })
        fetchAll()
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to request lab test')
    }
  }

  const statusColor = {
    requested: 'warning',
    collected: 'primary',
    completed: 'success',
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4"><i className="bi bi-flask me-2"></i>Lab Requests</h4>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Request New Test */}
          <div className="card p-4 mb-4 shadow-sm">
            <h5 className="mb-3">Request New Test</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-5">
                  <label className="form-label">Patient</label>
                  <select
                    name="patientId"
                    className="form-select"
                    value={formData.patientId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((pat) => (
                      <option key={pat._id} value={pat._id}>
                        {pat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-5">
                  <label className="form-label">Test Type</label>
                  <input
                    name="testType"
                    className="form-control"
                    placeholder="e.g. Complete Blood Count"
                    value={formData.testType}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-2 d-flex align-items-end">
                  <button type="submit" className="btn btn-primary w-100">
                    Request
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* My Requests */}
          <h5 className="mb-3">My Requests</h5>
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
                    <th>Patient</th>
                    <th>Test Type</th>
                    <th>Status</th>
                    <th>Result</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No lab requests found
                      </td>
                    </tr>
                  ) : (
                    requests.map((req, index) => (
                      <tr key={req._id}>
                        <td>{index + 1}</td>
                        <td>{req.patientId?.name}</td>
                        <td>{req.testType}</td>
                        <td>
                          <span className={`badge bg-${statusColor[req.status]}`}>
                            {req.status}
                          </span>
                        </td>
                        <td>{req.status === 'completed' ? (req.result || '—') : '—'}</td>
                        <td>{new Date(req.date).toLocaleDateString()}</td>
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

export default LabRequests
