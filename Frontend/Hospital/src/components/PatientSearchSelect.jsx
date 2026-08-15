import { useState, useEffect, useRef } from 'react'

// Searchable patient dropdown — type to filter by name/phone, click to select
const PatientSearchSelect = ({ patients, value, onChange, placeholder = 'Search patient by name or phone...' }) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  const selected = patients.find((p) => p._id === value)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = query
    ? patients.filter((p) =>
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        p.phone?.includes(query)
      )
    : patients

  const handleSelect = (patient) => {
    onChange(patient._id)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="position-relative" ref={wrapperRef}>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={open ? query : (selected ? selected.name : query)}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          if (value) onChange('')
        }}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <div
          className="list-group position-absolute w-100 shadow-sm"
          style={{ zIndex: 1000, maxHeight: '220px', overflowY: 'auto' }}
        >
          {filtered.length === 0 ? (
            <div className="list-group-item text-muted">No patients found</div>
          ) : (
            filtered.map((p) => (
              <button
                type="button"
                key={p._id}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelect(p)}
              >
                {p.name} <span className="text-muted small">— {p.phone}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default PatientSearchSelect
