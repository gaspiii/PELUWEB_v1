import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-gray-400 p-8">Cargando usuarios...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-6">
            Gestión de Usuarios
          </h1>

          {users.length === 0 ? (
            <p className="text-gray-400">No hay usuarios registrados</p>
          ) : (
            <div className="overflow-x-auto bg-gray-900/60 rounded-xl border border-gray-800/60">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/80 text-gray-300 text-sm uppercase tracking-wider">
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4">Fecha Registro</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u._id} className={`${idx % 2 === 0 ? "bg-gray-950" : "bg-gray-900/50"} hover:bg-gray-800/40`}>
                      <td className="p-4">{u.nombre}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/70 text-white">
                          {u.rol}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-center space-x-2">
                        <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg text-sm">Editar</button>
                        <button className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg text-sm">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
