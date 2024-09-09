import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import Dashboard from '../components/Dashboard';
import Ventas from '../components/Ventas';
import Inventario from '../components/Inventario';
import Clientes from '../components/Clientes';
import Empleados from '../components/Empleados';
import Facturas from '../components/Facturas';
import AgregarProducto from '../components/AgregarProducto';
import ActualizarProducto from '../components/ActualizarProducto';
import Login from '../components/Login';

// Rutas protegidas para administración
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.puesto === 'Administrador' ? children : <Navigate to="/dashboard" />;
};

// Componente de rutas principales
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Ruta pública (login) */}
      <Route path="/" element={<Login />} />

      {/* Ruta protegida (dashboard) */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      
      {/* Rutas protegidas para empleados y administradores */}
      <Route path="/ventas" element={user ? <Ventas /> : <Navigate to="/" />} />
      
      {/* Rutas protegidas solo para administradores */}
      <Route path="/inventario" element={<AdminRoute><Inventario /></AdminRoute>} />
      <Route path="/clientes" element={<AdminRoute><Clientes /></AdminRoute>} />
      <Route path="/empleados" element={<AdminRoute><Empleados /></AdminRoute>} />
      <Route path="/facturas" element={<AdminRoute><Facturas /></AdminRoute>} />
      <Route path="/agregarproducto" element={<AdminRoute><AgregarProducto /></AdminRoute>} />
      <Route path="/actualizarproducto/:id" element={<AdminRoute><ActualizarProducto /></AdminRoute>} />
    </Routes>
  );
};

export default AppRoutes;
