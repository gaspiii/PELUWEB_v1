// server/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    salon: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Salon", 
      required: true 
    },
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    servicio: { type: String, required: true },
    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    mensaje: { type: String },
    estado: { 
      type: String, 
      enum: ["pendiente", "confirmada", "cancelada", "completada"], 
      default: "pendiente" 
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;