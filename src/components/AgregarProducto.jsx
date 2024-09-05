import React, { useState } from "react";
import { supabase } from "../utils/supaBaseClient";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importar SweetAlert2

const AgregarProducto = () => {
  const [product, setProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    id_categoria: "",
    procentaje_ganancia: 0,
    fecha_vencimiento: "",
    id_proveedor: "",
  });

  const navigate = useNavigate(); // Para redirigir

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("productos")
        .insert([
          {
            ...product,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        throw error;
      }

      console.log("Producto creado:", data);

      // Mostrar alerta de éxito usando SweetAlert2
      Swal.fire({
        title: 'Producto creado',
        text: 'El producto se ha creado correctamente.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        // Redirigir a la pantalla anterior
        navigate(-1); // Redirige a la página anterior
      });

      // Resetear el formulario
      setProduct({
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        id_categoria: "",
        procentaje_ganancia: 0,
        fecha_vencimiento: "",
        id_proveedor: "",
      });
    } catch (error) {
      console.error("Error al crear el producto:", error.message);

      // Mostrar alerta de error usando SweetAlert2
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al crear el producto. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <>
      <div className="min-h-screen flex">
        <SideBar />
        <div className="w-3/4 p-2">
          <form
            onSubmit={handleSubmit}
            className=" mx-auto bg-white  rounded-lg flex flex-col space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={product.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                required
                className="mt-1 p-2 block w-full  border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={product.descripcion}
                onChange={handleChange}
                placeholder="Descripción"
                required
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Precio
              </label>
              <input
                type="number"
                name="precio"
                value={product.precio}
                onChange={handleChange}
                placeholder="Precio"
                step="0.01"
                required
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="Stock"
                required
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoría ID
              </label>
              <input
                type="text"
                name="id_categoria"
                value={product.id_categoria}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Porcentaje Ganancia
              </label>
              <input
                type="number"
                name="procentaje_ganancia"
                value={product.procentaje_ganancia}
                onChange={handleChange}
                placeholder="Porcentaje de Ganancia"
                step="0.01"
                required
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Vencimiento
              </label>
              <input
                type="date"
                name="fecha_vencimiento"
                value={product.fecha_vencimiento}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Proveedor ID
              </label>
              <input
                type="text"
                name="id_proveedor"
                value={product.id_proveedor}
                onChange={handleChange}
                placeholder="ID del Proveedor"
                required
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Crear Producto
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AgregarProducto;
