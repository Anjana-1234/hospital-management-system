import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await api.post('/register', formData)

      if (res.data.success) {
        setSuccess('Registered successfully! Please login.')
        setTimeout(() => navigate('/login'), 2000)
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
        <p className="text-center text-muted mb-4">Create your account</p>

        {/* Error */}
        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        {/* Success */}
        {success && (
          <div className="alert alert-success py-2">{success}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Registering...
              </>
            ) : 'Register'}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center mt-3 mb-0">
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  )
}

export default Register