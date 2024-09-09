// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useAuth } from './context/AuthContext'; // Asegúrate de que el contexto de autenticación esté importado
import { useNavigate } from 'react-router-dom';

const BarraUsuario = () => {
  const { user, logout } = useAuth(); // Obtener el usuario y la función de cerrar sesión desde el contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Cierra la sesión del usuario
    navigate('/'); // Redirige al login después de cerrar sesión
  };

  return (
    <div className="bg-blue-600 text-white py-1 px-6 flex justify-between items-center">
      {/* Mensaje de bienvenida */}
      <h1 className="text-xl font-bold">Welcome, {user.nombre}</h1>

      {/* Botón de cerrar sesión */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Log out
      </button>
    </div>
  );
};

export default BarraUsuario;
