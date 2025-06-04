document.getElementById("generate-pdf").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const codigoUnico = `OT-${Date.now()}`;
  const fechaActual = new Date().toLocaleDateString("es-VE");

  const getValue = (id) => document.getElementById(id)?.value || '';

  const fields = {
    fecha: getValue("fecha"),
    otno: getValue("otno"),
    codigoConsig: getValue("codigoConsig"),
    Equipos: getValue ("Equipos"),
    unidad: getValue("unidad"),
    mtto: getValue("mtto"),
    lugarTrabajo: getValue("lugarTrabajo"),
    trabajoRealizar: getValue("trabajoRealizar"),
    trabajoRealizado: getValue("trabajoRealizado"),
    trabajoPendiente: getValue("trabajoPendiente"),
    vehiculosUtilizados: getValue("vehiculosUtilizados"),
    personalNumero: getValue("personalNumero"),
    tiempoJornada: getValue("tiempoJornada"),
    nombres: getValue("nombres"),
    idPersonal: getValue("idPersonal"),
    inicio: getValue("inicio"),
    fin: getValue("fin"),
    caporal: getValue("caporal"),
    permiso: getValue("permiso"),
    supervision: getValue("supervision"),
    observaciones: getValue("observaciones"),
  };

  const headerImg = document.getElementById("img-header");
  const footerImg = document.getElementById("img-footer");

  const loadImageAsDataURL = (img) =>
    new Promise((resolve, reject) => {
      const applyGradient = (canvas, ctx, width, height) => {
        // Degradado izquierdo
        const gradientLeft = ctx.createLinearGradient(0, 0, 30, 0);
        gradientLeft.addColorStop(0, "rgba(255,255,255,1)");
        gradientLeft.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradientLeft;
        ctx.fillRect(0, 0, 30, height);

        // Degradado derecho
        const gradientRight = ctx.createLinearGradient(width - 30, 0, width, 0);
        gradientRight.addColorStop(0, "rgba(255,255,255,0)");
        gradientRight.addColorStop(1, "rgba(255,255,255,1)");
        ctx.fillStyle = gradientRight;
        ctx.fillRect(width - 30, 0, 30, height);
      };

      const processImage = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        applyGradient(canvas, ctx, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };

      if (img.complete) {
        processImage();
      } else {
        img.onload = processImage;
        img.onerror = reject;
      }
    });

  try {
    const headerDataUrl = await loadImageAsDataURL(headerImg);
    const footerDataUrl = await loadImageAsDataURL(footerImg);

    const marginX = 16.1;
    doc.addImage(headerDataUrl, "PNG", marginX, 5, 177.8, 17);
    let y = 30;

    doc.setFontSize(16);
    doc.text("ORDEN DIARIA DE TRABAJO", 105, y, { align: "center" });
    y += 6;
    doc.setFontSize(10);
    doc.text(`Fecha: ${fields.fecha || fechaActual}`, marginX, y);
    doc.text(`Código: ${codigoUnico}`, marginX + 140, y);
    y += 6;

    const col3 = 177.8 / 3;
    const col2 = 177.8 / 2;
    const col4 = 177.8 / 4;

    // 3x1
   // 3x1: Fecha / OT / Consignación
   doc.rect(marginX, y, col3, 10);
   doc.rect(marginX + col3, y, col3, 10);
   doc.rect(marginX + 2 * col3, y, col3, 10);
   doc.text("Fecha:", marginX + 2, y + 4);
   doc.text("O/TNo:", marginX + col3 + 2, y + 4);
   doc.text("Código Consignación:", marginX + 2 * col3 + 2, y + 4);
   doc.text(fields.fecha || fechaActual, marginX + 2, y + 8);
   doc.text(fields.otno, marginX + col3 + 2, y + 8);
   doc.text(fields.codigoConsig, marginX + 2 * col3 + 2, y + 8);
   y += 12;

    // 2x1
    doc.rect(marginX, y, col2, 10);
    doc.rect(marginX + col2, y, col2, 10);
    doc.text("Unidad:", marginX + 2, y + 4);
    doc.text("Instalacion - Subestaciones Portuguesa:", marginX + col2 + 2, y + 4);
    doc.text(fields.unidad, marginX + 2, y + 8);
    doc.text(fields.mtto, marginX + col2 + 2, y + 8);
    y += 12;

    // Lugar de trabajo
    doc.rect(marginX, y, col2, 10);
    doc.rect(marginX + col2, y, col2, 10);
    doc.text("Lugar de Trabajo:", marginX + 2, y + 4);
    doc.text(fields.lugarTrabajo, marginX + 2, y + 8);
    y += 12;
     

    // Equipos
let equiposLines = doc.splitTextToSize(fields.Equipos, 173);
let equiposHeight = equiposLines.length * 6 + 8;
doc.rect(marginX, y, 177.8, equiposHeight);
doc.text("Equipos:", marginX + 2, y + 5);
doc.text(equiposLines, marginX + 2, y + 10);
y += equiposHeight + 3;

// Trabajo a realizar
let trabajoRealizarLines = doc.splitTextToSize(fields.trabajoRealizar, 173);
let trabajoRealizarHeight = trabajoRealizarLines.length * 6 + 8;
doc.rect(marginX, y, 177.8, trabajoRealizarHeight);
doc.text("Trabajo a Realizar:", marginX + 2, y + 5);
doc.text(trabajoRealizarLines, marginX + 2, y + 10);
y += trabajoRealizarHeight + 3;

// Trabajo realizado
let trabajoRealizadoLines = doc.splitTextToSize(fields.trabajoRealizado, 173);
let trabajoRealizadoHeight = trabajoRealizadoLines.length * 6 + 8;
doc.rect(marginX, y, 177.8, trabajoRealizadoHeight);
doc.text("Trabajo Realizado:", marginX + 2, y + 5);
doc.text(trabajoRealizadoLines, marginX + 2, y + 10);
y += trabajoRealizadoHeight + 3;

// Trabajo pendiente
let trabajoPendienteLines = doc.splitTextToSize(fields.trabajoPendiente, 173);
let trabajoPendienteHeight = trabajoPendienteLines.length * 6 + 8;
doc.rect(marginX, y, 177.8, trabajoPendienteHeight);
doc.text("Trabajo Futuro:", marginX + 2, y + 5);
doc.text(trabajoPendienteLines, marginX + 2, y + 10);
y += trabajoPendienteHeight + 3;


    // Vehículos
    doc.rect(marginX, y, col4, 10);
    doc.rect(marginX + col4, y, col4, 10);
    doc.rect(marginX + 2 * col4, y, col4, 10);
    doc.rect(marginX + 3 * col4, y, col4, 10);
    doc.text("Vehículo(s) Utilizado(s)", marginX + 2, y + 4);
    doc.text(fields.vehiculosUtilizados, marginX + 2, y + 8);
    y += 12;

    // 3x2
    const dataTripleta = [
      { label: "Nombre y Apellido:", value: fields.nombres },
      { label: "# Personal:", value: fields.personalNumero },
      { label: "Tiempo de Jornada:", value: fields.tiempoJornada },
    ];
    dataTripleta.forEach(({ label, value }, i) => {
      doc.rect(marginX + i * col3, y, col3, 10);
      doc.text(label, marginX + i * col3 + 2, y + 4);
      doc.text(value, marginX + i * col3 + 2, y + 8);
    });
    y += 12;

    // Observaciones
    const obsLines = doc.splitTextToSize(fields.observaciones, 173);
    const obsHeight = obsLines.length * 5 + 10;
    doc.rect(marginX, y, 177.8, obsHeight);
    doc.text("Observaciones:", marginX + 2, y + 5);
    doc.text(obsLines, marginX + 2, y + 10);
    y += obsHeight + 3;

    // Firmas
    const firmas = [
      { label: "Responsable:", value: fields.caporal },
      { label: "Supervisor:", value: fields.supervision },
      { label: "Jefe de la Unidad:", value: fields.permiso },
    ];
    firmas.forEach(({ label, value }, i) => {
      doc.rect(marginX + i * col3, y, col3, 15);
      doc.text(label, marginX + i * col3 + 2, y + 5);
      doc.text(value, marginX + i * col3 + 2, y + 10);
    });

    // Footer degradado
    doc.addImage(footerDataUrl, "PNG", marginX, 275, 177.8, 17);
    doc.save(`${codigoUnico}.pdf`);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
  }
});











  

  
  
  
  
  
  

  
  
  
  


  
  