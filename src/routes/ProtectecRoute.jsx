import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth(); // Obtener el usuario autenticado

  if (!user) {
    return <Navigate to="/login" />; // Redirigir al login si no hay usuario autenticado
  }

  if (!allowedRoles.includes(user.puesto)) {
    return <Navigate to="/ventas" />; // Redirigir a ventas si el rol no está permitido
  }

  return children;
};

export default ProtectedRoute;
