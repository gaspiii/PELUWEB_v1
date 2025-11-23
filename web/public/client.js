import React from "react";
import { hydrateRoot } from "react-dom/client";
import PeluqueriaTemplate from "../templates/PeluqueriaTemplate.jsx";

// Tomamos los datos que inyectamos desde el servidor
const data = window.__INITIAL_DATA__;

hydrateRoot(
  document.getElementById("root"),
  <PeluqueriaTemplate datosPeluqueria={data} />
);
