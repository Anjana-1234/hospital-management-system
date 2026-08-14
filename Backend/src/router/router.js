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
  deleteBillController
} from "../Controller/billController.js"


import {
  addInventoryController,
  getAllInventoryController,
  getLowStockController,
  updateInventoryController,
  deleteInventoryController
} from "../Controller/inventoryController.js"


import { authMiddleware, roleMiddleware } from "../Middleware/auth.js";

// Auth routes
router.post("/register", UserRegistrationController);
router.post("/login", UserLoginController);

// Doctor routes
router.post("/add-doctor", authMiddleware, roleMiddleware(["admin"]), addDoctorController);
router.get("/all-doctor", authMiddleware, roleMiddleware(["admin", "doctor", "patient"]), getAllDoctorsController);
router.get("/all-patient", authMiddleware, roleMiddleware(["admin"]), getAllPatientsController);
router.get("/patient/:id", authMiddleware, roleMiddleware(["admin", "doctor", "patient"]), getPatientByIdController);
router.get("/all-appointment", authMiddleware, roleMiddleware(["admin"]), getAllAppointmentsController)
router.get("/all-prescription", authMiddleware, roleMiddleware(["admin"]), getAllPrescriptionsController)
router.get("/all-bill", authMiddleware, roleMiddleware(["admin"]), getAllBillsController)
router.get("/all-inventory", authMiddleware, roleMiddleware(["admin"]), getAllInventoryController)

// /:id SABSE LAST mein
router.get("/:id", authMiddleware, roleMiddleware(["admin", "doctor", "patient"]), getDoctorByIdController);

router.put("/update/:id", authMiddleware, roleMiddleware(["admin"]), updateDoctorController);
router.delete("/delete/:id", authMiddleware, roleMiddleware(["admin"]), deleteDoctorController);

// Patient routes
router.post("/add-patient", authMiddleware, roleMiddleware(["admin"]), addPatientController);
router.put("/update-patient/:id", authMiddleware, roleMiddleware(["admin", "patient"]), updatePatientController);
router.delete("/delete-patient/:id", authMiddleware, roleMiddleware(["admin"]), deletePatientController);


// Appointment routes
router.post("/book-appointment", authMiddleware, roleMiddleware(["admin", "patient"]), bookAppointmentController)
router.get("/appointment/:id", authMiddleware, roleMiddleware(["admin", "doctor", "patient"]), getAppointmentByIdController)
router.put("/update-appointment/:id", authMiddleware, roleMiddleware(["admin", "doctor"]), updateAppointmentStatusController)
router.put("/cancel-appointment/:id", authMiddleware, roleMiddleware(["admin", "doctor", "patient"]), cancelAppointmentController)


// Prescription routes
router.post("/add-prescription", authMiddleware, roleMiddleware(["doctor"]), addPrescriptionController)
router.get("/prescription/:patientId", authMiddleware, roleMiddleware(["admin", "doctor", "patient"]), getPrescriptionByPatientController)
router.put("/update-prescription/:id", authMiddleware, roleMiddleware(["doctor"]), updatePrescriptionController)
router.delete("/delete-prescription/:id", authMiddleware, roleMiddleware(["admin"]), deletePrescriptionController)


// Bill routes
router.post("/add-bill", authMiddleware, roleMiddleware(["admin"]), addBillController)
router.get("/bill/:patientId", authMiddleware, roleMiddleware(["admin", "doctor", "patient"]), getBillByPatientController)
router.put("/update-bill/:id", authMiddleware, roleMiddleware(["admin"]), updateBillStatusController)
router.delete("/delete-bill/:id", authMiddleware, roleMiddleware(["admin"]), deleteBillController)


// Inventory routes
router.post("/add-inventory", authMiddleware, roleMiddleware(["admin"]), addInventoryController)
router.get("/low-stock", authMiddleware, roleMiddleware(["admin"]), getLowStockController)
router.put("/update-inventory/:id", authMiddleware, roleMiddleware(["admin"]), updateInventoryController)
router.delete("/delete-inventory/:id", authMiddleware, roleMiddleware(["admin"]), deleteInventoryController)

export default router;