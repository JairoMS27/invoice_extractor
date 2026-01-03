import { stringify } from "csv-stringify/sync";
import { InvoiceData } from "@/lib/types";

export function exportToCSV(invoices: InvoiceData[], fileName: string): string {
  const rows = invoices.map((inv, index) => ({
    id: index + 1,
    invoiceNumber: inv.invoiceNumber || "",
    date: inv.date,
    vendorName: inv.vendor.name,
    vendorNif: inv.vendor.nif || "",
    vendorAddress: inv.vendor.address || "",
    subtotal: inv.subtotal,
    taxRate: inv.taxRate || "",
    tax: inv.tax,
    total: inv.total,
    currency: inv.currency,
    confidence: inv.confidence,
    itemsCount: inv.items.length,
  }));

  const csv = stringify(rows, {
    header: true,
    columns: [
      { key: "id", header: "ID" },
      { key: "invoiceNumber", header: "Numero Factura" },
      { key: "date", header: "Fecha" },
      { key: "vendorName", header: "Vendedor" },
      { key: "vendorNif", header: "NIF/CIF" },
      { key: "vendorAddress", header: "Direccion" },
      { key: "subtotal", header: "Subtotal" },
      { key: "taxRate", header: "IVA (%)" },
      { key: "tax", header: "Impuestos" },
      { key: "total", header: "Total" },
      { key: "currency", header: "Moneda" },
      { key: "confidence", header: "Confianza (%)" },
      { key: "itemsCount", header: "Num. Items" },
    ],
    delimiter: ";",
  });

  return csv;
}

export function exportItemsToCSV(invoices: InvoiceData[]): string {
  const allItems: Record<string, unknown>[] = [];

  invoices.forEach((inv, invIndex) => {
    inv.items.forEach((item, itemIndex) => {
      allItems.push({
        invoiceId: invIndex + 1,
        invoiceNumber: inv.invoiceNumber || "",
        vendorName: inv.vendor.name,
        date: inv.date,
        lineNumber: itemIndex + 1,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.total,
        currency: inv.currency,
      });
    });
  });

  const csv = stringify(allItems, {
    header: true,
    columns: [
      { key: "invoiceId", header: "ID Factura" },
      { key: "invoiceNumber", header: "Numero Factura" },
      { key: "vendorName", header: "Vendedor" },
      { key: "date", header: "Fecha" },
      { key: "lineNumber", header: "Num. Linea" },
      { key: "description", header: "Descripcion" },
      { key: "quantity", header: "Cantidad" },
      { key: "unitPrice", header: "Precio Unitario" },
      { key: "lineTotal", header: "Total Linea" },
      { key: "currency", header: "Moneda" },
    ],
    delimiter: ";",
  });

  return csv;
}
