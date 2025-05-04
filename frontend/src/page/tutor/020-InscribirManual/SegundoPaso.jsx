import  { useEffect, useState } from 'react';
import './SegundoPaso.css';
import PropTypes from "prop-types";
import axios from "axios";

const SegundoPaso = ({ onNext, onBack }) => {
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [grados, setGrados] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedRango, setSelectedRango] = useState("");

  const gradoId = 7; // Simulación: 1ro de secundaria

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await axios.get("/andy/rangos.json");
        setAreas(response.data.areas);
        setCategorias(response.data.categorias);
        setGrados(response.data.grados);
      } catch (error) {
        console.error("Error al cargar rangos.json:", error);
      }
    };

    cargarDatos();
  }, []);

  const generarRango = (gradoInicial, gradoFinal) => {
    const inicio = grados.find((g) => g.id === gradoInicial)?.nombre;
    const fin = grados.find((g) => g.id === gradoFinal)?.nombre;
    return `${inicio} a ${fin}`;
  };

  const handleNext = () => {
    if (selectedAreaId && selectedCategoria && selectedRango) {
      const areaNombre = areas.find((a) => a.id === selectedAreaId)?.nombre;
      onNext({
        area: areaNombre,
        categoria: selectedCategoria.nombre,
        rango: selectedRango,
      });
    } else {
      alert("Por favor, selecciona todos los campos.");
    }
  };
  
  return (
    <div className="inscribir-manual-container">
      <h2 className="inscribir-manual-title">Datos de competencia</h2>

      <div className="inscribir-manual-form">
        {/* Área */}
        <div className="form-group">
          <label>Área: </label>
          <div className="grid-options">
            {areas.map(area => (
              <button
                key={area.id}
                className={`option-button ${selectedAreaId === area.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedAreaId(area.id);
                  setSelectedCategoria(null);
                  setSelectedRango('');
                }}
              >
                {area.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Categoría */}
        <div className="form-group">
          <label>Categoría: </label>
          <div className="grid-options">
            {categorias.map(categoria => {
              const habilitada = categoria.area_id === selectedAreaId &&
                gradoId >= categoria.grado_id_inicial &&
                gradoId <= categoria.grado_id_final;

              return (
                <button
                  key={categoria.nivel_categoria_id}
                  className={`option-button ${selectedCategoria?.nivel_categoria_id === categoria.nivel_categoria_id ? 'selected' : ''}`}
                  onClick={() => {
                    if (habilitada) {
                      setSelectedCategoria(categoria);
                      const rango = generarRango(categoria.grado_id_inicial, categoria.grado_id_final);
                      setSelectedRango(rango);
                    }
                  }}
                  disabled={!habilitada}
                >
                  {categoria.nombre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rango */}
<div className="form-group">
  <label>Rango: </label>
  <div className="grid-options">
    {categorias
      .filter(categoria => categoria.area_id === selectedAreaId)
      .map(categoria => {
        const esSeleccionado =
          selectedCategoria?.nivel_categoria_id === categoria.nivel_categoria_id;

        return (
          <button
            key={`rango-${categoria.nivel_categoria_id}`}
            className={`option-button ${esSeleccionado ? 'selected-rango' : ''}`}
            disabled // Evita que el usuario lo seleccione
          >
            {generarRango(categoria.grado_id_inicial, categoria.grado_id_final)}
          </button>
        );
      })}
  </div>
</div>

        {/* Botones */}
        <div className="submit-button-container">
          <button className="submit-button cancel" onClick={onBack}>Volver</button>
          <button className="submit-button" onClick={handleNext}>Siguiente</button>
        </div>
      </div>
    </div>
  );
};

SegundoPaso.propTypes = {
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default SegundoPaso;