import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, roles }) => {
  const { token, loading } = useAuth()

  // Token check ho raha hai — wait karo
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Token nahi hai — login pe bhejo
  if (!token) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute