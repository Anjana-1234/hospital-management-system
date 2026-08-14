import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Bills = () => {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

 const fetchBills = async () => {
    try {
      const res = await api.get('/all-bill')
      console.log(res.data) // ← yeh add karo temporarily
      setBills(res.data.data || [])
    } catch (err) {
      setError('Failed to fetch bills')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBills()
  }, [])

  const statusColor = {
    pending: 'warning',
    paid: 'success',
    cancelled: 'danger',
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4">💰 My Bills</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : bills.length === 0 ? (
            <div className="alert alert-info">No bills found</div>
          ) : (
            <div className="row g-4">
              {bills.map((bill, index) => (
                <div className="col-md-6" key={bill._id}>
                  <div className="card shadow-sm h-100">
                    <div className={`card-header bg-${statusColor[bill.status]} text-white d-flex justify-content-between`}>
                      <span>🧾 Bill #{index + 1}</span>
                      <span className="badge bg-white text-dark">
                        {bill.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="card-body">

                      {/* Items */}
                      <table className="table table-sm table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Description</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bill.items.map((item, i) => (
                            <tr key={i}>
                              <td>{item.description}</td>
                              <td>₹{item.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Total */}
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <strong>Total Amount:</strong>
                        <span className="fs-5 fw-bold text-primary">
                          ₹{bill.totalAmount}
                        </span>
                      </div>

                      {/* Paid At */}
                      {bill.paidAt && (
                        <p className="text-success mt-2 mb-0">
                          <strong>Paid At:</strong>{' '}
                          {new Date(bill.paidAt).toLocaleDateString()}
                        </p>
                      )}

                      {/* Created At */}
                      <p className="text-muted mt-1 mb-0" style={{ fontSize: '0.85rem' }}>
                        Generated: {new Date(bill.createdAt).toLocaleDateString()}
                      </p>

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

export default Bills