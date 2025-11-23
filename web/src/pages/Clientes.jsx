import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // Obtener token del localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Obtener clientes desde las reservas
  const fetchClientes = async () => {
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
        
        // Procesar datos para agrupar por cliente (sin duplicados)
        const clientesMap = new Map();

        data.forEach(booking => {
          // Clave única por cliente (nombre + teléfono)
          const clave = `${booking.nombre}-${booking.telefono}`;
          
          if (!clientesMap.has(clave)) {
            // Crear nuevo cliente
            clientesMap.set(clave, {
              id: clave, // ID único para el cliente
              nombre: booking.nombre,
              email: booking.email,
              telefono: booking.telefono,
              citas: [],
              totalCitas: 0,
              primeraVisita: booking.fecha,
              ultimaVisita: booking.fecha,
              servicios: new Map(),
              estado: 'activo'
            });
          }

          const cliente = clientesMap.get(clave);
          
          // Agregar cita
          cliente.citas.push({
            id: booking._id,
            servicio: booking.servicio,
            fecha: booking.fecha,
            hora: booking.hora,
            estado: booking.estado,
            mensaje: booking.mensaje
          });

          cliente.totalCitas++;
          
          // Actualizar fechas
          if (booking.fecha < cliente.primeraVisita) {
            cliente.primeraVisita = booking.fecha;
          }
          if (booking.fecha > cliente.ultimaVisita) {
            cliente.ultimaVisita = booking.fecha;
          }

          // Contar servicios
          const servicioCount = cliente.servicios.get(booking.servicio) || 0;
          cliente.servicios.set(booking.servicio, servicioCount + 1);
        });

        // Convertir Map a Array y procesar datos
        const todosClientes = Array.from(clientesMap.values()).map(cliente => {
          // Servicio más frecuente
          const serviciosArray = Array.from(cliente.servicios.entries());
          const servicioFrecuente = serviciosArray.sort((a, b) => b[1] - a[1])[0];
          
          // Último servicio
          const ultimaCita = cliente.citas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
          
          return {
            ...cliente,
            servicioFrecuente: servicioFrecuente ? servicioFrecuente[0] : 'N/A',
            frecuenciaServicio: servicioFrecuente ? servicioFrecuente[1] : 0,
            ultimoServicio: ultimaCita?.servicio || 'N/A',
            ultimaCita: ultimaCita
          };
        });

        setClientes(todosClientes);
      } else {
        console.error("Error cargando citas:", res.status);
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/login';
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Filtrar clientes por búsqueda
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    cliente.email.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    cliente.telefono.includes(filtroBusqueda)
  );

  // Ver historial completo del cliente
  const verHistorial = (cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  // Eliminar cliente (y todas sus citas)
  const eliminarCliente = async (cliente) => {
    if (!confirm(`¿Estás seguro de eliminar a ${cliente.nombre} y todas sus ${cliente.totalCitas} citas?`)) return;
    
    try {
      const token = getToken();
      
      // Eliminar todas las citas del cliente
      const deletePromises = cliente.citas.map(cita => 
        fetch(`http://localhost:4000/api/bookings/${cita.id}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      );

      await Promise.all(deletePromises);
      
      // Actualizar lista
      setClientes(clientes.filter(c => c.id !== cliente.id));
      alert(`Cliente ${cliente.nombre} eliminado correctamente`);
      
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      alert("Error al eliminar el cliente");
    }
  };

  // Enviar WhatsApp al cliente
  const enviarWhatsApp = (telefono, nombre) => {
    const mensaje = `Hola ${nombre}, te contactamos desde la peluquería. ¿Cómo estás?`;
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  // Enviar email al cliente
  const enviarEmail = (email, nombre) => {
    const subject = "Saludo desde tu peluquería";
    const body = `Hola ${nombre}, te contactamos desde la peluquería. ¿Cómo estás?`;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  };

  const getFrecuenciaColor = (citas) => {
    if (citas >= 5) return "from-purple-500 to-purple-600";
    if (citas >= 3) return "from-emerald-500 to-emerald-600";
    if (citas >= 2) return "from-blue-500 to-blue-600";
    return "from-gray-500 to-gray-600";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              Gestión de Clientes
            </h1>
            <p className="text-gray-400 text-lg">
              Todos tus clientes en un solo lugar - {clientes.length} clientes registrados
            </p>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Buscar cliente por nombre, email o teléfono..."
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                />
              </div>
              <button 
                onClick={fetchClientes}
                className="flex items-center space-x-2 px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          {/* Grid de Clientes */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400">Cargando clientes...</p>
              </div>
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {filtroBusqueda ? "No se encontraron clientes" : "No hay clientes"}
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {filtroBusqueda 
                  ? "No hay clientes que coincidan con tu búsqueda."
                  : "Los clientes aparecerán aquí después de que realicen su primera reserva."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientesFiltrados.map((cliente) => (
                <div 
                  key={cliente.id}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  {/* Header de la card */}
                  <div className={`bg-gradient-to-r ${getFrecuenciaColor(cliente.totalCitas)} p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold text-lg">
                          {cliente.nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold backdrop-blur-sm">
                          {cliente.totalCitas} {cliente.totalCitas === 1 ? 'cita' : 'citas'}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-4 truncate">{cliente.nombre}</h3>
                  </div>

                  {/* Contenido de la card */}
                  <div className="p-6">
                    {/* Información de contacto */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-white text-sm">{cliente.telefono}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-white text-sm truncate">{cliente.email}</span>
                      </div>
                    </div>

                    {/* Información de visitas */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Última visita:</span>
                        <span className="text-white">{cliente.ultimaVisita}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Servicio frecuente:</span>
                        <span className="text-emerald-400">{cliente.servicioFrecuente}</span>
                      </div>
                      {cliente.frecuenciaServicio > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Veces solicitado:</span>
                          <span className="text-yellow-400">{cliente.frecuenciaServicio}</span>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700/50">
                      <button
                        onClick={() => verHistorial(cliente)}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all duration-200 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Historial</span>
                      </button>
                      <button
                        onClick={() => enviarWhatsApp(cliente.telefono, cliente.nombre)}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/30 transition-all duration-200 text-sm"
                      >
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => eliminarCliente(cliente)}
                        className="flex items-center justify-center px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-200 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Historial */}
        {showModal && selectedCliente && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Historial de {selectedCliente.nombre}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {selectedCliente.citas.map((cita, index) => (
                    <div key={cita.id} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold">{cita.servicio}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          cita.estado === 'confirmada' ? 'bg-emerald-500/20 text-emerald-400' :
                          cita.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
                          cita.estado === 'completada' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {cita.estado}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {cita.fecha} a las {cita.hora}
                      </div>
                      {cita.mensaje && (
                        <div className="text-sm text-gray-300 mt-2">
                          "{cita.mensaje}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}