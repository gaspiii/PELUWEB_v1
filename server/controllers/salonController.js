import Salon from "../models/Salon.js";

// Listar todas las peluquerías (admin)
export const getAllSalons = async (req, res) => {
  try {
    const salons = await Salon.find();
    res.json(salons);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo salones" });
  }
};

// Cambiar estado de una peluquería (aprobado/rechazado)
export const updateSalonStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!["pendiente", "aprobado", "rechazado"].includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const salon = await Salon.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!salon) return res.status(404).json({ error: "Salon no encontrado" });

    res.json({ message: "Estado actualizado", salon });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando estado" });
  }
};

export const createSalon = async (req, res) => {
  try {
    const userId = req.user.id;

    const salon = new Salon({
      ...req.body,
      estado: "pendiente"
    });

    await salon.save();

    // Vincular al usuario
    await User.findByIdAndUpdate(userId, { $push: { salons: salon._id } });

    res.json({ salon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando la peluquería" });
  }
};
