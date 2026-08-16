import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const res = await api.get('/all-department')
      setDepartments(res.data.data)
    } catch (err) {
      setError('Failed to fetch departments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({ name: '', description: '' })
    setEditingId(null)
    setShowForm(false)
  }

  // Add or update
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = editingId
        ? await api.put(`/update-department/${editingId}`, formData)
        : await api.post('/add-department', formData)

      if (res.data.success) {
        resetForm()
        fetchDepartments()
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to save department')
    }
  }

  const handleEdit = (dept) => {
    setFormData({ name: dept.name, description: dept.description || '' })
    setEditingId(dept._id)
    setShowForm(true)
  }

  // Delete department
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await api.delete(`/delete-department/${id}`)
      fetchDepartments()
    } catch (err) {
      setError('Failed to delete department')
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
            <h4><i className="bi bi-building me-2"></i>Departments</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => (showForm ? resetForm() : setShowForm(true))}
            >
              {showForm ? 'Cancel' : '+ Add Department'}
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Add / Edit Department Form */}
          {showForm && (
            <div className="card p-4 mb-4 shadow-sm">
              <h5 className="mb-3">{editingId ? 'Edit Department' : 'Add New Department'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <input name="name" className="form-control"
                      placeholder="Name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-8">
                    <input name="description" className="form-control"
                      placeholder="Description" value={formData.description} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-success">
                      {editingId ? 'Update Department' : 'Save Department'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Departments Table */}
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
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No departments found
                      </td>
                    </tr>
                  ) : (
                    departments.map((dept, index) => (
                      <tr key={dept._id}>
                        <td>{index + 1}</td>
                        <td>{dept.name}</td>
                        <td>{dept.description || '—'}</td>
                        <td className="d-flex gap-1">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEdit(dept)}
                          >
                            <i className="bi bi-pencil me-1"></i>Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(dept._id)}
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

export default Departments
