import "./tablaCompetidores.css"

const TablaCompetidores = ({students}) => {
  return (
    <div className="students-table-container">
      <table className="students-table">
        <thead>
          <tr>
            <th></th>
            <th>Nombre del estudiante</th>
            <th>Colegio</th>
            <th>Curso</th>
            <th>Competencia</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="icon-cell">
                <div className="user-icon">
                  <span>{student.nombre_completo.charAt(0)}</span>
                </div>
              </td>
              <td>{student.nombre_completo}</td>
              <td>{student.colegio}</td>
              <td>{student.curso}</td>
              <td>{student.area}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaCompetidores