import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ salon, bloqueado = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { 
      path: "/dashboard", 
      name: "Inicio",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      path: "/dashboard/citas", 
      name: "Citas",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      path: "/dashboard/clientes", 
      name: "Clientes",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      path: "/dashboard/pagos", 
      name: "Pagos",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      path: "/dashboard/estadisticas", 
      name: "Estadísticas",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  const handleLogout = () => {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      // Limpiar localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("salon");
      
      // Redirigir al login
      navigate("/login");
    }
  };

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col border-r border-gray-700/50">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
          Panel Peluweb
        </h2>
        <p className="text-sm text-gray-400 mt-1">Gestión de peluquería</p>
        
        {/* Info del salón */}
        {salon && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
            <p className="text-xs text-gray-400 mb-1">Peluquería activa</p>
            <p className="text-sm font-semibold text-white truncate">{salon.nombre}</p>
            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
              salon.estado === "aprobado" 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : salon.estado === "pendiente"
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}>
              {salon.estado.charAt(0).toUpperCase() + salon.estado.slice(1)}
            </span>
          </div>
        )}
      </div>
      
      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isDisabled = bloqueado && item.path !== "/dashboard";
          
          return (
            <Link
              key={item.path}
              to={isDisabled ? "#" : item.path}
              onClick={(e) => isDisabled && e.preventDefault()}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isDisabled
                  ? "opacity-50 cursor-not-allowed text-gray-500"
                  : isActive
                  ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent"
              }`}
              title={isDisabled ? "Disponible cuando tu peluquería sea aprobada" : ""}
            >
              <div className={isActive ? "text-emerald-400" : "text-gray-400"}>
                {item.icon}
              </div>
              <span className="font-medium">{item.name}</span>
              {isActive && !isDisabled && (
                <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              )}
              {isDisabled && (
                <svg className="w-4 h-4 ml-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </Link>
          );
        })}

        {/* Link público al sitio (solo si aprobado) */}
        {salon?.estado === "aprobado" && salon?.slug && (
          <a
            href={`/salon/${salon.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-xl text-sm font-semibold transition-all text-emerald-400 border border-emerald-500/30 mt-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Ver mi sitio web</span>
          </a>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50 space-y-2">
        {/* Info del usuario */}
        <div className="px-3 py-2 bg-gray-800/30 rounded-lg">
          <p className="text-xs text-gray-400">Sesión activa</p>
          <p className="text-sm text-white font-medium truncate">
            {JSON.parse(localStorage.getItem("user") || "{}")?.nombre || "Usuario"}
          </p>
        </div>

        {/* Botón cerrar sesión */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 hover:text-red-300 transition-all border border-red-500/30 font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}