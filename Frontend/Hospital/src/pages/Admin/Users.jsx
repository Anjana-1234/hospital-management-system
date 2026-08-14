import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const roles = ['admin', 'doctor', 'nurse', 'receptionist', 'lab', 'pharmacist', 'accountant']

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'doctor'
  })
  const [showForm, setShowForm] = useState(false)

  // Saare users fetch karo
  const fetchUsers = async () => {
    try {
      const res = await api.get('/all-users')
      setUsers(res.data.data)
    } catch (err) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // User add karo — protected /register endpoint, admin token auto-attached
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/register', formData)
      if (res.data.success) {
        setShowForm(false)
        setFormData({ name: '', email: '', password: '', role: 'doctor' })
        fetchUsers()
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to add user')
    }
  }

  // Role change karo
  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/update-user/${id}`, { role })
      fetchUsers()
    } catch (err) {
      setError('Failed to update role')
    }
  }

  // Active/Deactivate toggle
  const handleToggleActive = async (user) => {
    try {
      await api.put(`/update-user/${user._id}`, { isActive: user.isActive === false })
      fetchUsers()
    } catch (err) {
      setError('Failed to update status')
    }
  }

  // User delete karo
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await api.delete(`/delete-user/${id}`)
      fetchUsers()
    } catch (err) {
      setError('Failed to delete user')
    }
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 w-100">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4><i className="bi bi-person-gear me-2"></i>Users</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add User'}
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Add User Form */}
          {showForm && (
            <div className="card p-4 mb-4 shadow-sm">
              <h5 className="mb-3">Add New User</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <input name="name" className="form-control"
                      placeholder="Name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <input name="email" type="email" className="form-control"
                      placeholder="Email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <input name="password" type="password" className="form-control"
                      placeholder="Password" value={formData.password} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                      {roles.map(r => (
                        <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-success">
                      Save User
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Users Table */}
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          >
                            {roles.map(r => (
                              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <span className={`badge ${user.isActive === false ? 'bg-danger' : 'bg-success'}`}>
                            {user.isActive === false ? 'Inactive' : 'Active'}
                          </span>
                        </td>
                        <td className="d-flex gap-1">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleToggleActive(user)}
                          >
                            {user.isActive === false ? 'Activate' : 'Deactivate'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(user._id)}
                          >
                            <i className="bi bi-trash me-1"></i>Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default Users
