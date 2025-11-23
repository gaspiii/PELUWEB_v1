import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telefono: { type: String },

    rol: { type: String, enum: ["admin", "dueño"], default: "dueño" },
    salons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Salon" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
