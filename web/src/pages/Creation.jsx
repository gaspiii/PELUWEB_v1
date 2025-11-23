// web/src/pages/Creation.jsx
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// 🔐 Modal para login requerido
function LoginRequiredModal({ isOpen, onClose, onGoLogin }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-2xl max-w-md text-center shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-emerald-400 mb-4">Debes iniciar sesión</h2>
        <p className="text-gray-300 mb-6">
          Para crear tu peluquería necesitas estar logeado.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onGoLogin}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold"
          >
            Ir a Login
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// 📂 util: convertir archivos a base64
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function Creation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);

  // 🧠 Estado global del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    slogan: "",
    descripcion: "",
    telefono: "",
    email: "",
    direccion: "",
    horarios: "",
    whatsapp: "",
    template: "",
    logo: "",
    imagenes: [],
    servicios: [{ nombre: "", precio: "", duracion: "", descripcion: "" }],
    equipo: [],
  });

  // 🧩 Chequear si hay usuario logeado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:4000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?._id) setUser(data);
      })
      .catch(() => {});
  }, []);

  // 🧾 Enviar peluquería al backend
  const handleFinalSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/salons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          estado: "pendiente",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Peluquería creada en estado 'pendiente'. Espera aprobación del administrador.");
        localStorage.setItem("salon", JSON.stringify(data.salon));
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Error al crear la peluquería");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  // ⚡ Si no está logeado, mostrar modal automáticamente al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
    }
  }, []);

  // 🚫 Evitar avanzar si no hay sesión
  if (!user && showLoginModal) {
    return (
      <>
        <LoginRequiredModal
          isOpen={showLoginModal}
          onClose={() => window.location.href = "/"}
          onGoLogin={() => (window.location.href = "/login")}
        />
      </>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 min-h-screen text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Crea tu sitio web en{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              5 pasos
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Sigue estos simples pasos para tener tu peluquería online en menos de 10 minutos
          </p>
        </div>

        <StepHeader stepsCount={5} currentStep={currentStep} />

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 shadow-2xl p-8">
          {currentStep === 1 && (
            <BasicInfo formData={formData} setFormData={setFormData} onNext={() => setCurrentStep(2)} />
          )}
          {currentStep === 2 && (
            <CompanyInfo formData={formData} setFormData={setFormData} onBack={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />
          )}
          {currentStep === 3 && (
            <TemplateSelection formData={formData} setFormData={setFormData} onBack={() => setCurrentStep(2)} onNext={() => setCurrentStep(4)} />
          )}
          {currentStep === 4 && (
            <Customization formData={formData} setFormData={setFormData} onBack={() => setCurrentStep(3)} onNext={() => setCurrentStep(5)} />
          )}
          {currentStep === 5 && (
            <Review formData={formData} onBack={() => setCurrentStep(4)} onSubmit={handleFinalSubmit} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ----------- COMPONENTES AUXILIARES ----------- */

function StepHeader({ stepsCount, currentStep }) {
  const steps = ["Datos Básicos", "Información Empresa", "Plantilla", "Personalización", "Revisión"];
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 -translate-y-1/2 -z-10"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (stepsCount - 1)) * 100}%` }}
        ></div>
        {steps.map((title, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                i + 1 <= currentStep
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-gray-800 border-gray-700 text-gray-400"
              }`}
            >
              {i + 1 < currentStep ? "✓" : i + 1}
              
            </div>
            <span className={`mt-2 text-sm ${i + 1 <= currentStep ? "text-emerald-400" : "text-gray-500"}`}>
              {title}
              
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* PASO 1: Datos Básicos */
function BasicInfo({ formData, setFormData, onNext }) {
  const update = (field, value) => setFormData({ ...formData, [field]: value });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-emerald-400 mb-6">Paso 1: Datos Básicos</h2>
      <p>* significa OBLIGATORIO</p>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de la Peluquería *</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => update("nombre", e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
          placeholder="Ej: Salón Belleza Total"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Slogan</label>
        <input
          type="text"
          value={formData.slogan}
          onChange={(e) => update("slogan", e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
          placeholder="Ej: Tu estilo, nuestra pasión"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Descripción *</label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => update("descripcion", e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
          placeholder="Describe tu peluquería..."
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!formData.nombre || !formData.descripcion}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

/* PASO 2: Información de Empresa */
function CompanyInfo({ formData, setFormData, onBack, onNext }) {
  const update = (field, value) => setFormData({ ...formData, [field]: value });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-emerald-400 mb-6">Paso 2: Información de Contacto</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono *</label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => update("telefono", e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            placeholder="+56 9 1234 5678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            placeholder="contacto@peluqueria.cl"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Dirección *</label>
        <input
          type="text"
          value={formData.direccion}
          onChange={(e) => update("direccion", e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
          placeholder="Calle Principal 123, Santiago"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Horarios de Atención *</label>
        <input
          type="text"
          value={formData.horarios}
          onChange={(e) => update("horarios", e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
          placeholder="Lun-Vie: 9:00-19:00, Sáb: 10:00-14:00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
        <input
          type="tel"
          value={formData.whatsapp}
          onChange={(e) => update("whatsapp", e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
          placeholder="+56 9 8765 4321"
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold"
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!formData.telefono || !formData.email || !formData.direccion || !formData.horarios}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-semibold"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

/* PASO 3: Selección de Plantilla */
function TemplateSelection({ formData, setFormData, onBack, onNext }) {
  const templates = [
    { id: "modern", name: "Moderno", desc: "Diseño limpio y minimalista" },
    { id: "elegant", name: "Elegante", desc: "Sofisticado y profesional" },
    { id: "creative", name: "Creativo", desc: "Colorido y dinámico" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-emerald-400 mb-6">Paso 3: Elige tu Plantilla</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((t) => (
          <div
            key={t.id}
            onClick={() => setFormData({ ...formData, template: t.id })}
            className={`p-6 rounded-xl border-2 cursor-pointer transition ${
              formData.template === t.id
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">{t.name}</h3>
            <p className="text-gray-400 text-sm">{t.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold">
          ← Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!formData.template}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-semibold"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

/* PASO 4: Personalización */
function Customization({ formData, setFormData, onBack, onNext }) {
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setFormData({ ...formData, logo: base64 });
    }
  };

  const addServicio = () => {
    setFormData({
      ...formData,
      servicios: [...formData.servicios, { nombre: "", precio: "", duracion: "", descripcion: "" }],
    });
  };

  const updateServicio = (index, field, value) => {
    const updated = [...formData.servicios];
    updated[index][field] = value;
    setFormData({ ...formData, servicios: updated });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-emerald-400 mb-6">Paso 4: Personalización</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
        />
        {formData.logo && (
          <img src={formData.logo} alt="Logo preview" className="mt-4 h-24 object-contain" />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Servicios</label>
        {formData.servicios.map((s, i) => (
          <div key={i} className="mb-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <input
              type="text"
              placeholder="Nombre del servicio"
              value={s.nombre}
              onChange={(e) => updateServicio(i, "nombre", e.target.value)}
              className="w-full mb-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
            <div className="grid md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Precio"
                value={s.precio}
                onChange={(e) => updateServicio(i, "precio", e.target.value)}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Duración"
                value={s.duracion}
                onChange={(e) => updateServicio(i, "duracion", e.target.value)}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>
        ))}
        <button
          onClick={addServicio}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-sm font-semibold"
        >
          + Agregar Servicio
        </button>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold">
          ← Atrás
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

/* PASO 5: Revisión Final */
function Review({ formData, onBack, onSubmit }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-emerald-400 mb-6">Paso 5: Revisión Final</h2>
      
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Resumen de tu Peluquería</h3>
        <div className="space-y-3 text-gray-300">
          <p><strong className="text-emerald-400">Nombre:</strong> {formData.nombre}</p>
          <p><strong className="text-emerald-400">Email:</strong> {formData.email}</p>
          <p><strong className="text-emerald-400">Teléfono:</strong> {formData.telefono}</p>
          <p><strong className="text-emerald-400">Dirección:</strong> {formData.direccion}</p>
          <p><strong className="text-emerald-400">Plantilla:</strong> {formData.template}</p>
          <p><strong className="text-emerald-400">Servicios:</strong> {formData.servicios.length} configurados</p>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold">
          ← Atrás
        </button>
        <button
          onClick={onSubmit}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-semibold"
        >
          ✓ Crear Peluquería
        </button>
      </div>
    </div>
  );
}