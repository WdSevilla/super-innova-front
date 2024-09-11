import React, { useState } from 'react';
import { supabase } from '../utils/supaBaseClient'; // Importa supabase
import SideBar from './SideBar';
import BarraUsuario from './BarraUsuario';

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({ codigo: '', nombre: '', cantidad: 1, precio: 0 });
  const [cliente, setCliente] = useState({ nombre: '', correo: '', cedula: '', telefono: '', direccion: '', razonSocial: '' });
  const [total, setTotal] = useState(0);
  const [productosSugeridos, setProductosSugeridos] = useState([]);

  // Filtrar productos por nombre
  const filtrarPorNombre = async (nombre) => {
    const { data, error } = await supabase
      .from('productos')
      .select('codigo_producto, nombre, precio, id')
      .ilike('nombre', `%${nombre}%`);

    if (error) {
      console.error('Error buscando productos por nombre:', error);
    } else {
      setProductosSugeridos(data);
    }
  };

  // Filtrar productos por código
// Filtrar productos por código si es numérico
// Filtrar productos por código si es numérico
const filtrarPorCodigo = async (codigo) => {
  // Verifica el valor de código
  console.log('Buscando código:', codigo);

  // Convierte el código a número entero
  const codigoNumero = parseFloat(codigo);

  // Realiza la consulta con `eq`
  const { data, error } = await supabase
    .from('productos')
    .select('codigo_producto, nombre, precio, id')
    .eq('codigo_producto', codigoNumero);  // Usar `eq` para comparación exacta

  if (error) {
    console.error('Error buscando productos por código:', error);
  } else {
    console.log('Productos encontrados:', data); // Verifica los resultados
    setProductosSugeridos(data);
  }
};


  // Manejar cambios en los campos de producto
const handleProductoChange = async (e) => {
  const { name, value } = e.target;
  setProducto({ ...producto, [name]: value });

  if (value.length > 0) {
    if (name === 'nombre') {
      await filtrarPorNombre(value);
    } else if (name === 'codigo') {
      // Verifica que el código ingresado sea un número válido
      const codigoNumero = parseFloat(value);
      if (!isNaN(codigoNumero)) {
        await filtrarPorCodigo(value);
      } else {
        console.log('El código ingresado no es válido');
        setProductosSugeridos([]); // Limpiar sugerencias si el código no es válido
      }
    }

    // Si estamos buscando por código y solo hay un producto, seleccionarlo automáticamente
    if (name === 'codigo' && productosSugeridos.length === 1) {
      seleccionarProducto(productosSugeridos[0]);
    }
  } else {
    setProductosSugeridos([]); // Limpiar sugerencias si no hay búsqueda
  }
};


  // Agregar producto a la tabla
  const agregarProducto = () => {
    // Verificar si el producto ya está en la lista usando el código del producto
    const productoExistente = productos.find((prod) => prod.codigo === producto.codigo);
  
    if (productoExistente) {
      // Si el producto ya está, incrementar la cantidad
      const productosActualizados = productos.map((prod) => {
        if (prod.codigo === producto.codigo) {
          return {
            ...prod,
            cantidad: prod.cantidad + producto.cantidad, // Incrementar la cantidad
            subtotal: (prod.cantidad + producto.cantidad) * prod.precio // Actualizar el subtotal
          };
        }
        return prod;
      });
  
      setProductos(productosActualizados);
    } else {
      // Si el producto no está, agregar uno nuevo
      const nuevoProducto = { ...producto, subtotal: producto.cantidad * producto.precio };
      setProductos([...productos, nuevoProducto]);
    }
  
    // Calcular el nuevo total
    const nuevoTotal = productos.reduce((acc, prod) => acc + prod.subtotal, 0) + producto.cantidad * producto.precio;
    setTotal(nuevoTotal);
  
    // Limpiar el input de producto
    setProducto({ codigo: '', nombre: '', cantidad: 1, precio: 0 });
    setProductosSugeridos([]); // Limpiar sugerencias después de agregar el producto
  };
  

  // Cuando el usuario selecciona un producto de la lista sugerida o automáticamente por código
  const seleccionarProducto = (productoSeleccionado) => {
    setProducto({
      nombre: productoSeleccionado.nombre,
      codigo: productoSeleccionado.codigo_producto, // Actualizamos el campo de código
      precio: productoSeleccionado.precio,
      cantidad: 1, // Por defecto 1 unidad
    });
    setProductosSugeridos([]); // Limpiar las sugerencias al seleccionar un producto
  };

  // Procesar la venta
  const procesarVenta = async () => {
    try {
      const { data: venta, error: ventaError } = await supabase
        .from('ventas')
        .insert([
          {
            fecha: new Date().toISOString(),
            id_cliente: cliente.id_cliente, // Reemplaza con el ID real del cliente
            id_empleado: cliente.id_empleado, // ID del empleado que está realizando la venta
            total: total,
          },
        ])
        .single();

      if (ventaError) throw ventaError;

      const detalleVentaPromises = productos.map(async (prod) => {
        const { error: detalleVentaError } = await supabase
          .from('detalle_ventas')
          .insert([
            {
              venta_id: venta.id,  // ID de la venta que acabamos de insertar
              producto_id: prod.codigo,  // ID del producto vendido
              cantidad: prod.cantidad,
              precio_unitario: prod.precio,
            },
          ]);

        if (detalleVentaError) throw detalleVentaError;
      });

      await Promise.all(detalleVentaPromises);  // Esperar a que todas las inserciones de detalle de ventas terminen

      alert('Venta procesada con éxito');
      setProductos([]);
      setTotal(0);
    } catch (error) {
      console.error('Error al procesar la venta:', error.message);
      alert('Hubo un error al procesar la venta.');
    }
  };

  return (
    <>
      <BarraUsuario />
      <div className="min-h-screen flex">
        <SideBar />
        <main className="flex-1 p-4">
          <section className="mb-4">
            {/* Formulario de datos del cliente */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block">Cliente</label>
                <input
                  type="text"
                  name="nombre"
                  value={cliente.nombre}
                  onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                  className="w-full border p-2"
                  placeholder="Nombre del cliente"
                />
              </div>
            </div>
          </section>

          {/* Sección de productos */}
          <section>
            <h2 className="text-xl mb-4">Agregar Producto</h2>
            <div className="grid grid-cols-5 gap-4">
              <input
                type="number"
                name="codigo"
                value={producto.codigo}
                onChange={handleProductoChange}
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
              <input
                type="number"
                name="cantidad"
                value={producto.cantidad}
                onChange={(e) => setProducto({ ...producto, cantidad: e.target.value })}
                placeholder="Cantidad"
                className="border p-2"
                min="1"
              />
              <input
                type="number"
                name="precio"
                value={producto.precio}
                onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
                placeholder="Precio"
                className="border p-2"
                min="0"
              />
              <button className="bg-blue-500 text-white py-2 px-4" onClick={agregarProducto}>
                Agregar
              </button>
            </div>

            {/* Mostrar sugerencias de productos cuando se escribe en el campo nombre o código */}
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

            {/* Tabla de productos agregados */}
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Item</th>
                  <th className="border border-gray-300 p-2">Código</th>
                  <th className="border border-gray-300 p-2">Producto</th>
                  <th className="border border-gray-300 p-2">Cantidad</th>
                  <th className="border border-gray-300 p-2">Precio</th>
                  <th className="border border-gray-300 p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{producto.codigo}</td>
                    <td className="border border-gray-300 p-2">{producto.nombre}</td>
                    <td className="border border-gray-300 p-2">{producto.cantidad}</td>
                    <td className="border border-gray-300 p-2">{producto.precio}</td>
                    <td className="border border-gray-300 p-2">{producto.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mostrar total */}
            <h2 className="text-xl mt-4">Total: {total.toFixed(2)}</h2>
            <button className="mt-4 bg-green-500 text-white py-2 px-4" onClick={procesarVenta}>
              Procesar Venta
            </button>
          </section>
        </main>
      </div>
    </>
  );
};

export default Ventas;



// import React, { useState } from 'react';
// import { supabase } from '../utils/supaBaseClient'; // Importa supabase
// import SideBar from './SideBar';
// import BarraUsuario from './BarraUsuario';
// const Ventas = () => {
//   const [productos, setProductos] = useState([]);
//   const [producto, setProducto] = useState({ codigo: '', nombre: '', cantidad: 1, precio: 0, impuesto: 0 });
//   const [cliente, setCliente] = useState({ nombre: '', correo: '', cedula: '', telefono: '', direccion: '', razonSocial: '' });
//   const [total, setTotal] = useState(0);
//   const [productosSugeridos, setProductosSugeridos] = useState([]);

//   // Manejar cambios en los campos de producto
//   const handleProductoChange = async (e) => {
//     const { name, value } = e.target;
//     setProducto({ ...producto, [name]: value });

//     // Si estamos escribiendo en el campo de nombre de producto, buscar productos en la base de datos
//     if (name === 'nombre' && value.length > 0) {
//       const { data, error } = await supabase
//         .from('productos')  // Nombre de tu tabla de productos
//         .select('nombre, precio, id') // Seleccionamos solo los campos relevantes
//         .ilike('nombre', `%${value}%`);  // Buscar productos que coincidan parcialmente

//       if (error) {
//         console.error('Error buscando productos:', error);
//       } else {
//         setProductosSugeridos(data); // Actualizar la lista de productos sugeridos
//       }
//     } else {
//       setProductosSugeridos([]); // Limpiar sugerencias si no hay búsqueda
//     }
//   };

//   // Agregar producto a la tabla
//   const agregarProducto = () => {
//     const nuevoProducto = { ...producto, subtotal: producto.cantidad * producto.precio };
//     setProductos([...productos, nuevoProducto]);

//     // Calcular el nuevo total
//     const nuevoTotal = total + nuevoProducto.subtotal;
//     setTotal(nuevoTotal);

//     // Limpiar el input de producto
//     setProducto({ codigo: '', nombre: '', cantidad: 1, precio: 0});
//     setProductosSugeridos([]); // Limpiar sugerencias después de agregar el producto
//   };

//   // Cuando el usuario selecciona un producto de la lista sugerida
//   const seleccionarProducto = (productoSeleccionado) => {
//     setProducto({
//       nombre: productoSeleccionado.nombre,
//       precio: productoSeleccionado.precio,
//       cantidad: 1, // Por defecto 1 unidad
//       codigo: productoSeleccionado.id,
//     });
//     setProductosSugeridos([]); // Limpiar las sugerencias al seleccionar un producto
//   };



//     // Cuando el usuario selecciona un cliente de la lista sugerida
//     const seleccionarCliente = (ClienteSeleccionado) => {
//       setCliente({
//         nombre: productoSeleccionado.nombre,
//         precio: productoSeleccionado.precio,
//         cantidad: 1, // Por defecto 1 unidad
//         codigo: productoSeleccionado.id,
//       });
//       setProductosSugeridos([]); // Limpiar las sugerencias al seleccionar un producto
//     };
// // Procesar la venta
// const procesarVenta = async () => {
//   try {
//     // 1. Registrar la venta en la tabla 'ventas'
//     const { data: venta, error: ventaError } = await supabase
//       .from('ventas')
//       .insert([
//         {
//           fecha: new Date().toISOString(),
//           id_cliente: cliente.id_cliente, // Reemplaza con el ID real del cliente
//           id_empleado: cliente.id_empleado, // ID del empleado que está realizando la venta
//           total: total,
//         },
//       ])
//       .single();

//     if (ventaError) throw ventaError;

//     // 2. Registrar cada detalle de la venta en la tabla 'detalle_ventas'
//     const detalleVentaPromises = productos.map(async (prod) => {
//       const { error: detalleVentaError } = await supabase
//         .from('detalle_ventas')
//         .insert([
//           {
//             venta_id: venta.id,  // ID de la venta que acabamos de insertar
//             producto_id: prod.codigo,  // ID del producto vendido
//             cantidad: prod.cantidad,
//             precio_unitario: prod.precio,
//           },
//         ]);

//       if (detalleVentaError) throw detalleVentaError;
//     });

//     await Promise.all(detalleVentaPromises);  // Esperar a que todas las inserciones de detalle de ventas terminen

//     alert('Venta procesada con éxito');
//     // Resetear la venta después de procesar
//     setProductos([]);
//     setTotal(0);
//   } catch (error) {
//     console.error('Error al procesar la venta:', error.message);
//     alert('Hubo un error al procesar la venta.');
//   }
// };
//   return (
//     <>
//     <BarraUsuario/>
//     <div className="min-h-screen flex">
//       <SideBar />
//       <main className="flex-1 p-4">
//         <section className="mb-4">
//           {/* Formulario de datos del cliente */}
//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <label className="block">Cliente</label>
//               <input
//                 type="text"
//                 name="nombre"
//                 value={cliente.nombre}
//                 onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
//                 className="w-full border p-2"
//                 placeholder="Nombre del cliente"
//               />
//             </div>
//             {/* Campos adicionales del cliente aquí... */}
//           </div>
//         </section>

//         {/* Sección de productos */}
//         <section>
//           <h2 className="text-xl mb-4">Agregar Producto</h2>
//           <div className="grid grid-cols-5 gap-4">
//             <input
//               type="text"
//               name="nombre"
//               value={producto.nombre}
//               onChange={handleProductoChange}
//               placeholder="Producto"
//               className="border p-2"
//             />
//             <input
//               type="number"
//               name="cantidad"
//               value={producto.cantidad}
//               onChange={(e) => setProducto({ ...producto, cantidad: e.target.value })}
//               placeholder="Cantidad"
//               className="border p-2"
//               min="1"
//             />
//             <input
//               type="number"
//               name="precio"
//               value={producto.precio}
//               onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
//               placeholder="Precio"
//               className="border p-2"
//               min="0"
//             />
//             <button className="bg-blue-500 text-white py-2 px-4" onClick={agregarProducto}>
//               Agregar
//             </button>
//           </div>

//           {/* Mostrar sugerencias de productos */}
//           {productosSugeridos.length > 0 && (
//             <ul className="border border-gray-300 mt-2">
//               {productosSugeridos.map((productoSugerido) => (
//                 <li
//                   key={productoSugerido.id}
//                   className="p-2 cursor-pointer hover:bg-gray-200"
//                   onClick={() => seleccionarProducto(productoSugerido)}
//                 >
//                   {productoSugerido.nombre}
//                 </li>
//               ))}
//             </ul>
//           )}

//           {/* Tabla de productos agregados */}
//           <table className="w-full border-collapse border border-gray-300 mt-4">
//             <thead>
//               <tr>
//                 <th className="border border-gray-300 p-2">Item</th>
//                 <th className="border border-gray-300 p-2">Código</th>
//                 <th className="border border-gray-300 p-2">Producto</th>
//                 <th className="border border-gray-300 p-2">Cantidad</th>
//                 <th className="border border-gray-300 p-2">Precio</th>
//                 <th className="border border-gray-300 p-2">Subtotal</th>
//               </tr>
//             </thead>
//             <tbody>
//               {productos.map((producto, index) => (
//                 <tr key={index}>
//                   <td className="border border-gray-300 p-2">{index + 1}</td>
//                   <td className="border border-gray-300 p-2">{producto.codigo}</td>
//                   <td className="border border-gray-300 p-2">{producto.nombre}</td>
//                   <td className="border border-gray-300 p-2">{producto.cantidad}</td>
//                   <td className="border border-gray-300 p-2">{producto.precio}</td>
//                   <td className="border border-gray-300 p-2">{producto.subtotal.toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Mostrar total */}
//           <h2 className="text-xl mt-4">Total: {total.toFixed(2)}</h2>
//           <button className="mt-4 bg-green-500 text-white py-2 px-4" onClick={procesarVenta}>
//             Procesar Venta
//           </button>
//         </section>
//       </main>
//     </div>
//     </>
//   );
// };

// export default Ventas;
