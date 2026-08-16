import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dispensingId, setDispensingId] = useState(null)

  const fetchPrescriptions = async () => {
    setLoading(true)
    try {
      const res = await api.get('/pending-prescriptions')
      setPrescriptions(res.data.data || [])
    } catch (err) {
      setError('Failed to fetch pending prescriptions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const handleDispense = async (id) => {
    setError('')
    setDispensingId(id)
    try {
      const res = await api.put(`/dispense-prescription/${id}`)
      if (res.data.success) {
        fetchPrescriptions()
      } else {
        setError(res.data.message || 'Failed to dispense prescription')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispense prescription')
    } finally {
      setDispensingId(null)
    }
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4"><i className="bi bi-prescription2 me-2"></i>Pending Prescriptions</h4>

          {error && <div className="alert alert-danger">{error}</div>}

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
                    <th>Medicines</th>
                    <th>Diagnosis</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No pending prescriptions
                      </td>
                    </tr>
                  ) : (
                    prescriptions.map((presc, index) => (
                      <tr key={presc._id}>
                        <td>{index + 1}</td>
                        <td>{presc.patientId?.name || '—'}</td>
                        <td>
                          <ul className="mb-0 ps-3">
                            {presc.medicines?.map((med, i) => (
                              <li key={i}>
                                {med.name} {med.dosage && `(${med.dosage})`} — Qty: {med.quantity ?? 1}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>{presc.diagnosis || '—'}</td>
                        <td>{new Date(presc.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className="badge bg-warning text-dark">{presc.status}</span>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm text-nowrap"
                            disabled={dispensingId === presc._id}
                            onClick={() => handleDispense(presc._id)}
                          >
                            {dispensingId === presc._id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <>
                                <i className="bi bi-capsule me-1"></i>Dispense
                              </>
                            )}
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
