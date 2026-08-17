import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const SetupAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  const [alreadySetUp, setAlreadySetUp] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const res = await api.get("/admin-exists");
        if (res.data.data?.exists) {
          // Setup already done — don't let this page be used, even via direct URL
          navigate("/login", { replace: true });
          return;
        }
      } catch (err) {
        // If the check itself fails, fall through and let the submit attempt
        // hit the backend's own gate rather than blocking the page entirely
      } finally {
        setChecking(false);
      }
    };

    checkAdminExists();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/setup-first-admin", {
        name,
        email,
        password,
      });
      if (res.data.success) {
        navigate("/login", {
          state: {
            message: "Admin account created successfully — please log in.",
          },
        });
      } else {
        setError(res.data.message);
        if (res.data.code === 403) {
          setAlreadySetUp(true);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      if (err.response?.status === 403) {
        setAlreadySetUp(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="auth-card shadow-sm p-4" style={{ width: "400px" }}>
        <h3
          className="text-center mb-1"
          style={{ color: "var(--color-primary-dark)", fontWeight: 600 }}
        >
          First-Time Setup
        </h3>
        <p className="text-center text-muted mb-4">
          Create the initial admin account
        </p>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        {alreadySetUp ? (
          <p className="text-center mb-0">
            <Link to="/login">Back to login</Link>
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Creating...
                </>
              ) : (
                "Create Admin Account"
              )}
            </button>

            <p className="text-center mt-3 mb-0">
              <Link to="/login" className="small text-muted">
                Back to login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetupAdmin;
