import { Navigate } from "react-router-dom"

const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoutes
