import React from 'react';

function Dashboard() {
  const menuItems = [
    { name: 'Venta', img: '/assets/selling.png', bgColor: 'bg-green-300' },
    { name: 'Inventario', img: './assets/inventory.png', bgColor: 'bg-red-300' },
    { name: 'Empleados', img: './assets/employees.png', bgColor: 'bg-yellow-300' },
    { name: 'Facturas', img: '/assets/receipt.png', bgColor: 'bg-purple-300' },
    { name: 'Clientes', img: '/assets/rating.png', bgColor: 'bg-blue-300' },
    { name: 'Impresoras', img: '/assets/printer.png', bgColor: 'bg-red-300' },
    { name: 'Ajustes', img: '/assets/settings.png', bgColor: 'bg-green-300' },
  ];

  return (
    <div className="min-h-screen bg-blue-500 flex flex-col items-center pt-10">
      <h1 className="text-white text-3xl mb-8">SUPER INNOVA</h1>
      <div className="grid grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`w-40 h-40 rounded-xl flex flex-col items-center justify-center text-black ${item.bgColor}`}
          >
            <img src={item.img} alt={item.name} className="w-16 h-16 mb-4" />
            <p className="text-lg">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
