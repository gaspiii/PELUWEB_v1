// server/routes/salonRoutes.js
import express from "express";
import { verifyToken, adminOnly } from "../middleware/auth.js";
import Salon from "../models/Salon.js";

const router = express.Router();

// ✅ 1. RUTAS ESPECÍFICAS PRIMERO (antes de rutas con parámetros)

// Obtener salón del usuario autenticado
router.get("/mine", verifyToken, async (req, res) => {
  try {
    console.log("🔍 Buscando salón para usuario:", req.user._id, req.user.email);
    
    const salon = await Salon.findOne({ owner: req.user._id });

    if (!salon) {
      console.log("❌ No se encontró salón para el usuario");
      return res.status(404).json({ 
        error: "No tienes una peluquería registrada",
        hasSalon: false 
      });
    }

    console.log("✅ Salón encontrado:", salon.nombre, "- Estado:", salon.estado);
    res.json(salon);
  } catch (error) {
    console.error("❌ Error obteniendo salón:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener salón por slug (público)
router.get("/public/:slug", async (req, res) => {
  try {
    const salon = await Salon.findOne({ 
      slug: req.params.slug,
      estado: "aprobado" 
    }).populate("owner", "nombre email");

    if (!salon) {
      return res.status(404).json({ error: "Peluquería no encontrada o no aprobada" });
    }

    res.json(salon);
  } catch (error) {
    console.error("Error obteniendo peluquería:", error);
    res.status(500).json({ error: "Error al obtener la peluquería" });
  }
});

// Crear un nuevo salón
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      nombre,
      slogan,
      descripcion,
      telefono,
      email,
      direccion,
      horarios,
      whatsapp,
      template,
      logo,
      imagenes,
      servicios,
      equipo,
    } = req.body;

    // Verificar que el usuario no tenga ya un salón
    const existingSalon = await Salon.findOne({ owner: req.user._id });
    if (existingSalon) {
      return res.status(400).json({ 
        error: "Ya tienes una peluquería registrada" 
      });
    }

    // Generar slug único
    const baseSlug = nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (await Salon.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newSalon = new Salon({
      nombre,
      slogan,
      descripcion,
      telefono,
      email,
      direccion,
      horarios,
      whatsapp,
      template,
      logo,
      imagenes,
      servicios,
      equipo,
      owner: req.user._id,
      slug,
      estado: "pendiente",
    });

    await newSalon.save();

    res.status(201).json({
      message: "Peluquería creada exitosamente en estado pendiente",
      salon: newSalon,
    });
  } catch (error) {
    console.error("Error al crear salón:", error);
    res.status(500).json({ error: "Error al crear la peluquería" });
  }
});

// Obtener todos los salones (admin ve todos, público solo aprobados)
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    let isAdmin = false;

    // Verificar si es admin
    if (token) {
      try {
        const jwt = await import("jsonwebtoken");
        const JWT_SECRET = process.env.JWT_SECRET || "secreto_peluweb";
        const decoded = jwt.default.verify(token, JWT_SECRET);
        const User = (await import("../models/User.js")).default;
        const user = await User.findById(decoded.id);
        isAdmin = user?.rol === "admin";
      } catch (err) {
        // Token inválido, continuar como público
      }
    }

    // Si es admin, mostrar todos; si no, solo aprobados
    const filter = isAdmin ? {} : { estado: "aprobado" };
    const salons = await Salon.find(filter)
      .populate("owner", "nombre email")
      .sort({ createdAt: -1 }); // Más recientes primero

    res.json(salons);
  } catch (error) {
    console.error("Error obteniendo salones:", error);
    res.status(500).json({ error: "Error al obtener salones" });
  }
});

// ✅ 2. RUTAS CON PARÁMETROS DINÁMICOS AL FINAL

// Aprobar/Rechazar salón (solo admin) - ANTES de /:id
router.patch("/:id/estado", verifyToken, adminOnly, async (req, res) => {
  try {
    const { estado } = req.body;

    if (!["pendiente", "aprobado", "rechazado"].includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const salon = await Salon.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );

    if (!salon) {
      return res.status(404).json({ error: "Peluquería no encontrada" });
    }

    res.json({
      message: `Peluquería ${estado} exitosamente`,
      salon,
    });
  } catch (error) {
    console.error("Error actualizando estado:", error);
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
});

// Actualizar salón
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({ error: "Peluquería no encontrada" });
    }

    // Verificar que el usuario sea el dueño o admin
    if (salon.owner.toString() !== req.user._id.toString() && req.user.rol !== "admin") {
      return res.status(403).json({ error: "No tienes permiso para editar esta peluquería" });
    }

    const updatedSalon = await Salon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Peluquería actualizada exitosamente",
      salon: updatedSalon,
    });
  } catch (error) {
    console.error("Error actualizando peluquería:", error);
    res.status(500).json({ error: "Error al actualizar la peluquería" });
  }
});

// Eliminar salón
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({ error: "Peluquería no encontrada" });
    }

    // Verificar permisos
    if (salon.owner.toString() !== req.user._id.toString() && req.user.rol !== "admin") {
      return res.status(403).json({ error: "No tienes permiso para eliminar esta peluquería" });
    }

    await Salon.findByIdAndDelete(req.params.id);

    res.json({ message: "Peluquería eliminada exitosamente" });
  } catch (error) {
    console.error("Error eliminando peluquería:", error);
    res.status(500).json({ error: "Error al eliminar la peluquería" });
  }
});

// Obtener salón por ID (ÚLTIMA RUTA)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que sea un ObjectId válido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const salon = await Salon.findById(id).populate("owner", "nombre email");

    if (!salon) {
      return res.status(404).json({ error: "Peluquería no encontrada" });
    }

    res.json(salon);
  } catch (error) {
    console.error("Error obteniendo peluquería:", error);
    res.status(500).json({ error: "Error al obtener la peluquería" });
  }
});

export default router;