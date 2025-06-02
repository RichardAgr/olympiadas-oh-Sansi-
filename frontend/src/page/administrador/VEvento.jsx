import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VEvento.css";
import Fuse from "fuse.js"; // Import Fuse.js for fuzzy searching
import { fetchWithAuth } from "../../components/Tokens/fetchWithAuth";



const VEvento = () => {
  const [areas, setAreas] = useState([]);
  const [search, setSearch] = useState("");

 

  const fetchData = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:8000/api/evento/fechas");
      const data = await res.json();
      setAreas(data);
    } catch (err) {
      console.error("Error fetching areas:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

// 🔍 Fuzzy search with Fuse.js
const fuse = new Fuse(areas, {
  keys: ["nombre"], // Campos a buscar
  threshold: 0.4,   // Sensibilidad: más bajo = más estricto
});




 

  return (
    <div className="evento-grid-container">
      <h2 className="evento-title">Próximos eventos</h2>

      {/* 🔍 Search Box */}
      <input
        className="search"
        type="text"
        placeholder="Buscar por nombre de Área"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />

      </div>
  );
};

export default VEvento;
