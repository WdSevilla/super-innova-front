// eslint-disable-next-line no-unused-vars
import React from 'react';
import BarraUsuario from './BarraUsuario';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Importa el contexto de autenticación para obtener el rol del usuario

function Dashboard() {
  const { user } = useAuth(); // Obtiene la información del usuario desde el contexto

  // Menú completo para administradores
  const menuItemsAdmin = [
    { name: 'Venta', img: '/assets/selling.png', bgColor: 'bg-green-300', link: '/ventas'},
    { name: 'Inventario', img: './assets/inventory.png', bgColor: 'bg-red-300', link: '/inventario' },
    { name: 'Empleados', img: './assets/employees.png', bgColor: 'bg-yellow-300', link: '/empleados' },
    { name: 'Facturas', img: '/assets/receipt.png', bgColor: 'bg-purple-300', link: '/facturas' },
    { name: 'Clientes', img: '/assets/rating.png', bgColor: 'bg-blue-300', link: '/clientes' },
    { name: 'Impresoras', img: '/assets/printer.png', bgColor: 'bg-red-300' },
    { name: 'Ajustes', img: '/assets/settings.png', bgColor: 'bg-green-300' },
  ];

  // Menú limitado para empleados
  const menuItemsEmployee = [
    { name: 'Venta', img: '/assets/selling.png', bgColor: 'bg-green-300', link: '/ventas' },
  ];

  // Definir qué menú mostrar basado en el rol del usuario
  const menuItems = user.puesto === 'Administrador' ? menuItemsAdmin : menuItemsEmployee;

  return (
    <>
    <BarraUsuario/>
    <div className="min-h-screen bg-blue-500 flex flex-col items-center pt-10">
      <h1 className="text-white text-3xl mb-8">SUPER INNOVA</h1>
      <div className="grid grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className={`w-40 h-40 rounded-xl flex flex-col items-center justify-center text-black ${item.bgColor}`}
          >
            <img src={item.img} alt={item.name} className="w-16 h-16 mb-4" />
            <p className="text-lg">{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}

export default Dashboard;
