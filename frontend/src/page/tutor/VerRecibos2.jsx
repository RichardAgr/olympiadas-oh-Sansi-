
import {cargarDatos} from "../../components/plantillaExcel/ExcelDefinitivo"
import { generateExcelTemplate } from "../../components/plantillaExcel/ExcelDefinitivo";


const VerRecibos2 = () => {
    const handleClick = async () => {
    try {
      const datos = await cargarDatos();
      console.log("Datos listos para usar en el componente:", datos);
    } catch (error) {
      console.error("Error en el componente:", error.message);
    }
  }

  const handleExcel = async ()=>{
    try {
      console.log("Generando Excel...");
      
      // 1. Generar el buffer
      const buffer = await generateExcelTemplate();
      
      // 2. Crear Blob
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      
      // 3. Crear enlace de descarga
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Pruebas_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // 4. Trigger descarga
      document.body.appendChild(a);
      a.click();
      
      // 5. Limpieza
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error("Error al descargar:", error);
      alert("Ocurrió un error al generar el Excel");
    }
  }

  return (
    <>
    <div>VerRecibos2</div>
    <button onClick={handleClick}>
        cargar datos
    </button>
    <button onClick={handleExcel}>
        Descargar excel
    </button>
    </>
  )
}

export default VerRecibos2