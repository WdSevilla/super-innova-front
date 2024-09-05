// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Venta from '../components/Ventas';
import Inventario from '../components/Inventario';
import Clientes from '../components/Clientes';
import Empleados from '../components/Empleados'
import Facturas from '../components/Facturas';
import AgregarProducto from '../components/AgregarProducto';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/venta" element={<Venta />} />
      <Route path="/inventario" element={<Inventario />}/>
      <Route path="/clientes" element={<Clientes />}/>
      <Route path="/empleados" element={<Empleados />}/>
      <Route path="/facturas" element={<Facturas />}/>
      <Route path="/agregarproducto" element={<AgregarProducto/>} />
    </Routes>
  );
};

export default AppRoutes;
