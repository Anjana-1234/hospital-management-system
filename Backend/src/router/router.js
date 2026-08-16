import express from "express";
const router = express.Router();
import {
  UserRegistrationController,
  UserLoginController,
  addDoctorController,
  getAllDoctorsController,
  getDoctorByIdController,
  updateDoctorController,
  deleteDoctorController,
  getDoctorsAvailabilityController,
} from "../Controller/controller.js";

import {
  addPatientController,
  getAllPatientsController,
  getPatientByIdController,
  updatePatientController,
  deletePatientController
} from "../Controller/patientController.js"

import {
  bookAppointmentController,
  getAllAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentStatusController,
  cancelAppointmentController
} from "../Controller/appointmentController.js"

import {
  addPrescriptionController,
  getAllPrescriptionsController,
  getPrescriptionByPatientController,
  updatePrescriptionController,
  deletePrescriptionController
} from "../Controller/prescriptionController.js"

import {
  addBillController,
  getAllBillsController,
  getBillByPatientController,
  updateBillStatusController,
  deleteBillController,
  createBasicInvoiceController
} from "../Controller/billController.js"


import {
  addInventoryController,
  getAllInventoryController,
  getLowStockController,
  updateInventoryController,
  deleteInventoryController
} from "../Controller/inventoryController.js"

import {
  addDepartmentController,
  getAllDepartmentsController,
  getDepartmentByIdController,
  updateDepartmentController,
  deleteDepartmentController
} from "../Controller/departmentController.js"

import {
  getAllUsersController,
  updateUserController,
  deleteUserController
} from "../Controller/userController.js"

import { getDashboardStatsController } from "../Controller/dashboardController.js"

import {
  addMedicalRecordController,
  getPatientHistoryController,
  getMyRecordsController
} from "../Controller/medicalRecordController.js"

import {
  requestLabTestController,
  getMyRequestsController,
  getAllLabTestsController,
  updateLabTestStatusController
} from "../Controller/labTestController.js"

import {
  addPatientNoteController,
  getPatientNotesController
} from "../Controller/patientNoteController.js"

import {
  getPendingPrescriptionsController,
  dispensePrescriptionController,
  getLowStockController as getPharmacyLowStockController
} from "../Controller/pharmacyController.js"


import { authMiddleware, roleMiddleware } from "../Middleware/auth.js";

// Auth routes
router.post("/register", authMiddleware, roleMiddleware(["admin"]), UserRegistrationController);
router.post("/login", UserLoginController);

// Doctor routes
router.post("/add-doctor", authMiddleware, roleMiddleware(["admin"]), addDoctorController);
router.get("/all-doctor", authMiddleware, roleMiddleware(["admin", "doctor"]), getAllDoctorsController);
router.get("/all-patient", authMiddleware, roleMiddleware(["admin", "doctor", "nurse", "lab", "receptionist"]), getAllPatientsController);
router.get("/patient/:id", authMiddleware, roleMiddleware(["admin", "doctor", "nurse", "lab", "receptionist"]), getPatientByIdController);
router.get("/all-appointment", authMiddleware, roleMiddleware(["admin", "doctor", "nurse", "lab", "receptionist"]), getAllAppointmentsController)
router.get("/all-prescription", authMiddleware, roleMiddleware(["admin"]), getAllPrescriptionsController)
router.get("/all-bill", authMiddleware, roleMiddleware(["admin", "receptionist"]), getAllBillsController)
router.get("/all-inventory", authMiddleware, roleMiddleware(["admin", "pharmacist"]), getAllInventoryController)
router.get("/all-department", authMiddleware, roleMiddleware(["admin"]), getAllDepartmentsController)
router.get("/all-users", authMiddleware, roleMiddleware(["admin"]), getAllUsersController)
router.get("/dashboard-stats", authMiddleware, roleMiddleware(["admin"]), getDashboardStatsController)

// Medical Record / Lab Test GET routes — single path segment, must stay above /:id
router.get("/my-medical-records", authMiddleware, roleMiddleware(["doctor"]), getMyRecordsController)
router.get("/my-lab-requests", authMiddleware, roleMiddleware(["doctor"]), getMyRequestsController)
router.get("/all-lab-tests", authMiddleware, roleMiddleware(["admin", "lab"]), getAllLabTestsController)
router.get("/doctors-availability", authMiddleware, roleMiddleware(["admin", "receptionist"]), getDoctorsAvailabilityController)
router.get("/pending-prescriptions", authMiddleware, roleMiddleware(["pharmacist"]), getPendingPrescriptionsController)
router.get("/low-stock-alerts", authMiddleware, roleMiddleware(["pharmacist", "admin"]), getPharmacyLowStockController)

// /:id SABSE LAST mein
router.get("/:id", authMiddleware, roleMiddleware(["admin", "doctor"]), getDoctorByIdController);

router.put("/update/:id", authMiddleware, roleMiddleware(["admin"]), updateDoctorController);
router.delete("/delete/:id", authMiddleware, roleMiddleware(["admin"]), deleteDoctorController);

// Patient routes
router.post("/add-patient", authMiddleware, roleMiddleware(["admin", "receptionist"]), addPatientController);
router.put("/update-patient/:id", authMiddleware, roleMiddleware(["admin", "receptionist"]), updatePatientController);
router.delete("/delete-patient/:id", authMiddleware, roleMiddleware(["admin"]), deletePatientController);


// Appointment routes
router.post("/book-appointment", authMiddleware, roleMiddleware(["admin", "receptionist"]), bookAppointmentController)
router.get("/appointment/:id", authMiddleware, roleMiddleware(["admin", "doctor", "nurse", "lab", "receptionist"]), getAppointmentByIdController)
router.put("/update-appointment/:id", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), updateAppointmentStatusController)
router.put("/cancel-appointment/:id", authMiddleware, roleMiddleware(["admin", "doctor"]), cancelAppointmentController)


// Prescription routes
router.post("/add-prescription", authMiddleware, roleMiddleware(["doctor"]), addPrescriptionController)
router.get("/prescription/:patientId", authMiddleware, roleMiddleware(["admin", "doctor"]), getPrescriptionByPatientController)
router.put("/update-prescription/:id", authMiddleware, roleMiddleware(["doctor"]), updatePrescriptionController)
router.delete("/delete-prescription/:id", authMiddleware, roleMiddleware(["admin"]), deletePrescriptionController)


// Bill routes
router.post("/add-bill", authMiddleware, roleMiddleware(["admin"]), addBillController)
router.post("/create-basic-invoice", authMiddleware, roleMiddleware(["admin", "receptionist"]), createBasicInvoiceController)
router.get("/bill/:patientId", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), getBillByPatientController)
router.put("/update-bill/:id", authMiddleware, roleMiddleware(["admin"]), updateBillStatusController)
router.delete("/delete-bill/:id", authMiddleware, roleMiddleware(["admin"]), deleteBillController)


// Inventory routes
router.post("/add-inventory", authMiddleware, roleMiddleware(["admin", "pharmacist"]), addInventoryController)
router.get("/low-stock", authMiddleware, roleMiddleware(["admin"]), getLowStockController)
router.put("/update-inventory/:id", authMiddleware, roleMiddleware(["admin", "pharmacist"]), updateInventoryController)
router.delete("/delete-inventory/:id", authMiddleware, roleMiddleware(["admin", "pharmacist"]), deleteInventoryController)


// Department routes
router.post("/add-department", authMiddleware, roleMiddleware(["admin"]), addDepartmentController)
router.get("/department/:id", authMiddleware, roleMiddleware(["admin"]), getDepartmentByIdController)
router.put("/update-department/:id", authMiddleware, roleMiddleware(["admin"]), updateDepartmentController)
router.delete("/delete-department/:id", authMiddleware, roleMiddleware(["admin"]), deleteDepartmentController)


// User management routes
router.put("/update-user/:id", authMiddleware, roleMiddleware(["admin"]), updateUserController)
router.delete("/delete-user/:id", authMiddleware, roleMiddleware(["admin"]), deleteUserController)


// Medical Record routes
router.post("/add-medical-record", authMiddleware, roleMiddleware(["doctor"]), addMedicalRecordController)
router.get("/patient-history/:patientId", authMiddleware, roleMiddleware(["admin", "doctor", "nurse", "lab"]), getPatientHistoryController)


// Lab Test routes
router.post("/request-lab-test", authMiddleware, roleMiddleware(["doctor"]), requestLabTestController)
router.put("/update-lab-test/:id", authMiddleware, roleMiddleware(["lab"]), updateLabTestStatusController)


// Patient Note routes
router.post("/add-patient-note", authMiddleware, roleMiddleware(["nurse"]), addPatientNoteController)
router.get("/patient-notes/:patientId", authMiddleware, roleMiddleware(["admin", "doctor", "nurse"]), getPatientNotesController)


// Pharmacy routes
router.put("/dispense-prescription/:id", authMiddleware, roleMiddleware(["pharmacist"]), dispensePrescriptionController)

export default router;