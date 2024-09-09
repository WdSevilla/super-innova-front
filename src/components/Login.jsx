import React, { useState } from "react";
import { supabase } from "../utils/supaBaseClient";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Importar el contexto de autenticación

const Login = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtener la función login del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("empleados")
        .select("*")
        .eq("nombre", username);

      if (error) {
        throw error;
      }

      if (data.length === 0) {
        Swal.fire({
          title: 'Error',
          text: 'El usuario no existe.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else {
        const user = data[0];
        Swal.fire({
          title: 'Éxito',
          text: 'Usuario encontrado.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Almacenar el usuario en el contexto (incluyendo el puesto)
          login(user);

          if (user.puesto === "Administrador") {
            navigate("/dashboard");
          } else if (user.puesto === "Empleado") { 
            navigate("/ventas"); // Redirigir al componente correspondiente según el puesto
          }
        });
      }
    } catch (error) {
      console.error("Error al verificar el usuario:", error.message);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al verificar el usuario. Inténtalo nuevamente.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome back!</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? "Loading..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
