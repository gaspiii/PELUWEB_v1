import { useState } from "react";

export default function Booking() {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, service, date, hour }),
      });

      if (res.ok) {
        setMessage("✅ Cita reservada con éxito");
        setName("");
        setService("");
        setDate("");
        setHour("");
      } else {
        const data = await res.json();
        setMessage(`⛔ ${data.error || "Error al reservar cita"}`);
      }
    } catch (err) {
      setMessage("⚠️ Error de conexión con el servidor");
    }
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold">Reserva tu cita</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-gray-700"
          required
        />

        <input
          type="text"
          placeholder="Servicio"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full p-3 rounded bg-gray-700"
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 rounded bg-gray-700"
          required
        />

        <input
          type="time"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          className="w-full p-3 rounded bg-gray-700"
          required
        />

        <button className="bg-emerald-600 w-full py-3 rounded hover:bg-emerald-500">
          Reservar
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-300">{message}</p>
        )}
      </form>
    </div>
  );
}
