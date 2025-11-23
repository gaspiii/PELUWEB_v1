import { useEffect, useState, Suspense } from "react";

export default function Preview() {
  const [salon, setSalon] = useState(null);
  const [Template, setTemplate] = useState(null);

  useEffect(() => {
    async function fetchSalon() {
      const res = await fetch("/api/salones/ID_DEL_SALON");
      const data = await res.json();
      
      setSalon(data.datos);

      // Cargar plantilla dinámica (ej: peluqueria1.jsx)
      const templateModule = await import(`../templates/${data.plantilla}.jsx`);
      setTemplate(() => templateModule.default);
    }

    fetchSalon();
  }, []);

  if (!salon || !Template) return <p>Cargando...</p>;

  return (
    <Suspense fallback={<p>Cargando plantilla...</p>}>
      <Template data={salon} />
    </Suspense>
  );
}
