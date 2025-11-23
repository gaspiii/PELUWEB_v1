import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Creation from "./pages/Creation";
import Booking from "./pages/Booking";
import PeluqueriaTemplate from "./templates/PeluqueriaTemplate";
import Citas from "./pages/Citas";
import Pagos from "./pages/Pagos"
import Clientes from "./pages/Clientes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterAdmin from "./pages/RegisterAdmin";
import Admin from "./pages/Admin";
import AdminFinanzas from "./pages/AdminFinanzas";
import AdminStats from "./pages/AdminStats";
import AdminPages from "./pages/AdminPages";
import AdminUsers from "./pages/AdminUsers";
import PeluqueriaPage from "./pages/PeluqueriaPage";
import './index.css'
import ReservaPage from "./pages/ReservaPage";

// Importamos el componente DocumentTitle desde un archivo externo (no se muestra en este código)
import DocumentTitle from "./components/DocumentTitle";

// Componente wrapper para agregar título
const RouteWithTitle = ({ element, title }) => {
  return (
    <>
      <DocumentTitle title={title} />
      {element}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RouteWithTitle element={<Landing />} title="Peluweb - Tu Peluquería Online" />} />
        <Route path="/dashboard" element={<RouteWithTitle element={<Dashboard />} title="Dashboard - Peluweb" />} />
        <Route path="/booking" element={<RouteWithTitle element={<Booking />} title="Reservar - Peluweb" />} />
        <Route path="/creation" element={<RouteWithTitle element={<Creation />} title="Crear Sitio Web - Peluweb" />} />
        <Route path="/preview" element={<RouteWithTitle element={<PeluqueriaTemplate />} title="Vista Previa - Peluweb" />} />
        <Route path="/salon/:slug" element={<RouteWithTitle element={<PeluqueriaPage />} title="Peluquería - Peluweb" />} />
        <Route path="/salon/:slug/reservar" element={<RouteWithTitle element={<ReservaPage />} title="Reservar Cita - Peluweb" />} />
        <Route path="/dashboard/citas" element={<RouteWithTitle element={<Citas />} title="Gestión de Citas - Peluweb" />} />
        <Route path="/dashboard/clientes" element={<RouteWithTitle element={<Clientes />} title="Gestión de Clientes - Peluweb" />} />
        <Route path="/dashboard/pagos" element={<RouteWithTitle element={<Pagos />} title="Pagos - Peluweb" />} />
        <Route path="/login" element={<RouteWithTitle element={<Login />} title="Iniciar Sesión - Peluweb" />} />
        <Route path="/register" element={<RouteWithTitle element={<Register />} title="Registrarse - Peluweb" />} />
        <Route path="/RegisterAdmin" element={<RouteWithTitle element={<RegisterAdmin />} title="Registro Admin - Peluweb" />} />
        <Route path="/admin" element={<RouteWithTitle element={<Admin />} title="Panel de Administración - Peluweb" />} />
        <Route path="/admin/finanzas" element={<RouteWithTitle element={<AdminFinanzas />} title="Finanzas - Peluweb" />} />
        <Route path="/admin/users" element={<RouteWithTitle element={<AdminUsers />} title="Usuarios - Peluweb" />} />
        <Route path="/admin/stats" element={<RouteWithTitle element={<AdminStats />} title="Estadísticas - Peluweb" />} />
        <Route path="/admin/pages" element={<RouteWithTitle element={<AdminPages />} title="Páginas - Peluweb" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;