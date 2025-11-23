import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PeluqueriaTemplate from '../templates/PeluqueriaTemplate';

export default function PeluqueriaSite() {
  const { slug } = useParams();
  const [datosPeluqueria, setDatosPeluqueria] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí harías la llamada a tu API
    const fetchPeluqueriaData = async () => {
      try {
        const response = await fetch(`/api/peluquerias/${slug}`);
        const data = await response.json();
        setDatosPeluqueria(data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeluqueriaData();
  }, [slug]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!datosPeluqueria) {
    return <div>Peluquería no encontrada</div>;
  }

  return <PeluqueriaTemplate datosPeluqueria={datosPeluqueria} />;
}