import { Link, useParams } from "react-router-dom";

function TutorHome () {
  const {id}= useParams();
  return (
    <div style={{ padding: "20px" }}>
      <h1>Home Tutor</h1>
      <div>
      <p>Inscribir Competidor:</p>
        <Link to ={`/homeTutor/${id}/tutor/InscribirManual`}>
        <button style={{ margin: "10px", padding: "10px" }}>MANUAL</button>
        </Link>
        <button style={{ margin: "10px", padding: "10px" }}>EXCEL</button>
        <p>SUBIR COMPROBANTE:</p>
        <Link to={`/homeTutor/${id}/tutor/SubirComprobante`} >
        <button style={{ margin: "10px", padding: "10px" }}>SUBIR COMPROBANTE DE PAGO</button>
        </Link>
        
      </div>
    </div>
  );
}

export default TutorHome;