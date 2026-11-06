/**
 * Shared PDF and Excel export utilities for all dashboard pages.
 * Uses jspdf + jspdf-autotable for PDF, xlsx for Excel.
 */

export interface ExportColumn {
  label: string;
  value: (row: any) => unknown;
}

function stringify(value: unknown): string {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'object') {
    const obj = value as any;
    return obj.fullName || obj.name || (obj.make ? `${obj.make} ${obj.model || ''}`.trim() : null) || obj.invoiceNumber || '';
  }
  return String(value);
}

/** Download data as an Excel (.xlsx) file */
export async function exportExcel(filename: string, columns: ExportColumn[], rows: any[]): Promise<void> {
  const { utils, writeFile } = await import('xlsx');
  const header = columns.map((c) => c.label);
  const data = rows.map((row) => columns.map((c) => stringify(c.value(row))));
  const ws = utils.aoa_to_sheet([header, ...data]);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

/** Download data as a PDF file using jspdf + autotable */
export async function exportPdf(title: string, filename: string, columns: ExportColumn[], rows: any[]): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 23);
  autoTable(doc, {
    startY: 28,
    head: [columns.map((c) => c.label)],
    body: rows.map((row) => columns.map((c) => stringify(c.value(row)))),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [15, 118, 110], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });
  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
