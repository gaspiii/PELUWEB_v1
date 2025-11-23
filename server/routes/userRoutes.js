import express from "express";
import { registerUser, loginUser, getProfile, getUsers } from "../controllers/userController.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getProfile);

// Obtener todos los usuarios (solo admin)
router.get("/",getUsers);

router.get("/admin-panel", verifyToken, adminOnly, (req, res) => {
  res.json({ message: "Bienvenido al panel de administración" });
});

export default router;
