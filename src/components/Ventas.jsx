import React, { useState } from "react";
import { supabase } from "../utils/supaBaseClient"; // Importa supabase
import SideBar from "./SideBar";
import BarraUsuario from "./BarraUsuario";

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({
    codigo: "",
    nombre: "",
    cantidad: 1,
    precio: 0,
  });
  const [cliente, setCliente] = useState({
    id_cliente:0,
  });
  const [detalle, setDetalle]= useState({
    venta_id:0,
    producto_id:0,
    cantidad:0,
    precio_initario:0,
  });
  const [total, setTotal] = useState(0);
  const [productosSugeridos, setProductosSugeridos] = useState([]);

  // Filtrar productos por nombre
  const filtrarPorNombre = async (nombre) => {
    const { data, error } = await supabase
      .from("productos")
      .select("codigo_producto, nombre, precio, id")
      .ilike("nombre", `%${nombre}%`);

    if (error) {
      console.error("Error buscando productos por nombre:", error);
    } else {
      setProductosSugeridos(data);
    }
  };

 
 // Filtrar por id Cliente
 const filtrarPorId = async (id) => {
  const codigoId = parseFloat(id);

  const { data, error } = await supabase
    .from('clientes')
    .select('id')
    .eq('id', codigoId);

  if (error) {
    console.error('Error buscando productos por código:', error);
    return { data: [], error };
  }

  return { data };
};


  // Filtrar productos por código
  const filtrarPorCodigo = async (codigo) => {
    const codigoNumero = parseFloat(codigo);
  
    const { data, error } = await supabase
      .from('productos')
      .select('codigo_producto, nombre, precio, id')
      .eq('codigo_producto', codigoNumero);
  
    if (error) {
      console.error('Error buscando productos por código:', error);
      return { data: [], error };
    }
  
    return { data };
  };

  // Obtener los datos del producto
  const obtenerDatosProducto = async (codigo) => {
    const { data: productoData, error } = await filtrarPorCodigo(codigo);
    
    if (error) {
      console.error('Error obteniendo datos del producto:', error);
      return null;
    }
    
    return productoData.length > 0 ? productoData[0] : null;
  };

  const handleProcesarVenta = async () => {
    // Datos de la venta general
    const ventaData = {
        fecha: new Date(),
        nombre_cliente: clienteSeleccionado,
        id_empleado: empleadoSesion, // Obtener el ID del empleado de la sesión actual
        total: calcularTotal(), // Función que suma el total de la venta
    };

    // Insertar la venta en la tabla 'ventas' y obtener el 'venta_id'
    const { data: ventaInsertada, error } = await supabase
        .from('ventas')
        .insert([ventaData])
        .select('id')
        .single();

    if (error) {
        console.error('Error al crear la venta:', error);
        return;
    }

    const ventaId = ventaInsertada.id;

    // Llamar a la función para registrar los detalles de la venta
    registrarDetallesVenta(ventaId);
};

const registrarDetallesVenta = async (ventaId) => {
  // Supongamos que 'productosEnCarrito' es un array con los productos seleccionados
  const detalles = productosEnCarrito.map(producto => ({
      venta_id: ventaId,
      producto_id: producto.id, // ID del producto
      cantidad: producto.cantidad, // Cantidad ingresada por el usuario
      precio_unitario: producto.precio, // Precio del producto
      created_at: new Date() // Fecha actual
  }));

  const { error } = await supabase
      .from('detalle_ventas')
      .insert(detalles);

  if (error) {
      console.error('Error al crear los detalles de la venta:', error);
  } else {
      console.log('Detalles de venta registrados con éxito');
  }
};


  // Manejar cambios en los campos de producto
  const handleProductoChange = async (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });

    if (value.length > 0) {
      if (name === "nombre") {
        await filtrarPorNombre(value);
      } else if (name === "codigo") {
        const codigoNumero = parseFloat(value);
        if (!isNaN(codigoNumero)) {
          await filtrarPorCodigo(value);
        } else {
          console.log("El código ingresado no es válido");
          setProductosSugeridos([]); // Limpiar sugerencias si el código no es válido
        }
      }
    } else {
      setProductosSugeridos([]); // Limpiar sugerencias si no hay búsqueda
    }
  };

  // Agregar producto a la tabla
  const agregarProducto = async () => {
    const productoDatos = await obtenerDatosProducto(producto.codigo);
    
    if (productoDatos) {
      const productoCompleto = {
        ...producto,
        nombre: productoDatos.nombre,
        precio: productoDatos.precio,
        subtotal: producto.cantidad * productoDatos.precio,
      };

      const productoExistente = productos.find(
        (prod) => prod.codigo === productoCompleto.codigo
      );

      if (productoExistente) {
        const productosActualizados = productos.map((prod) => {
          if (prod.codigo === productoCompleto.codigo) {
            return {
              ...prod,
              cantidad: prod.cantidad + productoCompleto.cantidad,
              subtotal: (prod.cantidad + productoCompleto.cantidad) * productoCompleto.precio,
            };
          }
          return prod;
        });

        setProductos(productosActualizados);
      } else {
        setProductos([...productos, productoCompleto]);
      }

      const nuevoTotal =
        productos.reduce((acc, prod) => acc + prod.subtotal, 0) +
        productoCompleto.subtotal;
      setTotal(nuevoTotal);

      setProducto({ codigo: "", nombre: "", cantidad: 1, precio: 0 });
      setProductosSugeridos([]);
    } else {
      console.log("No se encontraron datos para el producto con el código:", producto.codigo);
    }
  };

  const handleCodigoKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Detener el comportamiento predeterminado del Enter
  
      const codigo = producto.codigo ? String(producto.codigo).trim() : "";
  
      if (codigo === "") {
        alert("Por favor, ingresa un código de producto válido.");
        return;
      }
  
      const { data: productosEncontrados } = await filtrarPorCodigo(codigo);
  
      if (productosEncontrados && productosEncontrados.length > 0) {
        const productoSeleccionado = productosEncontrados[0];
  
        setProducto({
          nombre: productoSeleccionado.nombre || producto.nombre,
          codigo: productoSeleccionado.codigo_producto || codigo,
          precio: productoSeleccionado.precio || producto.precio,
          cantidad: producto.cantidad || 1,
        });
  
        agregarProducto();
      } else {
        console.log("No se encontró el producto con ese código.");
      }
    }
  };

  // Seleccionar producto de la lista sugerida
  const seleccionarProducto = (productoSeleccionado) => {
    setProducto({
      nombre: productoSeleccionado.nombre,
      codigo: productoSeleccionado.codigo_producto,
      precio: productoSeleccionado.precio,
      cantidad: 1,
    });
    setProductosSugeridos([]);
  };

  const procesarVenta = async () => {
    try {
      const { data: venta, error: ventaError } = await supabase
        .from("ventas")
        .insert([
          {
            fecha: new Date().toISOString(),
            id_cliente: cliente.id_cliente,
            id_empleado: cliente.id_empleado,  
            total: total,
          },
        ])
        .select()
        .single();
  
      if (ventaError) throw ventaError;
  
      if (!venta || !venta.id) {
        throw new Error("No se pudo obtener el ID de la venta");
      }
  
      const detalleVentaPromises = productos.map(async (prod) => {
        const { error: detalleVentaError } = await supabase
          .from("detalles_ventas")
          .insert([
            {
              venta_id: venta.id,
              producto_id: prod.id,
              cantidad: prod.cantidad,
              precio_unitario: prod.precio,
            },
          ]);
  
        if (detalleVentaError) throw detalleVentaError;
      });
  
      await Promise.all(detalleVentaPromises);
      alert("Venta procesada con éxito");
      setProductos([]);
      setTotal(0);
    } catch (error) {
      console.error("Error al procesar la venta:", error.message);
      alert("Hubo un error al procesar la venta.");
    }
  };
  
  
  


  const eliminarFila = (index) => {
    const productosActualizados = productos.filter((_, i) => i !== index);
    setProductos(productosActualizados);
  
    const nuevoTotal = productosActualizados.reduce(
      (acc, prod) => acc + prod.subtotal,
      0
    );
    setTotal(nuevoTotal);
  };
  const disminuirCantidad = (index) => {
    const productoSeleccionado = productos[index];
  
    if (productoSeleccionado.cantidad > 1) {
      const productosActualizados = productos.map((prod, i) => {
        if (i === index) {
          const nuevaCantidad = prod.cantidad - 1;
          return {
            ...prod,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * prod.precio,
          };
        }
        return prod;
      });
  
      setProductos(productosActualizados);
  
      const nuevoTotal = productosActualizados.reduce(
        (acc, prod) => acc + prod.subtotal,
        0
      );
      setTotal(nuevoTotal);
    } else {
      eliminarFila(index); // Si la cantidad es 1, se elimina el producto
    }
  };
  
  return (
    <>
      <BarraUsuario />
      <div className="min-h-screen flex">
        <SideBar />
        <main className="flex-1 p-4">
          <section className="mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block">Cliente</label>
                <input
                  type="number"
                  name="id"
                  value={cliente.id_cliente}
                  onChange={(e) =>
                    setCliente({ ...cliente, id_cliente: e.target.value })
                  }
                  className="w-full border p-2"
                  placeholder="Nombre del cliente"
                />
              </div>
            </div>
          </section>

<section>
  <h2 className="text-xl mb-4">Agregar Producto</h2>
  <div className="grid grid-cols-5 gap-4">
    {/* Código y nombre del producto */}
    <input
      type="number"
      name="codigo"
      value={producto.codigo}
      onChange={handleProductoChange}
      onKeyDown={handleCodigoKeyDown}
      placeholder="Código del producto"
      className="border p-2"
    />
    <input
      type="text"
      name="nombre"
      value={producto.nombre}
      onChange={handleProductoChange}
      placeholder="Nombre del producto"
      className="border p-2"
    />
    {/* Cantidad y precio */}
    <input
      type="number"
      name="cantidad"
      value={producto.cantidad}
      onChange={(e) =>
        setProducto({ ...producto, cantidad: e.target.value })
      
      }
      placeholder="Cantidad"
      className="border p-2"
      min="1"
    />
    <input
      type="number"
      name="precio"
      value={producto.precio}
      onChange={(e) =>
        setProducto({ ...producto, precio: e.target.value })
      }
      placeholder="Precio"
      className="border p-2"
      min="0"
    />
    {/* Botón agregar producto */}
    <button
      className="bg-blue-500 text-white py-2 px-4"
      onClick={agregarProducto}
    >
      Agregar
    </button>
  </div>

  {/* Lista de productos sugeridos */}
  {productosSugeridos.length > 0 && (
    <ul className="border border-gray-300 mt-2">
      {productosSugeridos.map((productoSugerido) => (
        <li
          key={productoSugerido.id}
          className="p-2 cursor-pointer hover:bg-gray-200"
          onClick={() => seleccionarProducto(productoSugerido)}
        >
          {productoSugerido.nombre} - {productoSugerido.codigo_producto}
        </li>
      ))}
    </ul>
  )}

  {/* Detalle de la venta */}
  <table className="w-full border-collapse border border-gray-300 mt-4">
    <thead>
      <tr>
        <th className="border border-gray-300 p-2">#</th>
        <th className="border border-gray-300 p-2">Código</th>
        <th className="border border-gray-300 p-2">Nombre</th>
        <th className="border border-gray-300 p-2">Cantidad</th>
        <th className="border border-gray-300 p-2">Precio</th>
        <th className="border border-gray-300 p-2">Subtotal</th>
        <th className="border border-gray-300 p-2">Acciones</th>
      </tr>
    </thead>
    <tbody>
  {productos.map((producto, index) => (
    <tr key={index}>
      <td className="border border-gray-300 p-2">{index + 1}</td>
      <td className="border border-gray-300 p-2">{producto.codigo}</td>
      <td className="border border-gray-300 p-2">{producto.nombre}</td>
      <td className="border border-gray-300 p-2">{producto.cantidad}</td>
      <td className="border border-gray-300 p-2">{producto.precio.toFixed(2)}</td>
      <td className="border border-gray-300 p-2">{producto.subtotal.toFixed(2)}</td>
      <td className="border border-gray-300 p-2">
        <button
          className="bg-yellow-500 text-white px-2 py-1 mr-2"
          onClick={() => disminuirCantidad(index)}
        >
          Eliminar
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1"
          onClick={() => eliminarFila(index)}
        >
          Eliminar fila
        </button>
      </td>
    </tr>
  ))}
</tbody>

  </table>

  <h2 className="text-xl mt-4">Total: {total.toFixed(2)}</h2>


  <button
    className="bg-red-500 text-white py-2 px-4 mt-4"
    onClick={() => {
      setProductos([]);  
      setCliente({
        nombre: "",
        correo: "",
        cedula: "",
        telefono: "",
        direccion: "",
        razonSocial: "",
      });
      setTotal(0); 
      setProducto({ codigo: "", nombre: "", cantidad: 1, precio: 0 });
    }}
  >
    Limpiar Venta
  </button>

  <button
    className="bg-green-500 text-white py-2 px-4 mt-4"
    onClick={procesarVenta}
  >
    Procesar Venta
  </button>
</section>

        </main>
      </div>
    </>
  );
};

export default Ventas;
