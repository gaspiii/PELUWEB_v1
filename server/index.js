
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
app.use(cors());    
app.use(express.json({ limit: "5mb" })); // o 10mb si envías imágenes base64 grandes
// 🔹 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch((err) => console.error("❌ Error en MongoDB:", err));

// 🔹 Rutas API
app.get("/", (req, res) => {
  res.send("🚀 API de Peluweb funcionando");
});
import bookingRoutes from "./routes/bookingRoutes.js";
app.use("/api/bookings", bookingRoutes);
import salonRoutes from "./routes/salonRoutes.js";
app.use("/api/salons", salonRoutes);
import debugRoutes from "./routes/debugRoutes.js";
app.use("/api/debug", debugRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
// 🔹 Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
