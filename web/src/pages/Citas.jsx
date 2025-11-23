import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Citas() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("todos");

  // Obtener token del localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Obtener citas del backend
  const fetchBookings = async () => {
    try {
      const token = getToken();
      const res = await fetch("http://localhost:4000/api/bookings", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        console.error("Error cargando citas:", res.status);
        // Si hay error de autenticación, redirigir al login
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/login';
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error cargando citas:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Eliminar cita
  const deleteBooking = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta cita?")) return;
    
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:4000/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setBookings(bookings.filter((b) => b._id !== id));
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error al eliminar la cita");
      }
    } catch (error) {
      console.error("Error eliminando cita:", error);
      alert("Error de conexión");
    }
  };

  // Actualizar estado de cita
  const updateBookingStatus = async (id, nuevoEstado) => {
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:4000/api/bookings/${id}/estado`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (res.ok) {
        const data = await res.json();
        // Actualizar la cita en el estado local
        setBookings(bookings.map(booking => 
          booking._id === id ? data.booking : booking
        ));
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error al actualizar el estado");
      }
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("Error de conexión");
    }
  };

  // Filtrar citas por estado
  const filteredBookings = selectedStatus === "todos" 
    ? bookings 
    : bookings.filter(booking => booking.estado === selectedStatus);

  // Estadísticas rápidas
  const stats = {
    total: bookings.length,
    pendientes: bookings.filter(b => b.estado === 'pendiente').length,
    confirmadas: bookings.filter(b => b.estado === 'confirmada').length,
    completadas: bookings.filter(b => b.estado === 'completada').length,
    canceladas: bookings.filter(b => b.estado === 'cancelada').length,
  };

  const getStatusColor = (estado) => {
    const colors = {
      pendiente: "from-yellow-500 to-amber-500",
      confirmada: "from-emerald-500 to-green-500",
      completada: "from-blue-500 to-cyan-500",
      cancelada: "from-red-500 to-pink-500"
    };
    return colors[estado] || "from-gray-500 to-gray-600";
  };

  const getStatusText = (estado) => {
    const texts = {
      pendiente: "Pendiente",
      confirmada: "Confirmada",
      completada: "Completada",
      cancelada: "Cancelada"
    };
    return texts[estado] || estado;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              Gestión de Citas
            </h1>
            <p className="text-gray-400 text-lg">
              Gestiona y organiza todas las citas de tu peluquería
            </p>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[
              { key: 'total', label: 'Total', color: 'emerald', value: stats.total },
              { key: 'pendientes', label: 'Pendientes', color: 'yellow', value: stats.pendientes },
              { key: 'confirmadas', label: 'Confirmadas', color: 'emerald', value: stats.confirmadas },
              { key: 'completadas', label: 'Completadas', color: 'blue', value: stats.completadas },
              { key: 'canceladas', label: 'Canceladas', color: 'red', value: stats.canceladas },
            ].map((stat) => (
              <div key={stat.key} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/50 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filtros y Controles */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <label className="text-gray-300 font-medium">Filtrar por:</label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="confirmada">Confirmadas</option>
                <option value="completada">Completadas</option>
                <option value="cancelada">Canceladas</option>
              </select>
            </div>
            
            <button 
              onClick={fetchBookings}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Actualizar</span>
            </button>
          </div>

          {/* Lista de Citas */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400">Cargando citas...</p>
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No hay citas</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {selectedStatus === "todos" 
                  ? "No hay citas registradas en tu peluquería. Las nuevas reservas aparecerán aquí."
                  : `No hay citas con estado "${getStatusText(selectedStatus)}".`
                }
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left p-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Cliente</th>
                      <th className="text-left p-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Servicio</th>
                      <th className="text-left p-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Fecha y Hora</th>
                      <th className="text-left p-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Contacto</th>
                      <th className="text-left p-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Estado</th>
                      <th className="text-right p-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, index) => (
                      <tr 
                        key={booking._id}
                        className={`border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-200 ${
                          index === filteredBookings.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <td className="p-6">
                          <div>
                            <p className="font-semibold text-white">{booking.nombre}</p>
                            {booking.mensaje && (
                              <p className="text-gray-400 text-sm mt-1 line-clamp-1" title={booking.mensaje}>
                                {booking.mensaje}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="text-white font-medium">{booking.servicio}</p>
                        </td>
                        <td className="p-6">
                          <div>
                            <p className="text-white font-medium">{booking.fecha}</p>
                            <p className="text-gray-400 text-sm">{booking.hora}</p>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="space-y-1">
                            <p className="text-white text-sm">{booking.telefono}</p>
                            <p className="text-gray-400 text-sm">{booking.email}</p>
                          </div>
                        </td>
                        <td className="p-6">
                          <select
                            value={booking.estado}
                            onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                            className={`bg-gradient-to-r ${getStatusColor(booking.estado)} border-0 text-white px-3 py-1 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-white/50`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                        </td>
                        <td className="p-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => deleteBooking(booking._id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="text-sm">Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}