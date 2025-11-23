// server/routes/debugRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/whoami", authMiddleware, (req, res) => {
  res.json({ ok: true, user: req.user });
});

export default router;
