import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simular pagos basados en reservas (más adelante esto vendrá de un modelo Payments)
  const fetchPagos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/bookings");
      const data = await res.json();

      // Transformar reservas en "pagos"
      const pagosTransformados = data.map((b) => ({
        cliente: b.name,
        servicio: b.service,
        fecha: b.date,
        estado: "Pagado",
        monto: "$20.000 CLP" // ⚡ Por ahora fijo, luego lo sacamos de Mongo
      }));

      setPagos(pagosTransformados);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando pagos:", error);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-950 text-white p-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
          Gestión de Pagos
        </h1>

        {loading ? (
          <p className="text-gray-400">Cargando pagos...</p>
        ) : pagos.length === 0 ? (
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 text-center">
            <p className="text-gray-400">No hay pagos registrados aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-gray-900/60 rounded-xl shadow-lg border border-gray-800/60">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/80 text-gray-300 text-sm uppercase tracking-wider">
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Servicio</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((p, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-950" : "bg-gray-900/50"
                    } hover:bg-gray-800/50 transition`}
                  >
                    <td className="p-4 font-medium text-white">{p.cliente}</td>
                    <td className="p-4 text-gray-300">{p.servicio}</td>
                    <td className="p-4 text-gray-300">{p.fecha}</td>
                    <td className="p-4 text-emerald-400 font-semibold">{p.monto}</td>
                    <td className="p-4">
                      <span className="bg-emerald-600/80 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {p.estado}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button className="bg-blue-600/80 hover:bg-blue-500 px-3 py-1 rounded-lg text-sm transition">
                        Ver detalle
                      </button>
                      <button className="bg-red-600/80 hover:bg-red-500 px-3 py-1 rounded-lg text-sm transition">
                        Reembolsar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
