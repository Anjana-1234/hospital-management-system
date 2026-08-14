import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    appointments: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/all-appointment')
        const all = res.data.data

        setStats({
          appointments: all.length,
          completed: all.filter(a => a.status === 'completed').length,
          pending: all.filter(a => a.status === 'pending').length,
          cancelled: all.filter(a => a.status === 'cancelled').length,
        })
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Appointments', value: stats.appointments, color: 'primary', icon: '📅' },
    { label: 'Completed', value: stats.completed, color: 'success', icon: '✅' },
    { label: 'Pending', value: stats.pending, color: 'warning', icon: '⏳' },
    { label: 'Cancelled', value: stats.cancelled, color: 'danger', icon: '❌' },
  ]

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          <h4 className="mb-4">📊 Doctor Dashboard</h4>

          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="row g-4">
              {cards.map((card) => (
                <div className="col-md-3" key={card.label}>
                  <div className={`card border-${card.color} shadow-sm`}>
                    <div className="card-body text-center">
                      <div style={{ fontSize: '2rem' }}>{card.icon}</div>
                      <h2 className={`text-${card.color} fw-bold`}>{card.value}</h2>
                      <p className="text-muted mb-0">{card.label}</p>
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

export default Dashboard