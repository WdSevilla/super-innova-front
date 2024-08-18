// eslint-disable-next-line no-unused-vars
import React from 'react';
import SideBar from './SideBar';

const Ventas = () => {
  return (
    <div className="min-h-screen flex">
      <SideBar/>
      <main className="flex-1 p-4">
        <section className="mb-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block">Cliente</label>
              <input type="text" className="w-full border p-2" />
            </div>
            <div>
              <label className="block">Correo</label>
              <input type="email" className="w-full border p-2" />
            </div>
            <div>
              <label className="block">Cédula</label>
              <input type="text" className="w-full border p-2" />
            </div>
            <div>
              <label className="block">Teléfono</label>
              <input type="text" className="w-full border p-2" />
            </div>
            <div>
              <label className="block">Dirección</label>
              <input type="text" className="w-full border p-2" />
            </div>
            <div>
              <label className="block">Nombre o Razón Social</label>
              <input type="text" className="w-full border p-2" />
            </div>
          </div>
          <button className="mt-4 bg-gray-300 py-2 px-4">Procesar</button>
        </section>
        <section>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Item</th>
                <th className="border border-gray-300 p-2">Código</th>
                <th className="border border-gray-300 p-2">Producto</th>
                <th className="border border-gray-300 p-2">Cantidad</th>
                <th className="border border-gray-300 p-2">Precio</th>
                <th className="border border-gray-300 p-2">Impuesto</th>
              </tr>
            </thead>
            <tbody>
              {/* Aquí puedes mapear los datos de los productos */}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Ventas;
