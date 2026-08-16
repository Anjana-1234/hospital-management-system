import { useState, useEffect, Fragment } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import PatientSearchSelect from "../../components/PatientSearchSelect";
import api from "../../services/api";

const emptyForm = {
  doctorId: "",
  patientId: "",
  appointmentDate: "",
  timeSlot: "",
  reason: "",
};

const AppointmentBooking = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reschedule state — appointment id being rescheduled + its draft values
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    appointmentDate: "",
    timeSlot: "",
  });

  const fetchAll = async () => {
    try {
      const [apptRes, docRes, patRes] = await Promise.all([
        api.get("/all-appointment"),
        api.get("/doctors-availability"),
        api.get("/all-patient"),
      ]);
      setAppointments(apptRes.data.data || []);
      setDoctors(docRes.data.data || []);
      setPatients(patRes.data.data || []);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      setError("Please select a patient");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/book-appointment", formData);
      if (res.data.success) {
        setShowForm(false);
        setFormData(emptyForm);
        setError("");
        fetchAll();
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      const res = await api.put(`/update-appointment/${id}`, { status: "cancelled" });
      if (res.data.success) {
        fetchAll();
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Failed to cancel appointment");
    }
  };

  const openReschedule = (appt) => {
    setRescheduleId(appt._id);
    setRescheduleData({
      appointmentDate: appt.appointmentDate
        ? appt.appointmentDate.slice(0, 10)
        : "",
      timeSlot: appt.timeSlot || "",
    });
  };

  const handleRescheduleSave = async (id) => {
    try {
      const res = await api.put(`/update-appointment/${id}`, rescheduleData);
      if (res.data.success) {
        setRescheduleId(null);
        fetchAll();
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Failed to reschedule appointment");
    }
  };

  const statusColor = {
    pending: "warning",
    confirmed: "primary",
    completed: "success",
    cancelled: "danger",
  };

  // Show only today's and future appointments, earliest first
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const upcoming = appointments
    .filter((a) => new Date(a.appointmentDate) >= todayStart)
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>
              <i className="bi bi-calendar-plus me-2"></i>Appointments
            </h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ Book Appointment"}
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Book Appointment Form */}
          {showForm && (
            <div className="card p-4 mb-4 shadow-sm">
              <h5 className="mb-3">Book Appointment</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Patient select */}
                  <div className="col-md-6">
                    <label className="form-label">Patient</label>
                    <PatientSearchSelect
                      patients={patients}
                      value={formData.patientId}
                      onChange={(id) =>
                        setFormData({ ...formData, patientId: id })
                      }
                    />
                  </div>

                  {/* Doctor select */}
                  <div className="col-md-6">
                    <label className="form-label">Doctor</label>
                    <select
                      name="doctorId"
                      className="form-select"
                      value={formData.doctorId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                          {doc.userId?.name} — {doc.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Date</label>
                    <input
                      name="appointmentDate"
                      type="date"
                      className="form-control"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Time Slot</label>
                    <input
                      name="timeSlot"
                      className="form-control"
                      placeholder="e.g. 10:00 - 10:30"
                      value={formData.timeSlot}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Reason</label>
                    <input
                      name="reason"
                      className="form-control"
                      placeholder="Reason for visit"
                      value={formData.reason}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-success" disabled={submitting}>
                      {submitting ? "Booking..." : "Book Appointment"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Appointments Table */}
          <h5 className="mb-3">Today's / Upcoming Appointments</h5>
          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No upcoming appointments
                      </td>
                    </tr>
                  ) : (
                    upcoming.map((appt, index) => (
                      <Fragment key={appt._id}>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{appt.patientId?.name}</td>
                          <td>
                            {appt.doctorId?.userId?.name ||
                              appt.doctorId?.specialization}
                          </td>
                          <td>
                            {new Date(
                              appt.appointmentDate,
                            ).toLocaleDateString()}
                          </td>
                          <td>{appt.timeSlot}</td>
                          <td>
                            <span
                              className={`badge bg-${statusColor[appt.status]}`}
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td className="d-flex gap-1">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              disabled={
                                appt.status === "completed" ||
                                appt.status === "cancelled"
                              }
                              onClick={() => openReschedule(appt)}
                            >
                              Reschedule
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              disabled={
                                appt.status === "completed" ||
                                appt.status === "cancelled"
                              }
                              onClick={() => handleCancel(appt._id)}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                        {rescheduleId === appt._id && (
                          <tr>
                            <td colSpan="7">
                              <div className="d-flex gap-2 align-items-end p-2">
                                <div>
                                  <label className="form-label small mb-1">
                                    New Date
                                  </label>
                                  <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    value={rescheduleData.appointmentDate}
                                    onChange={(e) =>
                                      setRescheduleData({
                                        ...rescheduleData,
                                        appointmentDate: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="form-label small mb-1">
                                    New Time Slot
                                  </label>
                                  <input
                                    className="form-control form-control-sm"
                                    placeholder="e.g. 10:00 - 10:30"
                                    value={rescheduleData.timeSlot}
                                    onChange={(e) =>
                                      setRescheduleData({
                                        ...rescheduleData,
                                        timeSlot: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleRescheduleSave(appt._id)}
                                >
                                  Save
                                </button>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => setRescheduleId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppointmentBooking;
