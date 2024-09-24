import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { supabase } from "../utils/supaBaseClient"; // asegúrate de importar tu cliente de Supabase

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [detallesFactura, setDetallesFactura] = useState(null);
  const [cliente, setCliente] = useState("");
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1); // Paginación
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    // Función para obtener las facturas desde Supabase con paginación
    const fetchFacturas = async () => {
      const limite = 6; // Mostrar 6 facturas por página
      const desde = (paginaActual - 1) * limite;

      try {
        const { data, error, count } = await supabase
          .from("ventas")
          .select("id, nombre_cliente, fecha, total", { count: "exact" })
          .order("fecha", { ascending: false })
          .range(desde, desde + limite - 1);

        if (error) throw error;
        setFacturas(data);
        setTotalPaginas(Math.ceil(count / limite)); // Calcular el total de páginas
      } catch (error) {
        console.error("Error fetching facturas:", error);
      }
    };

    fetchFacturas();
  }, [paginaActual]);

  // Función para obtener los detalles de la factura seleccionada
  const verDetallesFactura = async (facturaId) => {
    try {
      const { data: detalles, error: detallesError } = await supabase
        .from("detalles_ventas")
        .select("producto_id, cantidad, precio_unitario, productos (nombre)")
        .eq("venta_id", facturaId);

      if (detallesError) throw detallesError;

      const { data: facturaInfo, error: facturaError } = await supabase
        .from("ventas")
        .select("nombre_cliente")
        .eq("id", facturaId)
        .single();

      if (facturaError) throw facturaError;

      setCliente(facturaInfo.nombre_cliente);
      setDetallesFactura(detalles);
      setFacturaSeleccionada(facturaId);
      setMostrarModal(true); // Mostrar el modal
    } catch (error) {
      console.error("Error fetching factura details:", error);
    }
  };

  // Cerrar el modal
  const cerrarModal = () => setMostrarModal(false);

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

        {/* Paginación */}
        <div className="flex justify-between items-center mt-6">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
            onClick={() => setPaginaActual(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>
          <span>Página {paginaActual} de {totalPaginas}</span>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => setPaginaActual(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>

        {/* Modal de Detalles de la Factura */}
        {mostrarModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md">
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
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={cerrarModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Facturas;
