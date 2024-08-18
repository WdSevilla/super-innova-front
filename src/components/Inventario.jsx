import SideBar from "./SideBar";
import React, { useState } from "react";
const Inventario = () => {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Producto A", cantidad: 10, precio: 100 },
    { id: 2, nombre: "Producto B", cantidad: 5, precio: 50 },
    { id: 3, nombre: "Producto C", cantidad: 20, precio: 200 },
  ]);
  return (
    <>
      <div className="min-h-screen flex">
        <SideBar />
        <div className="min-h-screen w-full bg-gray-100 p-6">
          <h2 className="text-2xl font-bold mb-6">Inventario</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">Nombre del Producto</th>
                  <th className="py-2 px-4 text-left">Cantidad</th>
                  <th className="py-2 px-4 text-left">Precio</th>
                  <th className="py-2 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id} className="border-b border-gray-200">
                    <td className="py-2 px-4">{producto.id}</td>
                    <td className="py-2 px-4">{producto.nombre}</td>
                    <td className="py-2 px-4">{producto.cantidad}</td>
                    <td className="py-2 px-4">${producto.precio}</td>
                    <td className="py-2 px-4">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600">
                        Editar
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Agregar Producto
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventario;
