// server/routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getBookings,
  getBookingsBySalon,
  updateBooking,
  deleteBooking,
  updateBookingStatus
} from "../controllers/bookingController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Rutas públicas
router.post("/", createBooking);
router.get("/salon/:salonId", getBookingsBySalon);

// Rutas protegidas
router.get("/", authMiddleware, getBookings);
router.patch("/:id/estado", authMiddleware, updateBookingStatus);
router.put("/:id", authMiddleware, updateBooking);
router.delete("/:id", authMiddleware, deleteBooking);

export default router;