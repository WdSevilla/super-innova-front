import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supaBaseClient";
import Swal from "sweetalert2";
import SideBar from "./SideBar";
import AgregarCategoria from "./AgregarCategoria";
import AgregarProveedor from "./AgregarProveedor";

const Inventario = () => {
  const [productos, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    try {
      const { data, error } = await supabase.from("productos").select(`
        id,
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

  // Eliminar producto
  const eliminarProducto = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const { error } = await supabase.from("productos").delete().eq("id", id);
        if (error) throw error;
        setProducts(productos.filter((producto) => producto.id !== id));
        Swal.fire("Eliminado", "El producto ha sido eliminado", "success");
      } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        Swal.fire("Error", "Hubo un error al eliminar el producto", "error");
      }
    }
  };

  // Redirigir a la página de edición con los datos del producto
  const actualizarProducto = (id) => {
     navigate(`/actualizarproducto/${id}`); // Redirigir al componente de edición
  };

  // Paginación
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const totalPages = Math.ceil(productos.length / itemsPerPage);

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
            <button className="bg-green-500 text-black px-6 py-2 rounded hover:bg-green-600">
              <AgregarCategoria />
            </button>
            <button className="bg-green-500 text-black px-6 py-2 rounded hover:bg-green-600">
              <AgregarProveedor />
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
                {currentProducts.map((producto) => (
                  <tr key={producto.id} className="border-b border-gray-200">
                    <td className="py-2 px-4">{producto.nombre}</td>
                    <td className="py-2 px-4">{producto.descripcion}</td>
                    <td className="py-2 px-4">₡{producto.precio}</td>
                    <td className="py-2 px-4">{producto.stock}</td>
                    <td className="py-2 px-4">{producto.id_categoria}</td>
                    <td className="py-2 px-4">{producto.procentaje_ganancia}%</td>
                    <td className="py-2 px-4">{producto.fecha_vencimiento}</td>
                    <td className="py-2 px-4">{producto.id_proveedor}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                        onClick={() => actualizarProducto(producto.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => eliminarProducto(producto.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="flex justify-center mt-4">
              <button
                className={`mr-2 px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className={`ml-2 px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventario;
