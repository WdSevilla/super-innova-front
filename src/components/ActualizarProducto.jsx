import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supaBaseClient";
import SideBar from "./SideBar";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Importar SweetAlert2

const EditarProducto = () => {
  const [product, setProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    id_categoria: "",
    procentaje_ganancia: 0,
    codigo_producti:0,
    fecha_vencimiento: "",
    id_proveedor: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el ID del producto desde la URL

  // Cargar datos actuales del producto
  useEffect(() => {
    const fetchProducto = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .single(); // Obtener un solo producto

      if (error) {
        console.error("Error al cargar el producto:", error.message);
      } else {
        setProduct(data); // Establecer los datos del producto en el estado
      }
    };

    const fetchCategorias = async () => {
      const { data, error } = await supabase.from("categorias").select("nombre");
      if (!error) {
        setCategorias(data);
      } else {
        console.error("Error al cargar categorías:", error.message);
      }
    };

    const fetchProveedores = async () => {
      const { data, error } = await supabase.from("proveedores").select("nombre");
      if (!error) {
        setProveedores(data);
      } else {
        console.error("Error al cargar proveedores:", error.message);
      }
    };

    fetchProducto();
    fetchCategorias();
    fetchProveedores();
  }, [id]);

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
        .update({
          ...product,
       
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      Swal.fire({
        title: 'Producto actualizado',
        text: 'El producto se ha actualizado correctamente.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate(-1); // Redirige a la página anterior
      });
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message);

      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al actualizar el producto. Intenta nuevamente.',
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
            className=" mx-auto bg-white rounded-lg flex flex-col space-y-4"
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
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                Categoría
              </label>
              <select
                name="id_categoria"
                value={product.id_categoria}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
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
                Codigo Producto
              </label>
              <input
                type="number"
                name="codigo_producto"
                value={product.codigo_producto}
                onChange={handleChange}
                placeholder="Codigo de Producto"
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
                Proveedor
              </label>
              <select
                name="id_proveedor"
                value={product.id_proveedor}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Selecciona un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Actualizar Producto
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditarProducto;
