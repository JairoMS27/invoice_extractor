import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { InvoiceData } from "@/lib/types";

export function exportToPDF(invoices: InvoiceData[], fileName: string): Buffer {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.text("Informe de Facturas", 14, 22);

  // Fecha de exportación
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${new Date().toLocaleDateString("es-ES")}`, 14, 30);

  // Resumen
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Total facturas: ${invoices.length}`, 14, 40);
  doc.text(`Importe total: ${totalAmount.toFixed(2)} EUR`, 14, 47);

  // Tabla de resumen
  const tableData = invoices.map((inv, index) => [
    (index + 1).toString(),
    inv.invoiceNumber || "-",
    inv.date,
    inv.vendor.name.substring(0, 25),
    inv.vendor.nif || "-",
    `${inv.total.toFixed(2)} ${inv.currency}`,
    `${inv.confidence}%`,
  ]);

  autoTable(doc, {
    startY: 55,
    head: [["#", "Nº Factura", "Fecha", "Vendedor", "NIF/CIF", "Total", "Conf."]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 25 },
      2: { cellWidth: 22 },
      3: { cellWidth: 45 },
      4: { cellWidth: 25 },
      5: { cellWidth: 30 },
      6: { cellWidth: 15 },
    },
  });

  // Detalle por factura (nueva página)
  invoices.forEach((inv, index) => {
    doc.addPage();

    doc.setFontSize(16);
    doc.text(`Factura ${index + 1}: ${inv.invoiceNumber || "Sin número"}`, 14, 20);

    doc.setFontSize(10);
    doc.text(`Fecha: ${inv.date}`, 14, 30);
    doc.text(`Vendedor: ${inv.vendor.name}`, 14, 37);
    if (inv.vendor.nif) {
      doc.text(`NIF/CIF: ${inv.vendor.nif}`, 14, 44);
    }
    if (inv.vendor.address) {
      doc.text(`Dirección: ${inv.vendor.address}`, 14, 51);
    }

    // Tabla de items
    if (inv.items.length > 0) {
      const itemsData = inv.items.map((item, i) => [
        (i + 1).toString(),
        item.description.substring(0, 40),
        item.quantity.toString(),
        `${item.unitPrice.toFixed(2)}`,
        `${item.total.toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: 60,
        head: [["#", "Descripción", "Cant.", "P. Unit.", "Total"]],
        body: itemsData,
        theme: "grid",
        headStyles: {
          fillColor: [100, 116, 139],
          fontSize: 9,
        },
        bodyStyles: {
          fontSize: 8,
        },
      });
    }

    // Totales
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable?.finalY || 100;
    doc.setFontSize(10);
    doc.text(`Subtotal: ${inv.subtotal.toFixed(2)} ${inv.currency}`, 140, finalY + 10);
    doc.text(
      `IVA${inv.taxRate ? ` (${inv.taxRate}%)` : ""}: ${inv.tax.toFixed(2)} ${inv.currency}`,
      140,
      finalY + 17
    );
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${inv.total.toFixed(2)} ${inv.currency}`, 140, finalY + 26);
  });

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
