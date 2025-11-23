import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminFinanzas() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-6">
            Finanzas Globales
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800/60">
              <h3 className="text-gray-400 text-sm">Ingresos totales</h3>
              <p className="text-2xl font-bold text-emerald-400 mt-2">$12.500.000 CLP</p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800/60">
              <h3 className="text-gray-400 text-sm">Inversión</h3>
              <p className="text-2xl font-bold text-yellow-400 mt-2">$3.000.000 CLP</p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800/60">
              <h3 className="text-gray-400 text-sm">Ganancia neta</h3>
              <p className="text-2xl font-bold text-emerald-500 mt-2">$9.500.000 CLP</p>
            </div>
          </div>

          <div className="bg-gray-900/70 p-6 rounded-xl border border-gray-800/60 shadow">
            <h2 className="text-xl font-semibold mb-4">Historial de pagos</h2>
            <ul className="space-y-3">
              <li className="flex justify-between text-gray-300">
                <span>Peluquería Belleza Moderna</span>
                <span className="text-emerald-400">+$500.000</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <span>Publicidad Facebook Ads</span>
                <span className="text-red-400">-150.000</span>
              </li>
              <li className="flex justify-between text-gray-300">
                <span>Estilo Urbano</span>
                <span className="text-emerald-400">+$200.000</span>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
