// server/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "secreto_peluweb";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    console.log("🔐 Verificando token...", {
      hasAuthHeader: !!authHeader,
      header: authHeader ? "Presente" : "Ausente"
    });

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Token no proporcionado o formato incorrecto");
      return res.status(401).json({ 
        error: "Token no proporcionado",
        code: "NO_TOKEN" 
      });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      console.log("❌ Token vacío");
      return res.status(401).json({ error: "Token vacío" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token decodificado:", { id: decoded.id, rol: decoded.rol });
    
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("❌ Usuario no encontrado en BD");
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    req.user = user;
    console.log("✅ Usuario autenticado:", user.email);
    next();
  } catch (err) {
    console.error("❌ Error verificando token:", err.message);
    
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        error: "Token expirado", 
        code: "TOKEN_EXPIRED" 
      });
    }
    
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        error: "Token inválido",
        code: "INVALID_TOKEN" 
      });
    }
    
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  
  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { 
      id: decoded.id, 
      email: decoded.email, 
      rol: decoded.rol 
    };
    next();
  } catch (err) {
    console.error("Error en authMiddleware:", err);
    return res.status(403).json({ error: "Token inválido" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.rol !== "admin") {
    return res.status(403).json({ error: "Acceso restringido a administradores" });
  }
  next();
};

export const ownerOnly = (req, res, next) => {
  if (req.user?.rol !== "dueño") {
    return res.status(403).json({ error: "Acceso restringido a dueños" });
  }
  next();
};