import express from "express";
import User from "../models/User.js";
import Salon from "../models/Salon.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Listar todos los usuarios
router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/me", authMiddleware, adminOnly, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  const totalUsers = await User.countDocuments();
  const totalSalons = await Salon.countDocuments();
  const totalRevenue = totalSalons * 50000; // ejemplo

  res.json({
    ...user.toObject(),
    stats: { totalUsers, totalSalons, totalRevenue },
  });
});

// Eliminar usuario
router.delete("/users/:id", authMiddleware, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuario eliminado" });
});

// Listar todos los salones
router.get("/salons", authMiddleware, adminOnly, async (req, res) => {
  const salons = await Salon.find().populate("owner", "nombre email");
  res.json(salons);
});

// Eliminar salón
router.delete("/salons/:id", authMiddleware, adminOnly, async (req, res) => {
  await Salon.findByIdAndDelete(req.params.id);
  res.json({ message: "Salón eliminado" });
});

// Estadísticas básicas
router.get("/stats", authMiddleware, adminOnly, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalSalons = await Salon.countDocuments();

  // Ejemplo: ingresos falsos (suma estática o futura integración con pagos)
  const totalRevenue = totalSalons * 50000;

  res.json({ totalUsers, totalSalons, totalRevenue });
});

export default router;
