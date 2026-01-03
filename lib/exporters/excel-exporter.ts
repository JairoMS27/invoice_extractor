import * as XLSX from "xlsx";
import { InvoiceData } from "@/lib/types";

export function exportToExcel(invoices: InvoiceData[], fileName: string): Buffer {
  const workbook = XLSX.utils.book_new();

  // Hoja principal con resumen de facturas
  const summaryData = invoices.map((inv, index) => ({
    "#": index + 1,
    "Número Factura": inv.invoiceNumber || "-",
    Fecha: inv.date,
    Vendedor: inv.vendor.name,
    "NIF/CIF": inv.vendor.nif || "-",
    Dirección: inv.vendor.address || "-",
    Subtotal: inv.subtotal,
    "IVA (%)": inv.taxRate || "-",
    Impuestos: inv.tax,
    Total: inv.total,
    Moneda: inv.currency,
    "Confianza (%)": inv.confidence,
  }));

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);

  // Ajustar anchos de columna
  summarySheet["!cols"] = [
    { wch: 5 },   // #
    { wch: 15 },  // Número Factura
    { wch: 12 },  // Fecha
    { wch: 25 },  // Vendedor
    { wch: 15 },  // NIF/CIF
    { wch: 30 },  // Dirección
    { wch: 12 },  // Subtotal
    { wch: 10 },  // IVA (%)
    { wch: 12 },  // Impuestos
    { wch: 12 },  // Total
    { wch: 8 },   // Moneda
    { wch: 12 },  // Confianza
  ];

  XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen");

  // Hoja con todas las líneas de detalle
  const allItems: Record<string, unknown>[] = [];
  invoices.forEach((inv, invIndex) => {
    inv.items.forEach((item, itemIndex) => {
      allItems.push({
        "# Factura": invIndex + 1,
        "Número Factura": inv.invoiceNumber || "-",
        Vendedor: inv.vendor.name,
        Fecha: inv.date,
        "# Línea": itemIndex + 1,
        Descripción: item.description,
        Cantidad: item.quantity,
        "Precio Unitario": item.unitPrice,
        Total: item.total,
        Moneda: inv.currency,
      });
    });
  });

  if (allItems.length > 0) {
    const detailsSheet = XLSX.utils.json_to_sheet(allItems);
    detailsSheet["!cols"] = [
      { wch: 10 },  // # Factura
      { wch: 15 },  // Número Factura
      { wch: 25 },  // Vendedor
      { wch: 12 },  // Fecha
      { wch: 8 },   // # Línea
      { wch: 40 },  // Descripción
      { wch: 10 },  // Cantidad
      { wch: 15 },  // Precio Unitario
      { wch: 12 },  // Total
      { wch: 8 },   // Moneda
    ];
    XLSX.utils.book_append_sheet(workbook, detailsSheet, "Detalle");
  }

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return buffer;
}
