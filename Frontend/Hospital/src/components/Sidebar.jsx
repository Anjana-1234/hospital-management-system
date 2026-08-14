import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { token } = useAuth()

  // Token se role nikalo
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null
  const role = payload?.role

  // Admin links
  const adminLinks = [
    { path: '/admin/dashboard', label: '📊 Dashboard' },
    { path: '/admin/doctors', label: '👨‍⚕️ Doctors' },
    { path: '/admin/patients', label: '🤒 Patients' },
    { path: '/admin/appointments', label: '📅 Appointments' },
    { path: '/admin/bills', label: '💰 Bills' },
    { path: '/admin/inventory', label: '📦 Inventory' },
  ]

  // Doctor links
  const doctorLinks = [
    { path: '/doctor/dashboard', label: '📊 Dashboard' },
    { path: '/doctor/appointments', label: '📅 Appointments' },
    { path: '/doctor/prescriptions', label: '💊 Prescriptions' },
  ]

  // Patient links
  const patientLinks = [
    { path: '/patient/dashboard', label: '📊 Dashboard' },
    { path: '/patient/appointments', label: '📅 Appointments' },
    { path: '/patient/prescriptions', label: '💊 Prescriptions' },
    { path: '/patient/bills', label: '💰 Bills' },
  ]

  // Role ke hisaab se links
  const links =
    role === 'admin' ? adminLinks :
    role === 'doctor' ? doctorLinks :
    patientLinks

  return (
    <div
      className="d-flex flex-column bg-dark text-white p-3"
      style={{ width: '220px', minHeight: '100vh' }}
    >
      <h6 className="text-uppercase text-muted mb-3 mt-2">Menu</h6>
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `text-decoration-none py-2 px-3 rounded mb-1 ${
              isActive
                ? 'bg-primary text-white'
                : 'text-white-50'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar