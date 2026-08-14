import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute'
// Lazy imports — Auth
const Login = lazy(() => import('./pages/Auth/Login.jsx'))
const Register = lazy(() => import('./pages/Auth/Register.jsx'))

// Lazy imports — Admin
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard.jsx'))
const AdminDoctors = lazy(() => import('./pages/Admin/Doctors.jsx'))
const AdminPatients = lazy(() => import('./pages/Admin/Patients.jsx'))
const AdminAppointments = lazy(() => import('./pages/Admin/Appointments.jsx'))
const AdminBills = lazy(() => import('./pages/Admin/Bills.jsx'))
const AdminInventory = lazy(() => import('./pages/Admin/Inventory.jsx'))

// Lazy imports — Doctor
const DoctorDashboard = lazy(() => import('./pages/Doctor/Dashboard.jsx'))
const DoctorAppointments = lazy(() => import('./pages/Doctor/Appointments.jsx'))
const DoctorPrescriptions = lazy(() => import('./pages/Doctor/Prescriptions.jsx'))

// Lazy imports — Patient
const PatientDashboard = lazy(() => import('./pages/Patient/Dashboard.jsx'))
const PatientAppointments = lazy(() => import('./pages/Patient/Appointments.jsx'))
const PatientPrescriptions = lazy(() => import('./pages/Patient/Prescriptions.jsx'))
const PatientBills = lazy(() => import('./pages/Patient/Bills.jsx'))

// Loading component
const Loading = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/patients" element={<AdminPatients />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/bills" element={<AdminBills />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<PatientAppointments />} />
          <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
          <Route path="/patient/bills" element={<PatientBills />} />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App