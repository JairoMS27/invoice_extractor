import { InvoiceData } from "@/lib/types";

export interface ExportedInvoiceJSON {
  exportDate: string;
  totalInvoices: number;
  totalAmount: number;
  currency: string;
  invoices: InvoiceData[];
}

export function exportToJSON(invoices: InvoiceData[]): string {
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const currencies = Array.from(new Set(invoices.map((inv) => inv.currency)));

  const exportData: ExportedInvoiceJSON = {
    exportDate: new Date().toISOString(),
    totalInvoices: invoices.length,
    totalAmount: Math.round(totalAmount * 100) / 100,
    currency: currencies.length === 1 ? currencies[0] : "MIXED",
    invoices,
  };

  return JSON.stringify(exportData, null, 2);
}
