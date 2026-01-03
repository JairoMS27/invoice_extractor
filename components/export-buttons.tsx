"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProcessedInvoice, ExportFormat } from "@/lib/types";
import { FileSpreadsheet, FileText, FileJson, FileType, Loader2 } from "lucide-react";

interface ExportButtonsProps {
  invoices: ProcessedInvoice[];
}

const exportOptions: { format: ExportFormat; label: string; icon: React.ReactNode }[] = [
  { format: "xlsx", label: "Excel", icon: <FileSpreadsheet className="h-4 w-4" /> },
  { format: "csv", label: "CSV", icon: <FileText className="h-4 w-4" /> },
  { format: "json", label: "JSON", icon: <FileJson className="h-4 w-4" /> },
  { format: "pdf", label: "PDF", icon: <FileType className="h-4 w-4" /> },
];

export function ExportButtons({ invoices }: ExportButtonsProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const successfulInvoices = invoices.filter((inv) => inv.success && inv.data);

  const handleExport = async (format: ExportFormat) => {
    if (successfulInvoices.length === 0) return;

    setExporting(format);

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoices: successfulInvoices.map((inv) => inv.data),
          format,
          fileName: `facturas_${new Date().toISOString().split("T")[0]}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al exportar");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const contentDisposition = response.headers.get("Content-Disposition");
      const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
      a.download = fileNameMatch?.[1] || `facturas.${format}`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting:", error);
      alert("Error al exportar. Por favor, inténtalo de nuevo.");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {exportOptions.map(({ format, label, icon }) => (
        <Button
          key={format}
          variant="outline"
          size="sm"
          disabled={successfulInvoices.length === 0 || exporting !== null}
          onClick={() => handleExport(format)}
        >
          {exporting === format ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <span className="mr-2">{icon}</span>
          )}
          {label}
        </Button>
      ))}

      {successfulInvoices.length > 0 && (
        <span className="text-sm text-muted-foreground self-center ml-2">
          {successfulInvoices.length} {successfulInvoices.length === 1 ? "factura" : "facturas"} para exportar
        </span>
      )}
    </div>
  );
}
