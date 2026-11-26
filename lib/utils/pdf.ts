import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateQuotationPDF(quotation: any) {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('MIX SEGURIDAD', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Seguridad Integral que Protege su Patrimonio', 105, 30, { align: 'center' });
  
  // Título
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text('COTIZACIÓN DE SERVICIOS', 105, 55, { align: 'center' });
  
  // Información de la cotización
  doc.setFontSize(11);
  doc.text(`Número: COT-${quotation.id.slice(0, 8).toUpperCase()}`, 14, 70);
  doc.text(`Fecha: ${new Date(quotation.createdAt).toLocaleDateString('es-CO')}`, 14, 78);
  doc.text(`Estado: ${quotation.status}`, 14, 86);
  
  // Datos del prospecto
  doc.setFillColor(240, 240, 240);
  doc.rect(14, 95, 182, 8, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('DATOS DEL CLIENTE', 18, 101);
  
  doc.setFont(undefined, 'normal');
  doc.text(`Nombre: ${quotation.prospectName}`, 14, 112);
  doc.text(`Email: ${quotation.prospectEmail}`, 14, 120);
  doc.text(`Teléfono: ${quotation.prospectPhone}`, 14, 128);
  if (quotation.prospectCompany) {
    doc.text(`Empresa: ${quotation.prospectCompany}`, 14, 136);
  }
  
  // Detalles del servicio
  doc.setFillColor(240, 240, 240);
  doc.rect(14, 145, 182, 8, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('DETALLES DEL SERVICIO', 18, 151);
  
  doc.setFont(undefined, 'normal');
  doc.text(`Tipo de Servicio: ${formatServiceType(quotation.serviceType)}`, 14, 162);
  doc.text(`Tipo de Inmueble: ${formatPropertyType(quotation.propertyType)}`, 14, 170);
  doc.text(`Ubicación: ${quotation.location}`, 14, 178);
  doc.text(`Horario: ${quotation.requiredSchedule}`, 14, 186);
  if (quotation.estimatedGuards) {
    doc.text(`Guardas estimados: ${quotation.estimatedGuards}`, 14, 194);
  }
  
  // Notas adicionales
  if (quotation.additionalNotes) {
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 203, 182, 8, 'F');
    doc.setFont(undefined, 'bold');
    doc.text('NOTAS ADICIONALES', 18, 209);
    doc.setFont(undefined, 'normal');
    doc.text(quotation.additionalNotes, 14, 218, { maxWidth: 180 });
  }
  
  // Footer
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 270, 210, 27, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Mix Seguridad - info@mixseguridad.com - +57 300 123 4567', 105, 283, { align: 'center' });
  doc.text('Bogotá, Colombia', 105, 290, { align: 'center' });
  
  // Guardar
  doc.save(`Cotizacion-${quotation.id.slice(0, 8)}.pdf`);
}

export function generateContractPDF(contract: any) {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('MIX SEGURIDAD', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Seguridad Integral que Protege su Patrimonio', 105, 30, { align: 'center' });
  
  // Título
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text('CONTRATO DE SERVICIOS', 105, 55, { align: 'center' });
  
  // Información del contrato
  doc.setFontSize(11);
  doc.text(`Número de Contrato: ${contract.contractNumber}`, 14, 70);
  doc.text(`Fecha de Inicio: ${new Date(contract.startDate).toLocaleDateString('es-CO')}`, 14, 78);
  doc.text(`Fecha de Fin: ${contract.endDate ? new Date(contract.endDate).toLocaleDateString('es-CO') : 'Indefinido'}`, 14, 86);
  doc.text(`Estado: ${contract.status}`, 14, 94);
  
  // Datos de la empresa
  if (contract.company) {
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 103, 182, 8, 'F');
    doc.setFont(undefined, 'bold');
    doc.text('DATOS DE LA EMPRESA', 18, 109);
    
    doc.setFont(undefined, 'normal');
    doc.text(`Empresa: ${contract.company.name}`, 14, 120);
    doc.text(`NIT: ${contract.company.nit}`, 14, 128);
  }
  
  // Descripción del servicio
  doc.setFillColor(240, 240, 240);
  doc.rect(14, 137, 182, 8, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('DESCRIPCIÓN DEL SERVICIO', 18, 143);
  doc.setFont(undefined, 'normal');
  doc.text(contract.serviceDescription, 14, 153, { maxWidth: 180 });
  
  // Valor
  doc.setFillColor(240, 240, 240);
  doc.rect(14, 170, 182, 8, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('VALOR DEL CONTRATO', 18, 176);
  doc.setFont(undefined, 'normal');
  doc.text(`Valor Mensual: $${Number(contract.monthlyValue).toLocaleString('es-CO')} COP`, 14, 187);
  
  // Footer
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 270, 210, 27, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Mix Seguridad - info@mixseguridad.com - +57 300 123 4567', 105, 283, { align: 'center' });
  doc.text('Bogotá, Colombia', 105, 290, { align: 'center' });
  
  // Guardar
  doc.save(`Contrato-${contract.contractNumber}.pdf`);
}

function formatServiceType(type: string): string {
  const types: Record<string, string> = {
    'PHYSICAL_SURVEILLANCE': 'Vigilancia Física',
    'ESCORTS': 'Escoltas',
    'ELECTRONIC_SECURITY': 'Seguridad Electrónica',
    'MONITORING': 'Monitoreo 24/7',
    'CONSULTING': 'Consultoría',
    'MIXED': 'Servicio Mixto',
  };
  return types[type] || type;
}

function formatPropertyType(type: string): string {
  const types: Record<string, string> = {
    'RESIDENTIAL_COMPLEX': 'Conjunto Residencial',
    'SHOPPING_CENTER': 'Centro Comercial',
    'OFFICE_BUILDING': 'Edificio de Oficinas',
    'WAREHOUSE': 'Bodega',
    'EVENT': 'Evento Temporal',
    'OTHER': 'Otro',
  };
  return types[type] || type;
}

export function generateReportPDF(report: any) {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('MIX SEGURIDAD', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Seguridad Integral que Protege su Patrimonio', 105, 30, { align: 'center' });
  
  // Título del reporte
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text('REPORTE DE SEGURIDAD', 105, 55, { align: 'center' });
  
  // Información del reporte
  doc.setFontSize(11);
  doc.text(`Título: ${report.title}`, 14, 70);
  doc.text(`Tipo: ${formatReportType(report.reportType)}`, 14, 78);
  doc.text(`Fecha: ${new Date(report.reportDate).toLocaleDateString('es-CO')}`, 14, 86);
  doc.text(`Estado: ${report.status}`, 14, 94);
  doc.text(`Ubicación: ${report.location}`, 14, 102);
  
  // Datos del contrato
  if (report.contract) {
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 111, 182, 8, 'F');
    doc.setFont(undefined, 'bold');
    doc.text('DATOS DEL CONTRATO', 18, 117);
    
    doc.setFont(undefined, 'normal');
    doc.text(`Contrato: ${report.contract.contractNumber}`, 14, 128);
    if (report.contract.company) {
      doc.text(`Empresa: ${report.contract.company.name}`, 14, 136);
    }
  }
  
  // Descripción
  doc.setFillColor(240, 240, 240);
  doc.rect(14, 145, 182, 8, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('DESCRIPCIÓN DEL REPORTE', 18, 151);
  doc.setFont(undefined, 'normal');
  doc.text(report.description, 14, 161, { maxWidth: 180 });
  
  // Footer
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 270, 210, 27, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Mix Seguridad - info@mixseguridad.com - +57 300 123 4567', 105, 283, { align: 'center' });
  doc.text('Bogotá, Colombia', 105, 290, { align: 'center' });
  
  // Guardar
  doc.save(`Reporte-${report.id.slice(0, 8)}.pdf`);
}

function formatReportType(type: string): string {
  const types: Record<string, string> = {
    'DAILY_NOVELTY': 'Novedad Diaria',
    'INCIDENT': 'Incidente',
    'MONTHLY_SUMMARY': 'Resumen Mensual',
    'MAINTENANCE': 'Mantenimiento',
  };
  return types[type] || type;
}

export function generateInvoicePDF(invoice: any) {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('MIX SEGURIDAD', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Seguridad Integral que Protege su Patrimonio', 105, 30, { align: 'center' });
  
  // Título
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text('FACTURA', 105, 55, { align: 'center' });
  
  // Número de factura
  doc.setFontSize(12);
  doc.text(`N° ${invoice.invoiceNumber}`, 105, 65, { align: 'center' });
  
  // Información de la factura
  doc.setFontSize(11);
  doc.text(`Fecha de Emisión: ${new Date(invoice.issueDate).toLocaleDateString('es-CO')}`, 14, 80);
  doc.text(`Fecha de Vencimiento: ${new Date(invoice.dueDate).toLocaleDateString('es-CO')}`, 14, 88);
  doc.text(`Estado: ${invoice.status}`, 14, 96);
  
  // Datos del cliente
  if (invoice.contract && invoice.contract.company) {
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 105, 182, 8, 'F');
    doc.setFont(undefined, 'bold');
    doc.text('DATOS DEL CLIENTE', 18, 111);
    
    doc.setFont(undefined, 'normal');
    doc.text(`Empresa: ${invoice.contract.company.name}`, 14, 122);
    doc.text(`NIT: ${invoice.contract.company.nit}`, 14, 130);
    doc.text(`Contrato: ${invoice.contract.contractNumber}`, 14, 138);
  }
  
  // Detalle de la factura
  doc.setFillColor(240, 240, 240);
  doc.rect(14, 147, 182, 8, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('DETALLE', 18, 153);
  
  doc.setFont(undefined, 'normal');
  doc.text('Concepto:', 14, 164);
  doc.setFont(undefined, 'bold');
  doc.text('Servicio de seguridad mensual', 14, 172);
  
  // Valor
  doc.setFillColor(230, 240, 255);
  doc.rect(14, 182, 182, 15, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('VALOR TOTAL:', 14, 192);
  doc.text(`$${Number(invoice.value).toLocaleString('es-CO')} COP`, 100, 192);
  
  // Información de pago
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text('Información para pago:', 14, 210);
  doc.text('Banco: Bancolombia', 14, 218);
  doc.text('Cuenta de Ahorros: 123-456789-00', 14, 226);
  doc.text('Titular: Mix Seguridad SAS', 14, 234);
  
  // Footer
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 270, 210, 27, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Mix Seguridad - info@mixseguridad.com - +57 300 123 4567', 105, 283, { align: 'center' });
  doc.text('Bogotá, Colombia', 105, 290, { align: 'center' });
  
  // Guardar
  doc.save(`Factura-${invoice.invoiceNumber}.pdf`);
}