import { useEffect, useState } from 'react';
import './SegundoPaso.css';
import PropTypes from "prop-types";
import axios from "axios";
import { useParams } from "react-router-dom";

const SegundoPaso = ({ onNext, onBack, formData }) => {
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [grados, setGrados] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedRango, setSelectedRango] = useState("");
  const { id } = useParams(); // ID del tutor
  const gradoId = Number(formData.grado_id);

    useEffect(() => {
       // Reinicia la selección cuando cambia el área
      setSelectedCategoria(null);
       setSelectedRango('');
    }, [selectedAreaId]);


  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/tutor/competidor/datos-competencia");
        setAreas(response.data.areas);
        setCategorias(response.data.categorias);
        setGrados(response.data.grados);
      } catch (error) {
        console.error("Error al cargar datos desde el backend", error);
      }
    };

    cargarDatos();
  }, []);

  const generarRango = (gradoInicial, gradoFinal) => {
    const inicio = grados.find((g) => g.id === gradoInicial)?.nombre;
    const fin = grados.find((g) => g.id === gradoFinal)?.nombre;
    return `${inicio} a ${fin}`;
  };

  const handleNext = async () => {
    if (selectedAreaId && selectedCategoria && selectedRango) {
      const areaNombre = areas.find((a) => a.id === selectedAreaId)?.nombre;
      const gradoSeleccionado = grados.find(g => g.id === gradoId);
    const cursoCompleto = gradoSeleccionado?.nombre || '';

      const datosCompetidor = {
        competidor: {
          ...formData,
          curso: cursoCompleto, // 👈 AQUI mandas el nombre completo del curso
          area: areaNombre,
          categoria: selectedCategoria.nombre,
          rango: selectedRango,
        }
      };

      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/tutor/${id}/inscribir-competidor`,
          datosCompetidor,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        const nuevoCompetidorId = response.data.competidor_id;// Ajusta si el backend devuelve el ID con otra clave

        alert("Competidor registrado correctamente.");
        onNext(datosCompetidor.competidor, nuevoCompetidorId);
      } catch (error) {
        console.error("Error al registrar al competidor:", error);
        if (error.response) {
          alert("Error del servidor: " + JSON.stringify(error.response.data));
        } else {
          alert("Error al registrar al competidor.");
        }
      
      }
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
    {categorias
      .filter(categoria => categoria.area_id === selectedAreaId) // 🔁 Mostrar todas de esa área
      .map(categoria => {
        const dentroDelRango = gradoId >= categoria.grado_id_inicial && gradoId <= categoria.grado_id_final;

        return (
          <button
            key={categoria.nivel_categoria_id}
            className={`option-button ${selectedCategoria?.nivel_categoria_id === categoria.nivel_categoria_id ? 'selected' : ''}`}
            onClick={() => {
              if (dentroDelRango) {
                setSelectedCategoria(categoria);
                const rango = generarRango(categoria.grado_id_inicial, categoria.grado_id_final);
                setSelectedRango(rango);
              }
            }}
            disabled={!dentroDelRango}
            title={!dentroDelRango ? 'Tu grado no corresponde a esta categoría' : ''}
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

        const dentroDelRango = gradoId >= categoria.grado_id_inicial && gradoId <= categoria.grado_id_final;
        const rangoTexto = generarRango(categoria.grado_id_inicial, categoria.grado_id_final);

        return (
          <button
            key={`rango-${categoria.nivel_categoria_id}`}
            className={`option-button ${esSeleccionado ? 'selected-rango' : ''} ${!dentroDelRango ? 'disabled-rango' : ''}`}
            disabled
            title={!dentroDelRango ? 'Tu grado no corresponde a esta categoría' : ''}
          >
            {rangoTexto}
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
  formData: PropTypes.object.isRequired
};

export default SegundoPaso;