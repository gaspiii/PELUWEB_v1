// server/controllers/bookingController.js
import Booking from "../models/Booking.js";
import Salon from "../models/Salon.js";

// Crear cita (pública)
export const createBooking = async (req, res) => {
  try {
    const { salonId, nombre, email, telefono, servicio, fecha, hora, mensaje } = req.body;

    // Verificar que el salón existe
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({ error: "Peluquería no encontrada" });
    }

    // Verificar duplicados (mismo salón, fecha y hora)
    const exists = await Booking.findOne({ 
      salon: salonId, 
      fecha, 
      hora 
    });
    
    if (exists) {
      return res.status(400).json({ error: "⛔ Horario ocupado" });
    }

    const booking = new Booking({
      salon: salonId,
      nombre,
      email,
      telefono,
      servicio,
      fecha,
      hora,
      mensaje: mensaje || "",
      estado: "pendiente"
    });

    await booking.save();

    res.status(201).json({
      message: "Reserva creada exitosamente",
      booking
    });
  } catch (error) {
    console.error("Error creando cita:", error);
    res.status(500).json({ error: "Error al crear cita" });
  }
};

// Listar todas las citas (para admin o dueño del salón)
export const getBookings = async (req, res) => {
  try {
    // Si el usuario está autenticado, filtrar por sus salones
    let filter = {};
    
    if (req.user) {
      // Si es admin, puede ver todas las citas
      if (req.user.rol === "admin") {
        filter = {};
      } else {
        // Si es dueño, solo ver citas de sus salones
        const userSalons = await Salon.find({ owner: req.user._id });
        const salonIds = userSalons.map(salon => salon._id);
        filter = { salon: { $in: salonIds } };
      }
    }

    const bookings = await Booking.find(filter)
      .populate("salon", "nombre direccion telefono")
      .sort({ fecha: 1, hora: 1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error obteniendo citas:", error);
    res.status(500).json({ error: "Error al obtener citas" });
  }
};

// Obtener citas por salón (público)
export const getBookingsBySalon = async (req, res) => {
  try {
    const { salonId } = req.params;
    
    const bookings = await Booking.find({ 
      salon: salonId,
      estado: { $in: ["pendiente", "confirmada"] } // Solo citas activas
    }).sort({ fecha: 1, hora: 1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error obteniendo citas del salón:", error);
    res.status(500).json({ error: "Error al obtener citas" });
  }
};

// Actualizar cita
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("salon");
    
    if (!booking) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error actualizando cita:", error);
    res.status(500).json({ error: "Error al actualizar cita" });
  }
};

// Eliminar cita
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }
    
    res.json({ message: "Cita eliminada con éxito" });
  } catch (error) {
    console.error("Error eliminando cita:", error);
    res.status(500).json({ error: "Error al eliminar cita" });
  }
};

// Actualizar estado de cita
export const updateBookingStatus = async (req, res) => {
  try {
    const { estado } = req.body;
    
    if (!["pendiente", "confirmada", "cancelada", "completada"].includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    ).populate("salon");

    if (!booking) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    res.json({
      message: "Estado actualizado exitosamente",
      booking
    });
  } catch (error) {
    console.error("Error actualizando estado:", error);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
};