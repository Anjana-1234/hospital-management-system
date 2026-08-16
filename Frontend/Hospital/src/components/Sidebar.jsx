import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSidebar } from '../context/SidebarContext'

const Sidebar = () => {
  const { token } = useAuth()
  const { isOpen, closeSidebar } = useSidebar()

  // Extract role from token
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
    { path: '/admin/reports', label: 'Reports', icon: 'bi-file-earmark-bar-graph' },
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

  // Receptionist links
  const receptionistLinks = [
    { path: '/receptionist/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/receptionist/patients', label: 'Patients', icon: 'bi-person-plus' },
    { path: '/receptionist/appointments', label: 'Appointments', icon: 'bi-calendar-plus' },
    { path: '/receptionist/billing', label: 'Billing', icon: 'bi-receipt' },
  ]

  // Pharmacist links
  const pharmacistLinks = [
    { path: '/pharmacist/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/pharmacist/inventory', label: 'Inventory', icon: 'bi-capsule' },
    { path: '/pharmacist/prescriptions', label: 'Prescriptions', icon: 'bi-prescription2' },
  ]

  // Accountant links
  const accountantLinks = [
    { path: '/accountant/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/accountant/invoices', label: 'Invoices', icon: 'bi-receipt-cutoff' },
    { path: '/accountant/revenue-report', label: 'Revenue Report', icon: 'bi-graph-up' },
  ]

  // Links based on role
  const links =
    role === 'admin' ? adminLinks :
    role === 'doctor' ? doctorLinks :
    role === 'nurse' ? nurseLinks :
    role === 'lab' ? labLinks :
    role === 'receptionist' ? receptionistLinks :
    role === 'pharmacist' ? pharmacistLinks :
    role === 'accountant' ? accountantLinks :
    patientLinks

  return (
    <>
      {isOpen && <div className="sidebar-backdrop d-md-none" onClick={closeSidebar}></div>}
      <div className={`app-sidebar d-flex flex-column p-3 ${isOpen ? 'open' : ''}`}>
        <h6 className="sidebar-heading text-uppercase mb-3 mt-2">Menu</h6>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `sidebar-link mb-1 ${isActive ? 'active' : ''}`
            }
          >
            <i className={`bi ${link.icon}`}></i>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  )
}

export default Sidebar
