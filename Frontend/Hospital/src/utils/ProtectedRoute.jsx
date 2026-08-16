import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, roles }) => {
  const { token, loading } = useAuth()

  // Token check in progress — wait
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // No token — redirect to login
  if (!token) {
    return <Navigate to="/login" />
  }

  // Role-restricted route — check the token's role
  if (roles && roles.length > 0) {
    let authorized = false
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      authorized = roles.includes(payload.role)
    } catch {
      authorized = false
    }
    if (!authorized) {
      return <Navigate to="/login" />
    }
  }

  return children
}

export default ProtectedRoute