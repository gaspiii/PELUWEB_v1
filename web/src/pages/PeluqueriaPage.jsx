// pages/PeluqueriaPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PeluqueriaTemplate from "../templates/PeluqueriaTemplate";

export default function PeluqueriaPage() {
  const { slug } = useParams();
  const [peluqueria, setPeluqueria] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/salons/public/${slug}`);
        const data = await res.json();
        if (res.ok) {
          setPeluqueria(data);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Error cargando peluquería:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalon();
  }, [slug]);

  if (loading) return <p className="text-center mt-20">Cargando peluquería...</p>;
  if (!peluqueria) return <p className="text-center mt-20">Peluquería no encontrada</p>;

  return <PeluqueriaTemplate datosPeluqueria={peluqueria} />;
}
