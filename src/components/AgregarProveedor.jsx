import { useState } from "react";
import { supabase } from "../utils/supaBaseClient";

const AgregarProveedor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Estado para el mensaje de éxito

  const openModal = () => {
    setIsOpen(true);
    setError(null); // Limpiar mensajes anteriores
    setSuccess(null);
  };

  const closeModal = () => {
    setIsOpen(false);
    setNombre("");
    setContacto("");
    setTelefono("");
    setEmail("");
    setError(null);
    setSuccess(null);
  };

  const handleProviderSubmit = async () => {
    if (!nombre.trim() || !contacto.trim() || !telefono.trim() || !email.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase.from("proveedores").insert([
        {
          nombre,
          contacto,
          telefono: parseInt(telefono), // Convertir teléfono a número
          email,
        },
      ]);

      if (error) {
        throw error;
      }

      setSuccess("Proveedor creado con éxito");
      setTimeout(() => {
        closeModal(); // Cerrar modal tras éxito
      }, 2000);

    } catch (error) {
      setError("Error al crear el proveedor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={openModal} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
        Agregar Proveedor
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Agregar Proveedor</h2>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del proveedor"
              className="w-full border p-2 mb-4"
            />
            <input
              type="text"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              placeholder="Persona de contacto"
              className="w-full border p-2 mb-4"
            />
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Teléfono"
              className="w-full border p-2 mb-4"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full border p-2 mb-4"
            />

            {/* Mostrar mensaje de error */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Mostrar mensaje de éxito */}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            <div className="flex justify-end">
              <button
                onClick={handleProviderSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Agregar Proveedor"}
              </button>
              <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgregarProveedor;
