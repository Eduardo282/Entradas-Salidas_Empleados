import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ExitRecord } from '../types';

export const generateMonthlyReport = (records: ExitRecord[], month: Date) => {
  const doc = new jsPDF();
  const monthYear = format(month, 'MMMM yyyy', { locale: es });
  
  // Title
  doc.setFontSize(20);
  doc.text(`Reporte de Salidas - ${monthYear}`, 14, 20);

  // Filter records for the selected month
  const monthlyRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === month.getMonth() && 
           recordDate.getFullYear() === month.getFullYear();
  });

  // Table
  autoTable(doc, {
    head: [['Fecha', 'Nombre', 'Motivo', 'Salida', 'Regreso', 'Observaciones']],
    body: monthlyRecords.map(record => [
      format(new Date(record.date), 'dd/MM/yyyy'),
      record.name,
      record.reason,
      record.exitTime,
      record.returnTime,
      record.observations
    ]),
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  // Save the PDF
  doc.save(`reporte-salidas-${monthYear}.pdf`);
};