import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminStats() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-6">
            Estadísticas Globales
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800/60">
              <h3 className="text-gray-400 text-sm">Usuarios activos</h3>
              <p className="text-2xl font-bold text-white mt-2">95</p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800/60">
              <h3 className="text-gray-400 text-sm">Promedio longevidad</h3>
              <p className="text-2xl font-bold text-white mt-2">9 meses</p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800/60">
              <h3 className="text-gray-400 text-sm">Páginas creadas</h3>
              <p className="text-2xl font-bold text-emerald-400 mt-2">120</p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800/60">
              <h3 className="text-gray-400 text-sm">Tasa de retención</h3>
              <p className="text-2xl font-bold text-yellow-400 mt-2">82%</p>
            </div>
          </div>

          <div className="bg-gray-900/70 p-6 rounded-xl border border-gray-800/60 shadow">
            <h2 className="text-xl font-semibold mb-4">Resumen</h2>
            <p className="text-gray-400">
              En los últimos 6 meses hemos experimentado un crecimiento sostenido en la creación de páginas
              y una retención sólida de usuarios. Los ingresos siguen en aumento, con un promedio de longevidad
              cercano al año.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
