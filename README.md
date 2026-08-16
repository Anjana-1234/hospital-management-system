# Hospital Management System

A full-stack Hospital Management System supporting seven distinct staff roles - Admin, Doctor,
Nurse, Receptionist, Lab Staff, Pharmacist, and Accountant - each with a role-scoped dashboard and
permission set. It covers the patient lifecycle end to end: registration, appointment booking,
consultation, lab testing, prescription dispensing, and invoicing, with consolidated reporting for
administrators.

## Tech Stack

**Backend**

- Node.js + Express 5
- MongoDB with Mongoose
- JWT (jsonwebtoken) for authentication, bcrypt for password hashing
- nodemon for local development

**Frontend**

- React 19 + Vite
- React Router 7
- Axios
- Bootstrap 5 + Bootstrap Icons

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd HospitalManagementSystem
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

| Variable     | Description                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| `PORT`       | Port the API server listens on (e.g. `5000`)                                                          |
| `MONGO_URI`  | MongoDB connection string - a local instance (`mongodb://localhost:27017/hms`) or a MongoDB Atlas URI |
| `JWT_SECRET` | Secret used to sign/verify login tokens                                                               |

Run the one-time admin seed script (creates the first admin account so you have a way to log in):

```bash
npm run seed:admin
```

This creates an admin account using the constants defined at the top of
`Backend/src/seed/createAdmin.js` (`admin@hospital.com` / `ChangeMe123!` by default — change these
before running in a shared environment). Re-running the script is safe; it exits early if an admin
already exists.

Start the API server:

```bash
npm run dev
```

### 3. Frontend setup

In a separate terminal:

```bash
cd Frontend/Hospital
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5000/api` (see `src/services/api.js`) — update
that base URL if your backend runs elsewhere.

### 4. Log in

Open the frontend URL Vite prints (typically `http://localhost:5173`), and log in with the seeded
admin account. From the Admin → Users and Admin → Doctors pages, create accounts for the other six
roles to explore the full system.

## Spec Coverage

| Spec Section                            | Module / Pages                                                                                                                                                                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 — Patient Management                | `Backend/src/Controller/patientController.js`, `Module/Patient.js`; `pages/Admin/Patients.jsx`, `pages/Receptionist/Patients.jsx`                                                                                             |
| 3.2 — Doctor & Staff Management         | `Controller/controller.js` (doctor CRUD), `Controller/userController.js`, `Module/Doctor.js`, `Module/User.js`; `pages/Admin/Doctors.jsx`, `pages/Admin/Users.jsx`                                                            |
| 3.3 — Appointment Scheduling            | `Controller/appointmentController.js`, `Module/Appointment.js`; `pages/Admin/Appointments.jsx`, `pages/Doctor/Appointments.jsx`, `pages/Receptionist/AppointmentBooking.jsx`                                                  |
| 3.4 — Medical Records & Patient History | `Controller/medicalRecordController.js`, `Controller/patientNoteController.js`, `Module/MedicalRecord.js`, `Module/PatientNote.js`; `pages/Doctor/PatientHistory.jsx`, `pages/Nurse/PatientView.jsx`                          |
| 3.5 — Laboratory Management             | `Controller/labTestController.js`, `Module/LabTest.js`; `pages/Doctor/LabRequests.jsx`, `pages/Lab/TestRequests.jsx`, `pages/Lab/Dashboard.jsx`                                                                               |
| 3.6 — Pharmacy & Inventory Management   | `Controller/pharmacyController.js`, `Controller/inventoryController.js`, `Module/Inventory.js`, `Module/Prescription.js` (dispensing); `pages/Pharmacist/Inventory.jsx`, `pages/Pharmacist/Prescriptions.jsx`                 |
| 3.7 — Prescription Management           | `Controller/prescriptionController.js`, `Module/Prescription.js`; `pages/Doctor/Prescriptions.jsx`, `pages/Patient/Prescriptions.jsx`                                                                                         |
| 3.8 — Billing & Invoicing               | `Controller/billController.js`, `Controller/accountantController.js`, `Module/Bill.js`; `pages/Receptionist/BillingBasic.jsx`, `pages/Admin/Bills.jsx`, `pages/Accountant/Invoices.jsx`, `pages/Accountant/RevenueReport.jsx` |
| 3.9 — Role-Based Access Control         | `Middleware/auth.js` (`authMiddleware`, `roleMiddleware`), `router/router.js`; `context/AuthContext.jsx`, `utils/ProtectedRoute.jsx`                                                                                          |
| 3.10 — Reporting & Analytics            | `Controller/reportsController.js`, `Controller/dashboardController.js`; `pages/Admin/Reports.jsx`, `pages/Admin/Dashboard.jsx`, every role's `Dashboard.jsx`                                                                  |

## Known Limitations

The following are intentionally out of scope for this build, per the spec's own Future
Enhancements section — they represent natural next steps rather than gaps in the current
requirements:

- **SMS / email notifications** — appointment reminders, lab result alerts, and payment receipts
  are not sent automatically; all status changes are visible only within the app.
- **Patient portal** — patients do not have their own login. The `Patient` role and its pages
  exist as early scaffolding but are not wired into the authentication system; patient-facing
  self-service (booking, viewing results, paying bills) is future work.
- **Mobile app** — the frontend is a responsive web app, not a native iOS/Android client.
- **Telemedicine** — there is no video/audio consultation capability; appointments are in-person
  scheduling records only.
- **AI features** — no diagnostic assistance, triage suggestions, or predictive analytics.
- **Audit logs** — the system does not keep a change history of who edited what and when, beyond
  the `createdAt`/`updatedAt` timestamps Mongoose adds automatically.
- **Automated backups** — database backup/restore is left to the hosting provider (e.g. MongoDB
  Atlas's own backup tooling) rather than being built into the application.
