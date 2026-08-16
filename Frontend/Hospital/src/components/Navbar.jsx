import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSidebar } from '../context/SidebarContext'

const Navbar = () => {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const { toggleSidebar } = useSidebar()

  // Extract identity from token (JWT payload has email + role only)
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="app-navbar d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-2">
        <button
          className="sidebar-toggle-btn d-md-none btn btn-outline-primary btn-sm"
          onClick={toggleSidebar}
          title="Toggle menu"
        >
          <i className="bi bi-list"></i>
        </button>
        <span className="navbar-brand mb-0">Hospital Management System</span>
      </div>

      <div className="d-flex align-items-center gap-3">
        {payload && (
          <div className="d-flex align-items-center gap-2">
            <span className="small">{payload.email}</span>
            <span className="badge bg-primary text-uppercase">{payload.role}</span>
          </div>
        )}
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={handleLogout}
          title="Logout"
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
