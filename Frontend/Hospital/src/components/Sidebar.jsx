import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { token } = useAuth()

  // Token se role nikalo
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null
  const role = payload?.role

  // Admin links
  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/admin/doctors', label: 'Doctors', icon: 'bi-heart-pulse' },
    { path: '/admin/patients', label: 'Patients', icon: 'bi-people' },
    { path: '/admin/appointments', label: 'Appointments', icon: 'bi-calendar-check' },
    { path: '/admin/bills', label: 'Bills', icon: 'bi-receipt' },
    { path: '/admin/inventory', label: 'Inventory', icon: 'bi-capsule' },
    { path: '/admin/users', label: 'Users', icon: 'bi-person-gear' },
    { path: '/admin/departments', label: 'Departments', icon: 'bi-building' },
  ]

  // Doctor links
  const doctorLinks = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/doctor/appointments', label: 'Appointments', icon: 'bi-calendar-check' },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: 'bi-file-medical' },
    { path: '/doctor/patient-history', label: 'Patient History', icon: 'bi-clipboard2-pulse' },
    { path: '/doctor/lab-requests', label: 'Lab Requests', icon: 'bi-flask' },
  ]

  // Patient links
  const patientLinks = [
    { path: '/patient/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/patient/appointments', label: 'Appointments', icon: 'bi-calendar-check' },
    { path: '/patient/prescriptions', label: 'Prescriptions', icon: 'bi-file-medical' },
    { path: '/patient/bills', label: 'Bills', icon: 'bi-receipt' },
  ]

  // Nurse links
  const nurseLinks = [
    { path: '/nurse/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/nurse/patients', label: 'Patients', icon: 'bi-clipboard-heart' },
  ]

  // Lab Staff links
  const labLinks = [
    { path: '/lab/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/lab/test-requests', label: 'Test Requests', icon: 'bi-flask' },
  ]

  // Role ke hisaab se links
  const links =
    role === 'admin' ? adminLinks :
    role === 'doctor' ? doctorLinks :
    role === 'nurse' ? nurseLinks :
    role === 'lab' ? labLinks :
    patientLinks

  return (
    <div className="app-sidebar d-flex flex-column p-3">
      <h6 className="sidebar-heading text-uppercase mb-3 mt-2">Menu</h6>
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `sidebar-link mb-1 ${isActive ? 'active' : ''}`
          }
        >
          <i className={`bi ${link.icon}`}></i>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
