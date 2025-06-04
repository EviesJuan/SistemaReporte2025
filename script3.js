document.getElementById("generate-pdf").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Generación del código único para la orden de trabajo
  const codigoUnico = `OT-${Date.now()}`;
  const fechaActual = new Date().toLocaleDateString("es-VE");

  // Cálculo para centrar el contenido
  const centerX = (210 - 177.8) / 2; // 16.1 mm para centrar en un tamaño A4

  // Obtención de los datos del formulario
  const cuadrilla = document.getElementById("cuadrilla").value;
  const instalacion = document.getElementById("instalacion").value;
  const descripcionEquipo = document.getElementById("descripcionEquipo").value;
  const descripcionTrabajo = document.getElementById("descripcionTrabajo").value;
  const caporal = document.getElementById("caporal").value;
  const permiso = document.getElementById("permiso").value;
  const supervision = document.getElementById("supervision").value;
  const observaciones = document.getElementById("observaciones").value;
  const tipoTrabajoInputs = document.querySelectorAll(".tabla-tipo input");
  const tipoTrabajo = Array.from(tipoTrabajoInputs).map(input => input.value || "-");

  // Obtención de las actividades de la tabla
  const tabla = document.querySelector("#tabla-semanal");
  const filas = Array.from(tabla.querySelectorAll("tr")).slice(1); // Excluimos el encabezado
  const actividades = filas.map(fila => {
    const celdas = fila.querySelectorAll("td");
    return [
      celdas[0].textContent.trim(),
      celdas[1].querySelector("input")?.value || "",
      celdas[2].querySelector("input")?.value || "",
      celdas[3].querySelector("input")?.value || ""
    ];
  });

  // Carga de imágenes del encabezado y pie de página
  const headerImg = document.getElementById("img-header");
  const footerImg = document.getElementById("img-footer");

  // Función para cargar imágenes y aplicar efecto de degradado
  const loadImageAsDataURL = (img) =>
    new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Dibujamos la imagen en el canvas
      ctx.drawImage(img, 0, 0);

      // Aplicamos degradado suave de adentro hacia afuera
      const gradientTop = ctx.createLinearGradient(0, 0, 0, 50); // Degradado en la parte superior
      gradientTop.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradientTop.addColorStop(1, "rgba(255, 255, 255, 0.2)");

      const gradientBottom = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - 50); // Degradado en la parte inferior
      gradientBottom.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradientBottom.addColorStop(1, "rgba(255, 255, 255, 0.2)");

      // Aplicamos el degradado superior
      ctx.fillStyle = gradientTop;
      ctx.fillRect(0, 0, canvas.width, 50);

      // Aplicamos el degradado inferior
      ctx.fillStyle = gradientBottom;
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

      ctx.globalCompositeOperation = "source-over"; // Restaurar modo normal

      resolve(canvas.toDataURL("image/png"));
    });

  // Cargar las imágenes como Data URLs
  const headerDataUrl = await loadImageAsDataURL(headerImg);
  const footerDataUrl = await loadImageAsDataURL(footerImg);

  // -------------------------------------------------------------
  // Sección de encabezado con imagen centrada
  doc.addImage(headerDataUrl, "PNG", centerX, 5, 177.8, 17);

  // -------------------------------------------------------------
  // Título y encabezado del reporte
  let y = 30; // Ajuste vertical inicial

  doc.setFontSize(16);
  doc.setFont(undefined, "normal");
  doc.text("ORDEN DIARIA DE TRABAJO", 105, y, { align: "center" });

  y += 10;
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Fecha: ${fechaActual}`, centerX, y);
  doc.text(`Código: ${codigoUnico}`, centerX + 140, y);
  y += 10;

  // -------------------------------------------------------------
  // Cuadro de "Cuadrilla" y "Descripción del Equipo"
  // Cuadro de "Cuadrilla" y "Descripción del Equipo"
const rowHeight1 = 12;
const colWidth = 90;

// Dibujamos los cuadros
doc.setDrawColor(0);
doc.setFillColor(230, 230, 230);
doc.rect(centerX, y, colWidth, rowHeight1, "F"); // Cuadro Cuadrilla
doc.rect(centerX + colWidth, y, 177.8 - colWidth, rowHeight1, "F"); // Cuadro Descripción del Equipo
doc.rect(centerX, y, 177.8, rowHeight1); // Borde total del cuadro

// Agregamos los textos de los campos
doc.setFont(undefined, "normal");
doc.setTextColor(0);
doc.text("Cuadrilla:", centerX + 2, y + 5);
doc.text("Lineas:", centerX + colWidth + 2, y + 5);

// Contenido de los campos
doc.setTextColor(50);
doc.text(doc.splitTextToSize(cuadrilla, 85), centerX + 2, y + 10);
doc.text(doc.splitTextToSize(descripcionEquipo, 80), centerX + colWidth + 2, y + 10);

// Nueva fila para "Instalación"
// Nueva fila para "Instalación"
y += rowHeight1; // bajamos a la siguiente fila
const rowHeightInst = 10; // nombre diferente para evitar conflicto

doc.setDrawColor(0);
doc.setFillColor(240, 240, 240);
doc.rect(centerX, y, 177.8, rowHeightInst, "F"); // fila completa
doc.rect(centerX, y, 177.8, rowHeightInst); // borde

doc.setTextColor(0);
doc.text("Instalación:", centerX + 2, y + 6);

doc.setTextColor(50);
doc.text(doc.splitTextToSize(instalacion, 160), centerX + 25, y + 6); // espacio para el contenido

y += rowHeightInst + 5; // actualizamos posición para lo siguiente


  // -------------------------------------------------------------
  // Cuadro de "Descripción del Trabajo"
  const trabajoText = doc.splitTextToSize(descripcionTrabajo, 170);
  const trabajoHeight = trabajoText.length * 5 + 6;
  doc.rect(centerX, y, 177.8, trabajoHeight);
  doc.setFont(undefined, "normal");
  doc.setTextColor(0);
  doc.text("Descripción del Trabajo:", centerX + 2, y + 5);

  doc.setTextColor(50);
  doc.text(trabajoText, centerX + 2, y + 10);
  y += trabajoHeight + 5;

  // -------------------------------------------------------------
  // Cuadro de "Tipo de Trabajo" con valores (Tabla)
  const rowHeight3 = 12;
  const ancho5 = 177.8 / 5;
  doc.rect(centerX, y, 177.8, rowHeight3);
  for (let i = 1; i < 5; i++) {
    doc.line(centerX + i * ancho5, y, centerX + i * ancho5, y + rowHeight3);
  }

  doc.setFont(undefined, "normal");
  doc.setTextColor(0);
  const etiquetas = ["Tipo", "Sitio", "Caliente", "Prioridad", "Desde"];
  etiquetas.forEach((etq, i) => {
    doc.text(etq + ":", centerX + i * ancho5 + 2, y + 5);
  });

  doc.setTextColor(50);
  tipoTrabajo.forEach((val, i) => {
    const texto = doc.splitTextToSize(val, ancho5 - 4);
    doc.text(texto, centerX + i * ancho5 + 2, y + 10);
  });
  y += rowHeight3 + 5;

  // -------------------------------------------------------------
  // Cuadro de "Actividades Semanales"
  doc.setFont(undefined, "normal");
  doc.setTextColor(0);
  doc.text("Actividades Semanales:", centerX, y);
  y += 5;

  doc.autoTable({
    startY: y,
    head: [["Día", "Actividad", "Responsable", "Firma"]],
    body: actividades,
    theme: "grid",
    styles: { fontSize: 9 },
    margin: { left: centerX, right: centerX },
    tableWidth: 177.8,
    headStyles: {
      fillColor: [115, 188, 250],
      valign: "middle"
    }
  });

  y = doc.lastAutoTable.finalY + 10;

  // -------------------------------------------------------------
  // Cuadro de "Observaciones"
  const obsText = doc.splitTextToSize(observaciones, 170);
  const obsHeight = obsText.length * 5 + 6;
  doc.rect(centerX, y, 177.8, obsHeight);
  doc.setFont(undefined, "normal");
  doc.setTextColor(0);
  doc.text("Observaciones:", centerX + 2, y + 5);

  doc.setTextColor(50);
  doc.text(obsText, centerX + 2, y + 10);

  y += obsHeight + 5;

  // -------------------------------------------------------------
  // Cuadro de "Caporal", "Permiso de Trabajo" y "Supervisión Inmediata" (moved here)
  const rowHeight2 = 12;
  const ancho3 = 177.8 / 3;
  doc.rect(centerX, y, 177.8, rowHeight2);
  doc.line(centerX + ancho3, y, centerX + ancho3, y + rowHeight2);
  doc.line(centerX + 2 * ancho3, y, centerX + 2 * ancho3, y + rowHeight2);

  doc.setFont(undefined, "normal");
  doc.setTextColor(0);
  doc.text("Caporal:", centerX + 2, y + 5);
  doc.text("Permiso de Trabajo:", centerX + ancho3 + 2, y + 5);
  doc.text("Supervisión Inmediata:", centerX + 2 * ancho3 + 2, y + 5);

  doc.setTextColor(50);
  doc.text(doc.splitTextToSize(caporal, ancho3 - 5), centerX + 2, y + 10);
  doc.text(doc.splitTextToSize(permiso, ancho3 - 5), centerX + ancho3 + 2, y + 10);
  doc.text(doc.splitTextToSize(supervision, ancho3 - 5), centerX + 2 * ancho3 + 2, y + 10);
  y += rowHeight2 + 5;

  // -------------------------------------------------------------
  // Pie de página con imagen centrada
  doc.addImage(footerDataUrl, "PNG", centerX, 275, 177.8, 17);

  // Guardamos el PDF generado con el código único
  doc.save(`${codigoUnico}.pdf`);
});



























  
  

