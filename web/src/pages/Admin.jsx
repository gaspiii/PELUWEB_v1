        import AdminSidebar from "../components/AdminSidebar";
        import Navbar from "../components/Navbar";

        export default function Admin() {
        return (
            <div className="min-h-screen flex flex-col bg-gray-950 text-white">
            {/* Navbar arriba */}
            <Navbar />

            {/* Contenedor principal con Sidebar + contenido */}
            <div className="flex flex-1">
                <AdminSidebar />

                <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-6">
                    Panel de Administración
                </h1>
                <p className="text-gray-400 mb-8">
                    Aquí puedes gestionar usuarios, páginas creadas, finanzas y estadísticas generales.
                </p>

                {/* Sección de métricas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-900/60 p-6 rounded-xl shadow border border-gray-800/60">
                    <h3 className="text-gray-400 text-sm">Usuarios registrados</h3>
                    <p className="text-2xl font-bold text-white mt-2">124</p>
                    </div>
                    <div className="bg-gray-900/60 p-6 rounded-xl shadow border border-gray-800/60">
                    <h3 className="text-gray-400 text-sm">Páginas activas</h3>
                    <p className="text-2xl font-bold text-white mt-2">87</p>
                    </div>
                    <div className="bg-gray-900/60 p-6 rounded-xl shadow border border-gray-800/60">
                    <h3 className="text-gray-400 text-sm">Ingresos totales</h3>
                    <p className="text-2xl font-bold text-emerald-400 mt-2">$3.500.000 CLP</p>
                    </div>
                    <div className="bg-gray-900/60 p-6 rounded-xl shadow border border-gray-800/60">
                    <h3 className="text-gray-400 text-sm">Longevidad promedio</h3>
                    <p className="text-2xl font-bold text-white mt-2">8 meses</p>
                    </div>
                </div>
                </main>
            </div>
            </div>
        );
        }
