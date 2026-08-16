// Returns the names of any fields in `fields` that are missing/empty on `body`
export const getMissingFields = (body, fields) => {
  return fields.filter((field) => {
    const value = body[field]
    return value === undefined || value === null || value === ""
  })
}

// Sends a 400 response naming the missing fields; returns true if it responded (caller should return immediately after)
export const requireFields = (req, res, fields) => {
  const missing = getMissingFields(req.body, fields)
  if (missing.length) {
    res.json({
      success: false,
      code: 400,
      message: `Missing required field(s): ${missing.join(", ")}`,
      data: null,
      error: true,
    })
    return true
  }
  return false
}
