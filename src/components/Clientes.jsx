import React, { useState } from 'react';
import SideBar from "./SideBar";
const Clientes = () => {
  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '123-456-7890' },
    { id: 2, nombre: 'María López', email: 'maria@example.com', telefono: '098-765-4321' },
    { id: 3, nombre: 'Carlos Ramírez', email: 'carlos@example.com', telefono: '555-555-5555' },
  ]);

  return (
    <div className="min-h-screen flex ">
               <SideBar />
    <div className="min-h-screen w-full bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Clientes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr >
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Teléfono</th>
              <th className="py-2 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b border-gray-200">
                <td className="py-2 px-4">{cliente.id}</td>
                <td className="py-2 px-4">{cliente.nombre}</td>
                <td className="py-2 px-4">{cliente.email}</td>
                <td className="py-2 px-4">{cliente.telefono}</td>
                <td className="py-2 px-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600">Editar</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">Agregar Cliente</button>
      </div>
    </div>
    </div>
  );
};

export default Clientes;
