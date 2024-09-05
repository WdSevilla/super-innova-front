import SideBar from "./SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supaBaseClient";

const Inventario = () => {
  const [productos, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    try {
      const { data, error } = await supabase.from("productos").select(`
        nombre,
        descripcion,
        precio,
        stock,
         id_categoria,
        procentaje_ganancia,
        fecha_vencimiento,
        id_proveedor,
    proveedores (
      id
    )
      `);
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="min-h-screen flex">
        <SideBar />
        <div className="min-h-screen w-full bg-gray-100 p-6">
          <h2 className="text-2xl font-bold mb-6">Inventario</h2>
          <div className="flex space-x-5 p-3">
            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              <Link to="/agregarproducto">Agregar Producto</Link>
            </button>
            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              <Link to="/agregarproducto">Agregar Categoria</Link>
            </button>
            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              <Link to="/agregarproducto">Agregar Proveedor</Link>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">Nombre</th>
                  <th className="py-2 px-4 text-left">Descripción</th>
                  <th className="py-2 px-4 text-left">Precio</th>
                  <th className="py-2 px-4 text-left">Stock</th>
                  <th className="py-2 px-4 text-left">Categoría</th>
                  <th className="py-2 px-4 text-left">Ganancia</th>
                  <th className="py-2 px-4 text-left">Vencimiento</th>
                  <th className="py-2 px-4 text-left">Proveedor</th>
                  <th className="py-2 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id} className="border-b border-gray-200">
                    <td className="py-2 px-4">{producto.nombre}</td>
                    <td className="py-2 px-4">{producto.descripcion}</td>
                    <td className="py-2 px-4">₡{producto.precio}</td>
                    <td className="py-2 px-4">{producto.stock}</td>
                    <td className="py-2 px-4">{producto.id_categoria}</td>
                    <td className="py-2 px-4">
                      {producto.procentaje_ganancia}%
                    </td>
                    <td className="py-2 px-4">{producto.fecha_vencimiento}</td>
                    <td className="py-2 px-4">{producto.id_proveedor}</td>
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
        </div>
      </div>
    </>
  );
};

export default Inventario;
