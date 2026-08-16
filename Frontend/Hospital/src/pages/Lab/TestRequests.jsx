import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const TestRequests = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [resultFormId, setResultFormId] = useState(null)
  const [resultText, setResultText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchTests = async () => {
    setLoading(true)
    try {
      const query = filter === 'all' ? '' : `?status=${filter}`
      const res = await api.get(`/all-lab-tests${query}`)
      setTests(res.data.data || [])
    } catch (err) {
      setError('Failed to fetch lab tests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTests()
  }, [filter])

  const handleMarkCollected = async (id) => {
    try {
      const res = await api.put(`/update-lab-test/${id}`, { status: 'collected' })
      if (res.data.success) {
        fetchTests()
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to update status')
    }
  }

  const openResultForm = (id) => {
    setResultFormId(id)
    setResultText('')
  }

  const handleSubmitResult = async (e, id) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.put(`/update-lab-test/${id}`, { status: 'completed', result: resultText })
      if (res.data.success) {
        setResultFormId(null)
        setResultText('')
        fetchTests()
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to submit result')
    } finally {
      setSubmitting(false)
    }
  }

  const statusColor = {
    requested: 'warning',
    collected: 'primary',
    completed: 'success',
  }

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'requested', label: 'Requested' },
    { key: 'collected', label: 'Collected' },
    { key: 'completed', label: 'Completed' },
  ]

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4"><i className="bi bi-flask me-2"></i>Test Requests</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <ul className="nav nav-tabs mb-3">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link ${filter === tab.key ? 'active' : ''}`}
                  onClick={() => setFilter(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

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
                    <th>Requested By</th>
                    <th>Status</th>
                    <th>Result</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No lab test requests found
                      </td>
                    </tr>
                  ) : (
                    tests.map((test, index) => (
                      <tr key={test._id}>
                        <td>{index + 1}</td>
                        <td>{test.patientId?.name}</td>
                        <td>{test.testType}</td>
                        <td>{test.requestedBy?.name || '—'}</td>
                        <td>
                          <span className={`badge bg-${statusColor[test.status]}`}>
                            {test.status}
                          </span>
                        </td>
                        <td>{test.status === 'completed' ? (test.result || '—') : '—'}</td>
                        <td>{new Date(test.date).toLocaleDateString()}</td>
                        <td>
                          {test.status === 'requested' && (
                            <button
                              className="btn btn-primary btn-sm text-nowrap"
                              onClick={() => handleMarkCollected(test._id)}
                            >
                              Mark Collected
                            </button>
                          )}

                          {test.status === 'collected' && resultFormId !== test._id && (
                            <button
                              className="btn btn-success btn-sm text-nowrap"
                              onClick={() => openResultForm(test._id)}
                            >
                              Enter Result
                            </button>
                          )}

                          {test.status === 'collected' && resultFormId === test._id && (
                            <form onSubmit={(e) => handleSubmitResult(e, test._id)} className="d-flex gap-2">
                              <textarea
                                className="form-control form-control-sm"
                                rows={1}
                                placeholder="Result"
                                value={resultText}
                                onChange={(e) => setResultText(e.target.value)}
                                required
                              />
                              <button type="submit" className="btn btn-success btn-sm text-nowrap" disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                disabled={submitting}
                                onClick={() => setResultFormId(null)}
                              >
                                Cancel
                              </button>
                            </form>
                          )}

                          {test.status === 'completed' && (
                            <span className="text-muted small">—</span>
                          )}
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

export default TestRequests
