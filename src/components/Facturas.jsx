import React, { useState, useEffect } from 'react'; 
import SideBar from "./SideBar";
import { supabase } from '../utils/supaBaseClient'; // asegúrate de importar tu cliente de Supabase

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    // Función para obtener las facturas desde Supabase
    const fetchFacturas = async () => {
      try {
        const { data, error } = await supabase
          .from('ventas')
          .select('id, nombre_cliente, fecha, total');

        if (error) throw error;
        setFacturas(data);
      } catch (error) {
        console.error('Error fetching facturas:', error);
      }
    };

    fetchFacturas();
  }, []);

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
                    <td className="py-2 px-4">{factura.nombre_cliente}</td>
                    <td className="py-2 px-4">{new Date(factura.fecha).toLocaleDateString()}</td>
                    <td className="py-2 px-4">₡{factura.total.toFixed(2)}</td>
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
