import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Page refresh hone par localStorage se token lo
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
    }
    setLoading(false)
  }, [])

  // Login — sirf token save karo
  const login = (tokenData) => {
    setToken(tokenData)
    localStorage.setItem('token', tokenData)
  }

  // Logout
  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}