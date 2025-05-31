import { useEffect, useState } from "react";
import axios from "axios";
import "./SelectorGrado.css";

function SelectorGrado({ onSeleccionarGrados }) {
  const [grados, setGrados] = useState([]);
  const [gradoInicial, setGradoInicial] = useState("");
  const [gradoFinal, setGradoFinal] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/grados")
      .then((res) => setGrados(res.data))
      .catch((err) => console.error("Error al cargar grados", err));
  }, []);

  useEffect(() => {
    // Enviar datos al padre cuando ambos estén seleccionados
    if (gradoInicial && gradoFinal) {
      onSeleccionarGrados({ grado_id_inicial: gradoInicial, grado_id_final: gradoFinal });
    }
  }, [gradoInicial, gradoFinal]);

  return (
    <div className="selector-grado">
      <label>Grado Inicial</label>
      <select value={gradoInicial} onChange={(e) => setGradoInicial(e.target.value)} required>
        <option value="">Seleccionar grado inicial</option>
        {grados.map((g) => (
          <option key={g.grado_id} value={g.grado_id}>
            {g.nombre}
          </option>
        ))}
      </select>

      <label>Grado Final</label>
      <select value={gradoFinal} onChange={(e) => setGradoFinal(e.target.value)} required>
        <option value="">Seleccionar grado final</option>
        {grados.map((g) => (
          <option key={g.grado_id} value={g.grado_id}>
            {g.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectorGrado;
