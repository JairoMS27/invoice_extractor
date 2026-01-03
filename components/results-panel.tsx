"use client";

import { CheckCircle2, Hash, Calendar, Building2, Receipt, Copy, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ResultsPanelProps {
  data: InvoiceData;
  onReset: () => void;
  onExport: () => void;
}

export function ResultsPanel({ data, onReset, onExport }: ResultsPanelProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-6">
      {/* Success header */}
      <div className="flex items-center justify-between p-4 bg-accent/10 border border-accent/20 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">¡Extracción completada!</h3>
            <p className="text-sm text-muted-foreground">Confianza: {data.confidence}%</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={copyToClipboard}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onExport}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Hash className="w-4 h-4" />
            <span className="text-sm">Nº Factura</span>
          </div>
          <p className="font-semibold truncate">{data.invoiceNumber || "N/A"}</p>
        </div>

        <div className="p-4 bg-card border rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Fecha</span>
          </div>
          <p className="font-semibold">{data.date}</p>
        </div>

        <div className="p-4 bg-card border rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">Proveedor</span>
          </div>
          <p className="font-semibold truncate">{data.vendor.name}</p>
        </div>

        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Receipt className="w-4 h-4" />
            <span className="text-sm">Total</span>
          </div>
          <p className="font-bold text-primary text-lg">
            {formatCurrency(data.total, data.currency)}
          </p>
        </div>
      </div>

      {/* Items table */}
      {data.items.length > 0 && (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Descripción</th>
                <th className="text-right p-4 font-medium">Cantidad</th>
                <th className="text-right p-4 font-medium">Precio Unit.</th>
                <th className="text-right p-4 font-medium">Importe</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4">{item.description}</td>
                  <td className="p-4 text-right">{item.quantity}</td>
                  <td className="p-4 text-right">{formatCurrency(item.unitPrice, data.currency)}</td>
                  <td className="p-4 text-right">{formatCurrency(item.total, data.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t p-4 bg-muted/30">
            <div className="flex justify-end gap-8">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="font-medium">{formatCurrency(data.subtotal, data.currency)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  IVA {data.taxRate ? `(${data.taxRate}%)` : ""}
                </p>
                <p className="font-medium">{formatCurrency(data.tax, data.currency)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold text-primary text-lg">
                  {formatCurrency(data.total, data.currency)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onReset} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          Procesar otro documento
        </Button>
        <Button onClick={onExport} className="flex-1 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          <Download className="w-4 h-4 mr-2" />
          Exportar resultados
        </Button>
      </div>
    </div>
  );
}
