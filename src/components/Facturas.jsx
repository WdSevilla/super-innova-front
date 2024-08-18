import React, { useState } from 'react'; 
import SideBar from "./SideBar";


const Facturas = () => {
  const [facturas, setFacturas] = useState([
    { id: 1, cliente: 'Juan Pérez', fecha: '2024-08-01', total: '$150.00' },
    { id: 2, cliente: 'María López', fecha: '2024-08-05', total: '$200.00' },
    { id: 3, cliente: 'Carlos Ramírez', fecha: '2024-08-10', total: '$120.00' },
  ]);

  return (
    <div className='min-h-screen flex'>
        <SideBar/>
    <div className="min-h-screen w-full bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Facturas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Cliente</th>
              <th className="py-2 px-4 text-left">Fecha</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.id} className="border-b border-gray-200">
                <td className="py-2 px-4">{factura.id}</td>
                <td className="py-2 px-4">{factura.cliente}</td>
                <td className="py-2 px-4">{factura.fecha}</td>
                <td className="py-2 px-4">{factura.total}</td>
                <td className="py-2 px-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600">Ver</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">Nueva Factura</button>
      </div>
    </div>
    </div>
  );
};

export default Facturas;
