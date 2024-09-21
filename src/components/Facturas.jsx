import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { supabase } from "../utils/supaBaseClient"; // asegúrate de importar tu cliente de Supabase

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [detallesFactura, setDetallesFactura] = useState(null); // Almacena los detalles de la factura seleccionada
  const [cliente, setCliente] = useState(""); // Almacena el nombre del cliente
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null); // Factura seleccionada

  useEffect(() => {
    // Función para obtener las facturas desde Supabase
    const fetchFacturas = async () => {
      try {
        const { data, error } = await supabase
          .from("ventas")
          .select("id, nombre_cliente, fecha, total");

        if (error) throw error;
        setFacturas(data);
      } catch (error) {
        console.error("Error fetching facturas:", error);
      }
    };

    fetchFacturas();
  }, []);

  // Función para obtener los detalles de la factura seleccionada
  const verDetallesFactura = async (facturaId) => {
    try {
      // Obtener los detalles de la factura con el nombre del producto
      const { data: detalles, error: detallesError } = await supabase
        .from("detalles_ventas")
        .select("producto_id, cantidad, precio_unitario, productos (nombre)")
        .eq("venta_id", facturaId); // La relación 'productos' debe estar definida en Supabase

      if (detallesError) throw detallesError;

      // Obtener la información del cliente
      const { data: facturaInfo, error: facturaError } = await supabase
        .from("ventas")
        .select("nombre_cliente")
        .eq("id", facturaId)
        .single();

      if (facturaError) throw facturaError;

      setCliente(facturaInfo.nombre_cliente); // Almacenar nombre del cliente
      setDetallesFactura(detalles); // Almacenar los detalles de la factura
      setFacturaSeleccionada(facturaId); // Marcar factura seleccionada
    } catch (error) {
      console.error("Error fetching factura details:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      <SideBar />
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
                  <td className="py-2 px-4">
                    {new Date(factura.fecha).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">₡{factura.total.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                      onClick={() => verDetallesFactura(factura.id)}
                    >
                      Ver
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

        {/* Mostrar los detalles de la factura seleccionada */}
        {detallesFactura && (
          <div className="mt-6 bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">
              Detalles de la Factura #{facturaSeleccionada}
            </h3>
            <p className="mb-2">
              <strong>Cliente:</strong> {cliente}
            </p>
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">Producto ID</th>
                  <th className="py-2 px-4 text-left">Producto</th>
                  <th className="py-2 px-4 text-left">Cantidad</th>
                  <th className="py-2 px-4 text-left">Precio Unitario</th>
                  <th className="py-2 px-4 text-left">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detallesFactura.map((detalle, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-4">{detalle.producto_id}</td>
                    <td className="py-2 px-4">{detalle.productos.nombre}</td>
                    {/* Mostrar el nombre del producto */}
                    <td className="py-2 px-4">{detalle.cantidad}</td>
                    <td className="py-2 px-4">
                    ₡{detalle.precio_unitario.toFixed(2)}
                    </td>
                    <td className="py-2 px-4">
                    ₡{(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Facturas;
