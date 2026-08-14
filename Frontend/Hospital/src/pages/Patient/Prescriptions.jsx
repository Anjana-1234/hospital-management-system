import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get('/all-prescription')
        console.log(res.data) // ← pehle check karo
      setPrescriptions(res.data.data || [])
    } catch (err) {
      setError('Failed to fetch prescriptions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4">💊 My Prescriptions</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="alert alert-info">No prescriptions found</div>
          ) : (
            <div className="row g-4">
              {prescriptions.map((pres, index) => (
                <div className="col-md-6" key={pres._id}>
                  <div className="card shadow-sm h-100">
                    <div className="card-header bg-primary text-white d-flex justify-content-between">
                      <span>💊 Prescription #{index + 1}</span>
                      <span>{new Date(pres.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="card-body">

                      {/* Doctor */}
                      <p className="mb-1">
                        <strong>Doctor:</strong> {pres.doctorId?.userId?.name || '—'}
                      </p>

                      {/* Diagnosis */}
                      <p className="mb-1">
                        <strong>Diagnosis:</strong> {pres.diagnosis || '—'}
                      </p>

                      {/* Medicines */}
                      <div className="mt-3">
                        <strong>Medicines:</strong>
                        <table className="table table-sm table-bordered mt-2">
                          <thead className="table-light">
                            <tr>
                              <th>Name</th>
                              <th>Dosage</th>
                              <th>Frequency</th>
                              <th>Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pres.medicines.map((med, i) => (
                              <tr key={i}>
                                <td>{med.name}</td>
                                <td>{med.dosage || '—'}</td>
                                <td>{med.frequency || '—'}</td>
                                <td>{med.duration || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Advice */}
                      {pres.advice && (
                        <p className="mb-1">
                          <strong>Advice:</strong> {pres.advice}
                        </p>
                      )}

                      {/* Follow Up */}
                      {pres.followUpDate && (
                        <p className="mb-0 text-success">
                          <strong>Follow Up:</strong>{' '}
                          {new Date(pres.followUpDate).toLocaleDateString()}
                        </p>
                      )}

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default Prescriptions