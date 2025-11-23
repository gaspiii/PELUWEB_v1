import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminPages() {
  const navigate = useNavigate();
  const [paginas, setPaginas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos"); // todos, pendiente, aprobado, rechazado

  useEffect(() => {
    // Verificar si el usuario es admin
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || user?.rol !== "admin") {
      alert("Acceso restringido. Solo administradores.");
      navigate("/login");
      return;
    }

    fetchPaginas();
  }, [navigate]);

  const fetchPaginas = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/salons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error("Error al cargar páginas");
      }

      const data = await res.json();
      setPaginas(data);
    } catch (error) {
      console.error("Error cargando páginas:", error);
      alert("Error al cargar las páginas");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, estado) => {
    if (!confirm(`¿Estás seguro de ${estado === "aprobado" ? "aprobar" : "rechazar"} esta peluquería?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/salons/${id}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado }),
      });

      if (res.ok) {
        const updated = await res.json();
        setPaginas(paginas.map(p => p._id === id ? updated.salon : p));
        alert(`Peluquería ${estado} exitosamente`);
      } else {
        const error = await res.json();
        alert(error.error || "Error cambiando estado");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  const paginasFiltradas = paginas.filter(p => {
    if (filtroEstado === "todos") return true;
    return p.estado === filtroEstado;
  });

  const estadisticas = {
    total: paginas.length,
    pendientes: paginas.filter(p => p.estado === "pendiente").length,
    aprobadas: paginas.filter(p => p.estado === "aprobado").length,
    rechazadas: paginas.filter(p => p.estado === "rechazado").length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-2">
              Gestión de Páginas
            </h1>
            <p className="text-gray-400">Administra y aprueba las peluquerías registradas</p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/70 p-4 rounded-xl border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Total</p>
              <p className="text-3xl font-bold text-white">{estadisticas.total}</p>
            </div>
            <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/30">
              <p className="text-yellow-400 text-sm mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-400">{estadisticas.pendientes}</p>
            </div>
            <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30">
              <p className="text-emerald-400 text-sm mb-1">Aprobadas</p>
              <p className="text-3xl font-bold text-emerald-400">{estadisticas.aprobadas}</p>
            </div>
            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
              <p className="text-red-400 text-sm mb-1">Rechazadas</p>
              <p className="text-3xl font-bold text-red-400">{estadisticas.rechazadas}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFiltroEstado("todos")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filtroEstado === "todos"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroEstado("pendiente")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filtroEstado === "pendiente"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFiltroEstado("aprobado")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filtroEstado === "aprobado"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
              }`}
            >
              Aprobadas
            </button>
            <button
              onClick={() => setFiltroEstado("rechazado")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filtroEstado === "rechazado"
                  ? "bg-red-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
              }`}
            >
              Rechazadas
            </button>
          </div>

          {/* Lista de Páginas */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Cargando páginas...</p>
            </div>
          ) : paginasFiltradas.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
              <p className="text-gray-400 text-lg">
                {filtroEstado === "todos" 
                  ? "No hay páginas creadas" 
                  : `No hay páginas con estado: ${filtroEstado}`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginasFiltradas.map((p) => (
                <div 
                  key={p._id} 
                  className="bg-gray-900/70 p-6 rounded-xl border border-gray-800/60 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{p.nombre}</h3>
                      {p.slogan && (
                        <p className="text-emerald-400 text-sm italic">{p.slogan}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.estado === "aprobado"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : p.estado === "rechazado"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                    </span>
                  </div>

                  {/* Información */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {p.email}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {p.telefono}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {p.direccion}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-emerald-400 font-mono text-xs">/salon/{p.slug}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 mt-4">
                    {p.estado !== "aprobado" && (
                      <button
                        onClick={() => changeStatus(p._id, "aprobado")}
                        className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Aprobar
                      </button>
                    )}
                    {p.estado !== "rechazado" && (
                      <button
                        onClick={() => changeStatus(p._id, "rechazado")}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                        title="Rechazar y eliminar permanentemente"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Rechazar y Eliminar
                      </button>
                    )}
                  </div>

                  {/* Ver sitio si está aprobado */}
                  {p.estado === "aprobado" && (
                    <a
                      href={`/salon/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold transition-colors text-emerald-400"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Ver sitio web
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}