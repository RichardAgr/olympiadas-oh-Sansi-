import "./excelPreview.css"

const ExcelPreview = ({data}) => {
    if (!data) return null

    const { competidores, tutores, relaciones } = data
  
    return (
      <div className="excelPreview">
        <div className="previewSection">
          <h3>Competidores ({competidores.length})</h3>
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>CI</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Fecha Nac.</th>
                  <th>Colegio</th>
                  <th>Área 1</th>
                  <th>Nivel 1</th>
                  <th>Área 2</th>
                  <th>Nivel 2</th>
                </tr>
              </thead>
              <tbody>
                {competidores.map((competidor, index) => (
                  <tr key={index}>
                    <td>{competidor.ci || competidor.CI || competidor["CI (*)"] || "-"}</td>
                    <td>{competidor.nombres || competidor.Nombres || competidor["Nombres (*)"] || "-"}</td>
                    <td>{competidor.apellidos || competidor.Apellidos || competidor["Apellidos (*)"] || "-"}</td>
                    <td>{competidor.fecha_nacimiento || competidor["Fecha Nacimiento (*)"] || "-"}</td>
                    <td>{competidor.colegio || competidor["Colegio (*)"] || "-"}</td>
                    <td>{competidor.area1 || competidor["Área 1 (*)"] || "-"}</td>
                    <td>{competidor.nivel1 || competidor["Categoría/Nivel 1 (*)"] || "-"}</td>
                    <td>{competidor.area2 || competidor["Área 2"] || "-"}</td>
                    <td>{competidor.nivel2 || competidor["Categoría/Nivel 2"] || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        <div className="previewSection">
          <h3>Tutores ({tutores.length})</h3>
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>CI</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {tutores.map((tutor, index) => (
                  <tr key={index}>
                    <td>{tutor.ci || tutor.CI || tutor["CI (*)"] || "-"}</td>
                    <td>{tutor.nombres || tutor.Nombres || tutor["Nombres (*)"] || "-"}</td>
                    <td>{tutor.apellidos || tutor.Apellidos || tutor["Apellidos (*)"] || "-"}</td>
                    <td>{tutor.correo || tutor["Correo Electrónico (*)"] || "-"}</td>
                    <td>{tutor.telefono || tutor["Teléfono (*)"] || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        <div className="previewSection">
          <h3>Relaciones Competidor-Tutor ({relaciones.length})</h3>
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>CI Competidor</th>
                  <th>CI Tutor</th>
                  <th>Nivel Responsabilidad</th>
                  <th>Relación</th>
                  <th>Responsable Pago</th>
                </tr>
              </thead>
              <tbody>
                {relaciones.map((relacion, index) => (
                  <tr key={index}>
                    <td>{relacion.ci_competidor || relacion["CI Competidor (*)"] || "-"}</td>
                    <td>{relacion.ci_tutor || relacion["CI Tutor (*)"] || "-"}</td>
                    <td>{relacion.nivel_responsabilidad || relacion["Nivel Responsabilidad (*)"] || "-"}</td>
                    <td>{relacion.relacion || relacion["Relación con Competidor (*)"] || "-"}</td>
                    <td>{relacion.responsable_pago || relacion["Responsable de Pago"] || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        <div className="summarySection">
          <h3>Resumen</h3>
          <div className="summaryGrid">
            <div className="summaryItem">
              <span className="summaryLabel">Total Competidores:</span>
              <span className="summaryValue">{competidores.length}</span>
            </div>
            <div className="summaryItem">
              <span className="summaryLabel">Total Áreas:</span>
              <span className="summaryValue">
                {
                  new Set([
                    ...competidores.map((c) => c.area1 || c["Área 1 (*)"]),
                    ...competidores.filter((c) => c.area2 || c["Área 2"]).map((c) => c.area2 || c["Área 2"]),
                  ]).size
                }
              </span>
            </div>
            <div className="summaryItem">
              <span className="summaryLabel">Total Inscripciones:</span>
              <span className="summaryValue">
                {competidores.length + competidores.filter((c) => c.area2 || c["Área 2"]).length}
              </span>
            </div>
            <div className="summaryItem">
              <span className="summaryLabel">Monto Total (Bs):</span>
              <span className="summaryValue">
                {(competidores.length + competidores.filter((c) => c.area2 || c["Área 2"]).length) * 15}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
}

export default ExcelPreview