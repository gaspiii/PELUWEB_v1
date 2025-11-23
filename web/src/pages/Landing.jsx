import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center py-28 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2"></div>
            <span className="text-emerald-400 text-sm font-medium">La plataforma #1 para peluquerías</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Tu sitio web de{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              peluquería
            </span>{" "}
            en minutos
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-3xl leading-relaxed">
            La solución todo-en-uno para peluquerías que quieren destacar online. 
            <span className="text-emerald-400 font-semibold"> Sin complicaciones técnicas</span>, 
            solo resultados profesionales.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/creation"
              className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 px-10 py-5 rounded-2xl text-lg font-bold hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-400/30 transform hover:-translate-y-1"
            >
              <span className="relative z-10">PROBAR GRATIS</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            
            <button className="px-8 py-5 border-2 border-gray-700 hover:border-emerald-500/30 rounded-2xl text-lg font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:bg-gray-800/50">
              Ver demostración
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-800/50">
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-gray-400 text-sm">Peluquerías confían</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">99%</div>
              <div className="text-gray-400 text-sm">Clientes satisfechos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-gray-400 text-sm">Soporte activo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Todo lo que necesitas para{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              triunfar online
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Herramientas profesionales diseñadas específicamente para el sector de la peluquería y belleza
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🎨",
              title: "Diseño Profesional",
              description: "Plantillas modernas creadas por expertos en peluquerías que convierten visitas en clientes.",
              gradient: "from-purple-500/10 to-purple-600/5",
              border: "border-purple-500/20"
            },
            {
              icon: "📅",
              title: "Reservas 24/7",
              description: "Sistema integrado de citas que permite a tus clientes reservar en cualquier momento.",
              gradient: "from-blue-500/10 to-blue-600/5",
              border: "border-blue-500/20"
            },
            {
              icon: "📱",
              title: "100% Adaptable",
              description: "Tu sitio se verá perfecto en cualquier dispositivo, desde móviles hasta ordenadores.",
              gradient: "from-emerald-500/10 to-emerald-600/5",
              border: "border-emerald-500/20"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className={`group bg-gradient-to-br ${feature.gradient} backdrop-blur-sm p-8 rounded-3xl border ${feature.border} shadow-2xl shadow-black/20 hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
              <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10 text-center py-20 px-6">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                ¿Listo para transformar tu{" "}
                <span className="text-black">peluquería</span>?
              </h2>
              <p className="text-xl text-emerald-900/80 mb-10 max-w-2xl mx-auto">
                Únete a cientos de peluquerías que ya están creciendo con Peluweb
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/creation"
                  className="bg-black text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all shadow-lg transform hover:-translate-y-0.5"
                >
                  Crear mi sitio web
                </Link>
                <button className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all border border-white/30">
                  Contactar ventas
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}