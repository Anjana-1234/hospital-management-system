import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-dark bg-primary px-4">
      <span className="navbar-brand mb-0 h1">🏥 Hospital Management System</span>
      <button
        className="btn btn-outline-light btn-sm"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar