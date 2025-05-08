import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export async function generarBoletaPDF(boleta) {
  try {
    const boletaData = boleta || {aviso:"No hay datos"}

    console.log("Datos de boleta recibidos para generar PDF:", {
      numero: boletaData.numero,
      tutor: boletaData.tutor,
      competidores: boletaData.competidores?.length || 0,
    })

    // Asegurarse de que todas las propiedades necesarias existan
    const numero = boletaData.numero || "7000569"
    const tutor = boletaData.tutor || "TUTOR NO ESPECIFICADO"
    const fechaEmision = boletaData.fechaEmision || boletaData.fecha_emision || new Date().toLocaleDateString()

    const montoTotal =
      typeof boletaData.montoTotal !== "undefined"
        ? boletaData.montoTotal
        : typeof boletaData.monto_total !== "undefined"
          ? boletaData.monto_total
          : 0

    const competidores = Array.isArray(boletaData.competidores) ? boletaData.competidores : []

    const doc = new jsPDF()

    // Configurar el documento
    doc.setFont("helvetica")

    // Encabezado
    doc.setFontSize(12)
    doc.text("UNIVERSIDAD MAYOR DE SAN SIMÓN", 15, 15)
    doc.text("DIRECCIÓN ADMINISTRATIVA Y FINANCIERA", 15, 20)

    doc.setFontSize(14)
    doc.setTextColor(255, 0, 0)
    doc.text(`Nro. ${numero}`, 190, 15, { align: "right" })
    doc.setTextColor(0, 0, 0) 

    // Título
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("BOLETA DE PAGO", 105, 35, { align: "center" })
    doc.setFont("helvetica", "normal")

    // Información de la boleta
    doc.setFontSize(12)

    // Ajustamos las coordenadas Y para los elementos siguientes
    doc.text("Nombre:", 15, 50)
    doc.text(tutor, 50, 50)

    doc.text("Monto Total (Bs):", 15, 57)
    doc.text(montoTotal.toString(), 50, 57)

    // Tabla de competidores (ajustamos la posición inicial)
    autoTable(doc, {
      startY: 65,
      head: [["Nro", "Nombre Competidor","Area", "Categoría", "Monto"]],
      body: competidores.map((comp, index) => [
        index + 1,
        comp.nombre || "Sin nombre",
        comp.area || "Sin área",
        comp.nivel || comp.categoria || "Sin categoría",
        comp.monto || 0,
      ]),
      theme: "grid",
      headStyles: { fillColor: [58, 124, 165] },
    })

    const finalY = doc.lastAutoTable.finalY + 10
    doc.text(`Fecha de emisión: ${fechaEmision}`, 15, finalY)
    doc.text("Estado: Pendiente", 150, finalY, { align: "right" })

    // Devolver el blob del PDF
    return doc.output("blob")
  } catch (error) {
    console.error("Error al generar la boleta:", error)
    throw new Error("Error al generar la boleta: " + (error.message || "Error desconocido"))
  }
}