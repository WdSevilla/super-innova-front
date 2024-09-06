import { useState } from "react";
import { supabase } from "../utils/supaBaseClient";

const AddCategoryModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Estado para el mensaje de éxito

  const openModal = () => {
    setIsOpen(true);
    setError(null); // Limpiar el mensaje de error
    setSuccess(null); // Limpiar el mensaje de éxito
  };

  const closeModal = () => {
    setIsOpen(false);
    setCategoryName("");
    setError(null);
    setSuccess(null);
  };

  const handleCategorySubmit = async () => {
    if (!categoryName.trim()) {
      setError("El nombre de la categoría es requerido");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase.from("categorias").insert([{ nombre: categoryName }]);

      if (error) {
        throw error;
      }

      setSuccess("Categoría creada con éxito"); // Mensaje de éxito
      setCategoryName(""); // Limpiar el campo de texto
    } catch (error) {
      setError("Error al crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={openModal} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
        Agregar Categoría
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Agregar Categoría</h2>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nombre de la categoría"
              className="w-full border p-2 mb-4"
            />

            {/* Mostrar mensaje de error */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Mostrar mensaje de éxito */}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            <div className="flex justify-end">
              <button
                onClick={handleCategorySubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Agregar Categoría"}
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

export default AddCategoryModal;
