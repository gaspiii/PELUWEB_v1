import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreationModal, setShowCreationModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

   

    const fetchSalon = async () => {
      try {
        console.log("🔍 Verificando salón del usuario...");
        const res = await fetch("http://localhost:4000/api/salons/mine", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        console.log("📊 Respuesta del servidor:", res.status);

        // Manejar diferentes respuestas
        if (res.status === 404) {
          console.log("ℹ️ Usuario no tiene salón");
          setShowCreationModal(true);
          setLoading(false);
          return;
        }

        if (res.status === 401) {
          console.log("🔐 Error de autenticación");
          const data = await res.json();
          if (data.code === "TOKEN_EXPIRED") {
            alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          } else {
            alert("Error de autenticación. Por favor, inicia sesión nuevamente.");
          }
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        if (res.status === 403) {
          console.log("🚫 Acceso denegado");
          alert("No tienes permisos para acceder a esta sección.");
          navigate("/");
          return;
        }

        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        // Si todo está bien, procesar la respuesta
        const data = await res.json();
        console.log("✅ Salón obtenido:", data);
        setSalon(data);

      } catch (err) {
        console.error("❌ Error cargando salón:", err);
        // En caso de error de red u otro error, mostrar modal de creación
        setShowCreationModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [navigate]);


  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Cargando tu peluquería...</p>
          </div>
        </div>
      </div>
    );
  }

  // 🚨 Modal bloqueante - No tiene peluquería
  if (showCreationModal || !salon) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950 text-white relative">
        <Navbar />

        <div className="flex flex-1 items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-700/50 animate-fadeIn">
              {/* Icono */}
              <div className="mb-6">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto border border-yellow-500/30">
                  <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              {/* Título */}
              <h2 className="text-3xl font-bold text-emerald-400 mb-4">
                ¡Atención!
              </h2>

              {/* Mensaje */}
              <p className="text-gray-300 mb-2 text-lg">
                No tienes ninguna peluquería asociada a tu cuenta.
              </p>
              <p className="text-gray-400 mb-8 text-sm">
                Debes crear un sitio web para acceder al panel de administración y comenzar a gestionar tu negocio.
              </p>

              {/* Botones */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/creation")}
                  className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Crear mi peluquería ahora
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl font-semibold transition-all"
                >
                  Volver al inicio
                </button>
              </div>

              {/* Info adicional */}
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <p className="text-xs text-gray-500">
                  💡 El proceso de creación es rápido y sencillo, ¡solo te tomará 5 minutos!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3️⃣ Si tiene salón y está RECHAZADO
  if (salon.estado === "rechazado") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar salon={salon} bloqueado={true} />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="bg-gray-900/80 border border-red-600/40 rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-400 mb-4">
                Peluquería Rechazada
              </h2>
              <p className="text-gray-300 mb-4">
                Lo sentimos, tu solicitud para <strong>{salon.nombre}</strong> ha sido rechazada por un administrador.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Por favor, contacta con soporte para más información o intenta crear una nueva peluquería.
              </p>
              <button
                onClick={() => navigate("/creation")}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors"
              >
                Crear nueva peluquería
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // 4️⃣ Si tiene salón y está PENDIENTE
  if (salon.estado === "pendiente") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar salon={salon} bloqueado={true} />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="bg-gray-900/80 border border-yellow-600/40 rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30 animate-pulse">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                Tu peluquería está en revisión
              </h2>
              <p className="text-gray-300 mb-4">
                La solicitud para <strong>{salon.nombre}</strong> fue enviada y se encuentra en estado{" "}
                <span className="font-semibold text-yellow-400">pendiente</span>.
              </p>
              <p className="text-sm text-gray-500">
                Debes esperar a que un administrador la apruebe para poder usar todas las funciones del panel.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // 5️⃣ Si está APROBADO
  if (salon.estado === "aprobado") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar salon={salon} />
          <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-6">
              Bienvenido al Panel de Administración
            </h1>

            {/* Card de éxito */}
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-emerald-400 font-bold text-lg">¡Tu peluquería ha sido aprobada!</p>
                  <p className="text-gray-400 text-sm">Tu sitio web está activo y visible para todos</p>
                </div>
              </div>

              <a
                href={`/salon/${salon.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver mi sitio web
              </a>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <h3 className="text-gray-400 text-sm mb-2">Servicios Registrados</h3>
                <p className="text-3xl font-bold text-white">{salon.servicios?.length || 0}</p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <h3 className="text-gray-400 text-sm mb-2">Estado del Sitio</h3>
                <p className="text-3xl font-bold text-emerald-400">Activo</p>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                <h3 className="text-gray-400 text-sm mb-2">URL del Sitio</h3>
                <p className="text-sm font-mono text-emerald-400 truncate">/salon/{salon.slug}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}