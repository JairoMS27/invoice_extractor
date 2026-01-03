"use client";

import { useState } from "react";
import { X, FileJson, FileSpreadsheet, FileText, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InvoiceData, ExportFormat } from "@/lib/types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvoiceData;
}

const formats = [
  {
    id: "json" as ExportFormat,
    name: "JSON",
    description: "Formato estructurado para desarrolladores",
    icon: FileJson,
    color: "bg-yellow-500/10 text-yellow-600",
  },
  {
    id: "csv" as ExportFormat,
    name: "CSV",
    description: "Compatible con Excel y hojas de cálculo",
    icon: FileSpreadsheet,
    color: "bg-green-500/10 text-green-600",
  },
  {
    id: "xlsx" as ExportFormat,
    name: "Excel",
    description: "Formato nativo de Microsoft Excel",
    icon: FileText,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    id: "pdf" as ExportFormat,
    name: "PDF",
    description: "Documento formateado listo para imprimir",
    icon: File,
    color: "bg-red-500/10 text-red-600",
  },
];

export function ExportModal({ isOpen, onClose, data }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!selectedFormat) return;

    setIsExporting(true);
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoices: [data],
          format: selectedFormat,
          fileName: `factura_${data.invoiceNumber || data.date}`,
        }),
      });

      if (!response.ok) throw new Error("Error al exportar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const contentDisposition = response.headers.get("Content-Disposition");
      const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
      a.download = fileNameMatch?.[1] || `factura.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      onClose();
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Exportar Resultados</h2>
            <p className="text-sm text-muted-foreground">Elige el formato de salida</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Format options */}
        <div className="space-y-3 mb-6">
          {formats.map((format) => {
            const Icon = format.icon;
            const isSelected = selectedFormat === format.id;

            return (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", format.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{format.name}</p>
                  <p className="text-sm text-muted-foreground">{format.description}</p>
                </div>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 transition-colors",
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={!selectedFormat || isExporting}
            className="flex-1"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              "Descargar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
