import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute'
// Lazy imports — Auth
const Login = lazy(() => import('./pages/Auth/Login.jsx'))

// Lazy imports — Admin
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard.jsx'))
const AdminDoctors = lazy(() => import('./pages/Admin/Doctors.jsx'))
const AdminPatients = lazy(() => import('./pages/Admin/Patients.jsx'))
const AdminAppointments = lazy(() => import('./pages/Admin/Appointments.jsx'))
const AdminBills = lazy(() => import('./pages/Admin/Bills.jsx'))
const AdminInventory = lazy(() => import('./pages/Admin/Inventory.jsx'))
const AdminUsers = lazy(() => import('./pages/Admin/Users.jsx'))
const AdminDepartments = lazy(() => import('./pages/Admin/Departments.jsx'))

// Lazy imports — Doctor
const DoctorDashboard = lazy(() => import('./pages/Doctor/Dashboard.jsx'))
const DoctorAppointments = lazy(() => import('./pages/Doctor/Appointments.jsx'))
const DoctorPrescriptions = lazy(() => import('./pages/Doctor/Prescriptions.jsx'))
const DoctorPatientHistory = lazy(() => import('./pages/Doctor/PatientHistory.jsx'))
const DoctorLabRequests = lazy(() => import('./pages/Doctor/LabRequests.jsx'))

// Lazy imports — Patient
const PatientDashboard = lazy(() => import('./pages/Patient/Dashboard.jsx'))
const PatientAppointments = lazy(() => import('./pages/Patient/Appointments.jsx'))
const PatientPrescriptions = lazy(() => import('./pages/Patient/Prescriptions.jsx'))
const PatientBills = lazy(() => import('./pages/Patient/Bills.jsx'))

// Lazy imports — Nurse
const NurseDashboard = lazy(() => import('./pages/Nurse/Dashboard.jsx'))
const NursePatientView = lazy(() => import('./pages/Nurse/PatientView.jsx'))

// Lazy imports — Lab
const LabDashboard = lazy(() => import('./pages/Lab/Dashboard.jsx'))
const LabTestRequests = lazy(() => import('./pages/Lab/TestRequests.jsx'))

// Lazy imports — Receptionist
const ReceptionistDashboard = lazy(() => import('./pages/Receptionist/Dashboard.jsx'))
const ReceptionistPatients = lazy(() => import('./pages/Receptionist/Patients.jsx'))
const ReceptionistAppointmentBooking = lazy(() => import('./pages/Receptionist/AppointmentBooking.jsx'))
const ReceptionistBillingBasic = lazy(() => import('./pages/Receptionist/BillingBasic.jsx'))

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

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/patients" element={<AdminPatients />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/bills" element={<AdminBills />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
          <Route path="/doctor/patient-history" element={<ProtectedRoute roles={['doctor']}><DoctorPatientHistory /></ProtectedRoute>} />
          <Route path="/doctor/lab-requests" element={<ProtectedRoute roles={['doctor']}><DoctorLabRequests /></ProtectedRoute>} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<PatientAppointments />} />
          <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
          <Route path="/patient/bills" element={<PatientBills />} />

          {/* Nurse Routes */}
          <Route path="/nurse/dashboard" element={<ProtectedRoute roles={['nurse']}><NurseDashboard /></ProtectedRoute>} />
          <Route path="/nurse/patients" element={<ProtectedRoute roles={['nurse']}><NursePatientView /></ProtectedRoute>} />

          {/* Lab Routes */}
          <Route path="/lab/dashboard" element={<ProtectedRoute roles={['lab']}><LabDashboard /></ProtectedRoute>} />
          <Route path="/lab/test-requests" element={<ProtectedRoute roles={['lab']}><LabTestRequests /></ProtectedRoute>} />

          {/* Receptionist Routes */}
          <Route path="/receptionist/dashboard" element={<ProtectedRoute roles={['receptionist']}><ReceptionistDashboard /></ProtectedRoute>} />
          <Route path="/receptionist/patients" element={<ProtectedRoute roles={['receptionist']}><ReceptionistPatients /></ProtectedRoute>} />
          <Route path="/receptionist/appointments" element={<ProtectedRoute roles={['receptionist']}><ReceptionistAppointmentBooking /></ProtectedRoute>} />
          <Route path="/receptionist/billing" element={<ProtectedRoute roles={['receptionist']}><ReceptionistBillingBasic /></ProtectedRoute>} />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App