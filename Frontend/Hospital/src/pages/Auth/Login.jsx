import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/login', { email, password })

      if (res.data.success) {
        login(res.data.token)

        // Role ke hisaab se redirect karo
        const role = res.data.data.role
        if (role === 'admin') navigate('/admin/dashboard')
        else if (role === 'doctor') navigate('/doctor/dashboard')
        else if (role === 'patient') navigate('/patient/dashboard')

      } else {
        setError(res.data.message)
      }

    } catch (err) {
      setError('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '400px' }}>

        {/* Header */}
        <h3 className="text-center mb-1">🏥 HMS</h3>
        <p className="text-center text-muted mb-4">Hospital Management System</p>

        {/* Error */}
        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center mt-3 mb-0">
          Don't have an account?{' '}
          <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  )
}

export default Login