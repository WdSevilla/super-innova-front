
import { Link } from 'react-router-dom';

const SideBar = () => {
return (
    <aside className="min-w-1/5 bg-blue-500 p-4">
    <div className="bg-gray-300 h-24 w-full mb-4"></div>
    <nav>
      <ul className="space-y-2">
        <li><Link to="/dashboard" className="text-white block py-2">Dashboard</Link></li>
        <li><a href="#" className="text-white block py-2">Gestión de Inventarios</a></li>
        <li><a href="#" className="text-white block py-2">Reporte de Ventas</a></li>
        <li><a href="#" className="text-white block py-2">Administración de Productos</a></li>
        <li><a href="#" className="text-white block py-2">Gestión del Sistema</a></li>
      </ul>
    </nav>
  </aside>
)

};

export default SideBar;