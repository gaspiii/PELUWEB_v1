// server/models/Salon.js
import mongoose from "mongoose";

const salonSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    slogan: String,
    descripcion: String,
    telefono: String,
    email: String,
    direccion: String,
    horarios: String,
    whatsapp: String,
    template: String,
    logo: String,
    imagenes: [String],
    servicios: [
      {
        nombre: String,
        precio: String,
        duracion: String,
        descripcion: String,
      },
    ],
    equipo: [
      {
        nombre: String,
        cargo: String,
        foto: String,
        bio: String,
      },
    ],
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    slug: { 
      type: String, 
      unique: true, 
      required: true 
    },
    estado: { 
      type: String, 
      enum: ["pendiente", "aprobado", "rechazado"], 
      default: "pendiente" 
    },
  },
  { timestamps: true }
);

const Salon = mongoose.model("Salon", salonSchema);

export default Salon;