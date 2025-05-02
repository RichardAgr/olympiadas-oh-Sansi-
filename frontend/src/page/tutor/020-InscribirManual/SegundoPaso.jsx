import  { useState, useEffect } from 'react';
import './SegundoPaso.css';
import PropTypes from "prop-types";

// Simulación de datos
const areas = [
  { id: 1, nombre: "NINGUNO" },
  { id: 2, nombre: "ASTRONOMIA - ASTROFISICA" },
  { id: 3, nombre: "MATEMATICAS" },
  { id: 4, nombre: "BIOLOGIA" },
  { id: 5, nombre: "INFORMATICA" },
  { id: 6, nombre: "QUIMICA" },
  { id: 7, nombre: "ROBOTICA" }
];

const categorias = [
    // ASTRONOMÍA - ASTROFÍSICA
    { nivel_categoria_id: 1, area_id: 2, grado_id_inicial: 1, grado_id_final: 3, nombre: "ORIÓN" },
    { nivel_categoria_id: 2, area_id: 2, grado_id_inicial: 4, grado_id_final: 6, nombre: "ANDRÓMEDA" },
    { nivel_categoria_id: 3, area_id: 2, grado_id_inicial: 7, grado_id_final: 9, nombre: "GUACAMAYO" },
    { nivel_categoria_id: 4, area_id: 2, grado_id_inicial: 10, grado_id_final: 12, nombre: "CENTAURI" },
  
    // MATEMÁTICAS
    { nivel_categoria_id: 5, area_id: 3, grado_id_inicial: 1, grado_id_final: 3, nombre: "DELFIN" },
    { nivel_categoria_id: 6, area_id: 3, grado_id_inicial: 4, grado_id_final: 6, nombre: "TORTUGA" },
    { nivel_categoria_id: 7, area_id: 3, grado_id_inicial: 7, grado_id_final: 9, nombre: "GUANACO" },
    { nivel_categoria_id: 8, area_id: 3, grado_id_inicial: 10, grado_id_final: 12, nombre: "ALBATROS" },
  
    // BIOLOGÍA
    { nivel_categoria_id: 9, area_id: 4, grado_id_inicial: 1, grado_id_final: 4, nombre: "ZORRO" },
    { nivel_categoria_id: 10, area_id: 4, grado_id_inicial: 5, grado_id_final: 8, nombre: "COLIBRÍ" },
    { nivel_categoria_id: 11, area_id: 4, grado_id_inicial: 7, grado_id_final: 9, nombre: "LONDRA" },
    { nivel_categoria_id: 12, area_id: 4, grado_id_inicial: 10, grado_id_final: 12, nombre: "OSO PARDO" },
  
    // INFORMÁTICA
    { nivel_categoria_id: 13, area_id: 5, grado_id_inicial: 1, grado_id_final: 3, nombre: "CÓDIGO BÁSICO" },
    { nivel_categoria_id: 14, area_id: 5, grado_id_inicial: 4, grado_id_final: 6, nombre: "BUFEO" },
    { nivel_categoria_id: 15, area_id: 5, grado_id_inicial: 7, grado_id_final: 9, nombre: "PANTERA" },
    { nivel_categoria_id: 16, area_id: 5, grado_id_inicial: 10, grado_id_final: 12, nombre: "LEOPARDO" },
  
    // QUÍMICA
    { nivel_categoria_id: 17, area_id: 6, grado_id_inicial: 1, grado_id_final: 6, nombre: "ELEMENTAL" },
    { nivel_categoria_id: 18, area_id: 6, grado_id_inicial: 7, grado_id_final: 9, nombre: "MOLECULAR" },
    { nivel_categoria_id: 19, area_id: 6, grado_id_inicial: 10, grado_id_final: 12, nombre: "PUMA" },
  
    // ROBÓTICA
    { nivel_categoria_id: 20, area_id: 7, grado_id_inicial: 1, grado_id_final: 6, nombre: "NANO" },
    { nivel_categoria_id: 21, area_id: 7, grado_id_inicial: 7, grado_id_final: 9, nombre: "MECHA" },
    { nivel_categoria_id: 22, area_id: 7, grado_id_inicial: 10, grado_id_final: 12, nombre: "JUCUMARI" }
  ];
  

const grados = [
  { id: 1, nombre: "1RO PRIMARIA" },
  { id: 2, nombre: "2DO PRIMARIA" },
  { id: 3, nombre: "3RO PRIMARIA" },
  { id: 4, nombre: "4TO PRIMARIA" },
  { id: 5, nombre: "5TO PRIMARIA" },
  { id: 6, nombre: "6TO PRIMARIA" },
  { id: 7, nombre: "1RO SECUNDARIA" },
  { id: 8, nombre: "2DO SECUNDARIA" },
  { id: 9, nombre: "3RO SECUNDARIA" },
  { id: 10, nombre: "4TO SECUNDARIA" },
  { id: 11, nombre: "5TO SECUNDARIA" },
  { id: 12, nombre: "6TO SECUNDARIA" }
];

const SegundoPaso = ({ onNext, onBack }) => {
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedRango, setSelectedRango] = useState('');
  
  // Simulación de grado seleccionado (para probar la lógica)
  const gradoId = 7; // Simulación de grado 1ro Secundaria

  // Función para generar el rango de grados
  const generarRango = (gradoInicial, gradoFinal) => {
    const gradoInicialTexto = grados.find(g => g.id === gradoInicial)?.nombre;
    const gradoFinalTexto = grados.find(g => g.id === gradoFinal)?.nombre;

    return `${gradoInicialTexto} a ${gradoFinalTexto}`;
  };

  // Filtrar categorías habilitadas según área y grado
  useEffect(() => {
    const categoriasHabilitadas = categorias.filter(categoria => 
      categoria.area_id === selectedAreaId && gradoId >= categoria.grado_id_inicial && gradoId <= categoria.grado_id_final
    );
    
    // Si se encuentran categorías habilitadas, seleccionamos la primera por defecto
    if (categoriasHabilitadas.length > 0) {
      setSelectedCategoria(categoriasHabilitadas[0].nombre);
      
      // Asignamos el rango correspondiente de acuerdo a la categoría seleccionada
      const categoriaSeleccionada = categoriasHabilitadas[0];
      const rango = generarRango(categoriaSeleccionada.grado_id_inicial, categoriaSeleccionada.grado_id_final);
      setSelectedRango(rango);
    }
  }, [selectedAreaId, gradoId]);

  const handleNext = () => {
    if (selectedAreaId && selectedCategoria && selectedRango) {
      onNext({ 
        area: areas.find(a => a.id === selectedAreaId)?.nombre || '',
        categoria: selectedCategoria?.nombre || '',
        rango: selectedRango
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
          <label>
            Área: <span className="required">*</span>
          </label>
          <div className="grid-options">
            {areas.map((area) => (
              <button
                key={area.id}
                className={`option-button ${selectedAreaId === area.id ? 'selected' : ''}`}
                onClick={() => setSelectedAreaId(area.id)}
              >
                {area.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Categoría */}
        <div className="form-group">
          <label>
            Categoría: <span className="required">*</span>
          </label>
          <div className="grid-options">
            {categorias.map((categoria) => {
              const habilitada = categoria.area_id === selectedAreaId &&
                gradoId >= categoria.grado_id_inicial && gradoId <= categoria.grado_id_final;

              return (
                <button
                  key={categoria.nivel_categoria_id}
                  className={`option-button ${selectedCategoria === categoria.nombre ? 'selected' : ''}`}
                  onClick={() => habilitada && setSelectedCategoria(categoria)}
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
  <label>Rango: <span className="required">*</span></label>
  <div className="grid-options">
    {categorias
      .filter(c => c.area_id === selectedAreaId)
      .map(categoria => {
        const rango = generarRango(categoria.grado_id_inicial, categoria.grado_id_final);
        const pertenece = gradoId >= categoria.grado_id_inicial && gradoId <= categoria.grado_id_final;
        return (
          <button
            key={`rango-${categoria.nivel_categoria_id}`}
            className={`option-button ${pertenece ? 'selected-rango' : ''}`}
            onClick={() => setSelectedRango(rango)}
          >
            {rango}
          </button>
        );
      })}
  </div>
</div>


        {/* Botones de navegación */}
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
