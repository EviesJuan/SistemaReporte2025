document.getElementById("form1").addEventListener("submit", function (event) {
  event.preventDefault();

  const encabezadoImg = new Image();
  encabezadoImg.src = 'imagen/htl16.PNG';

  const pieImg = new Image();
  pieImg.src = 'imagen/imagen3.PNG';

  encabezadoImg.onload = () => {
    pieImg.onload = () => {
      generarPDF(encabezadoImg, pieImg);
    };
  };
});

function generarCodigoUnico() {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codigoUnico = "";
  for (let i = 0; i < 8; i++) {
    codigoUnico += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigoUnico;
}

function generarPDF(encabezadoImg, pieImg) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const get = (id) => document.getElementById(id).value || "";

  const fecha = get("fecha");
  const instalacion = get("instalacion");
  const descripcionEquipo = get ("descripcionEquipo");
  const inicio = get("inicio");
  const fin = get("fin");
  const orden = get("orden");
  const equipo = get("equipo");
  const descripcion = get("descripcion");
  const consecuencias = get("consecuencias");
  const pendiente = get("pendiente");
  const material = get("material");
  const observacion = get("observacion");

  const codigoUnico = generarCodigoUnico();

  const imagenAncho = 177.8;
  const imagenAltoEncabezado = 17;
  const imagenAltoPie = 15.5;
  const margenLateral = (210 - imagenAncho) / 2;

  // --- ENCABEZADO --- 
  const encabezadoY = 5;
  doc.addImage(encabezadoImg, 'PNG', margenLateral, encabezadoY, imagenAncho, imagenAltoEncabezado);

  // --- PIE DE PÁGINA --- 
  const pieY = 297 - imagenAltoPie - 7; // 7 mm desde el borde inferior
  doc.addImage(pieImg, 'PNG', margenLateral, pieY, imagenAncho, imagenAltoPie);

  // --- TÍTULO --- 
  doc.setFillColor(115, 188, 250);
  doc.rect(margenLateral, 25, imagenAncho, 10, "F");
  doc.setTextColor(255);
  doc.setFontSize(10);
  const titulo = doc.splitTextToSize(
    "Reporte, Grupo de Mantenimiento, Protecciones, Registros, Medición, Supervisión y Control",
    imagenAncho
  );
  doc.text(titulo, 105, 30, { align: "center" });

  doc.setTextColor(0);
  doc.setFontSize(11);

  // --- TABLA DE DATOS (Ajustada a un tamaño más pequeño) --- 
  doc.autoTable({
    startY: 40,
    head: [['Campo', 'Valor']],
    body: [
      ['Código Único', codigoUnico],
      ['Fecha', fecha],
      ['Instalación', instalacion],
      ['Lineas',descripcionEquipo],
      ['Inicio', inicio],
      ['Fin', fin],
      ['N° Permiso / OT', orden],
      ['Equipo', equipo]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [115, 188, 250],
      textColor: 255,
    },
    styles: {
      halign: 'left',
      cellPadding: 2, // Reducido para hacer la tabla más compacta
      fontSize: 9, // Tamaño de fuente más pequeño
      tableWidth: imagenAncho,
    },
    margin: { left: margenLateral, right: margenLateral }
  });

  let currentY = doc.lastAutoTable.finalY + 10;

  // --- FUNCIONES PARA AGREGAR SECCIONES (Ajustadas a un tamaño más alto) --- 
  const agregarSeccion = (titulo, texto) => {
    // Aumentamos la altura de los cuadros, pero manteniendo el mismo ancho
    const altoCaja = doc.getTextDimensions(texto).h + 12; // Aumento en la altura de la caja

    // Evita que se acerque al pie de página
    if (currentY + altoCaja + 20 > 297 - imagenAltoPie) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(115, 188, 250);
    doc.setTextColor(255);
    doc.rect(margenLateral, currentY, imagenAncho, 8, "F");
    doc.text(titulo, margenLateral + 2, currentY + 5.5);

    currentY += 10;

    doc.setTextColor(0);
    doc.setDrawColor(0);
    doc.rect(margenLateral, currentY, imagenAncho, altoCaja);
    doc.text(doc.splitTextToSize(texto, imagenAncho - 4), margenLateral + 2, currentY + 6);

    currentY += altoCaja + 5; // Espaciado ajustado
  };

  // --- AGREGAR CUADROS DE TEXTO (Ajustados a un tamaño más alto) --- 
  agregarSeccion("Descripción del trabajo", descripcion);
  agregarSeccion("Consecuencias", consecuencias);
  agregarSeccion("Actividad Pendiente", pendiente);
  agregarSeccion("Material o equipo pendiente", material);
  agregarSeccion("Observaciones", observacion);

  const nombreArchivo = `reporte_${codigoUnico}.pdf`;
  doc.save(nombreArchivo);
}

















  