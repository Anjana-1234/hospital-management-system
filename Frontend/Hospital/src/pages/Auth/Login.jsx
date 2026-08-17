import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const setupMessage = location.state?.message || "";

  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const res = await api.get("/admin-exists");
        console.log("[admin-exists] response:", res.data); // TEMP debug — remove after diagnosing
        setAdminExists(res.data.data?.exists !== false);
      } catch (err) {
        console.log("[admin-exists] request failed:", err); // TEMP debug — remove after diagnosing
        // If the check fails, don't surface the setup link — safest default
        setAdminExists(true);
      }
    };

    checkAdminExists();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/login", { email, password });

      if (res.data.success) {
        login(res.data.token);

        // Redirect based on role
        const role = res.data.data.role;
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "doctor") navigate("/doctor/dashboard");
        else if (role === "nurse") navigate("/nurse/dashboard");
        else if (role === "lab") navigate("/lab/dashboard");
        else if (role === "receptionist") navigate("/receptionist/dashboard");
        else if (role === "pharmacist") navigate("/pharmacist/dashboard");
        else if (role === "accountant") navigate("/accountant/dashboard");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="auth-card shadow-sm p-4" style={{ width: "400px" }}>
        {/* Header */}
        <h3
          className="text-center mb-1"
          style={{ color: "var(--color-primary-dark)", fontWeight: 600 }}
        >
          HMS
        </h3>
        <p className="text-center text-muted mb-4">
          Hospital Management System
        </p>

        {/* Setup success message */}
        {setupMessage && <div className="alert alert-success py-2">{setupMessage}</div>}

        {/* Error */}
        {error && <div className="alert alert-danger py-2">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* One-time first-admin setup — only shown before any admin account exists */}
        {!adminExists && (
          <p className="text-center mt-3 mb-0">
            <Link to="/setup-admin" className="small text-muted">
              First time setup — Create the admin account
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
