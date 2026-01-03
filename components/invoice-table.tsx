"use client";

import { ProcessedInvoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState, Fragment } from "react";

interface InvoiceTableProps {
  invoices: ProcessedInvoice[];
  onRemove: (id: string) => void;
}

export function InvoiceTable({ invoices, onRemove }: InvoiceTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay facturas procesadas todavía</p>
        <p className="text-sm mt-1">Sube algunas facturas para empezar</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Archivo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>NIF/CIF</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Confianza</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <Fragment key={invoice.id}>
              <TableRow>
                <TableCell>
                  {invoice.success && invoice.data && invoice.data.items.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleRow(invoice.id)}
                    >
                      {expandedRows.has(invoice.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </TableCell>
                <TableCell className="font-medium max-w-[150px] truncate">
                  {invoice.fileName}
                </TableCell>
                <TableCell>
                  {invoice.success && invoice.data
                    ? formatDate(invoice.data.date)
                    : "-"}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {invoice.success && invoice.data
                    ? invoice.data.vendor.name
                    : "-"}
                </TableCell>
                <TableCell>
                  {invoice.success && invoice.data
                    ? invoice.data.vendor.nif || "-"
                    : "-"}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {invoice.success && invoice.data
                    ? formatCurrency(invoice.data.total, invoice.data.currency)
                    : "-"}
                </TableCell>
                <TableCell>
                  {invoice.success && invoice.data ? (
                    <Badge
                      variant={
                        invoice.data.confidence >= 80
                          ? "success"
                          : invoice.data.confidence >= 60
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {invoice.data.confidence}%
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Error</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onRemove(invoice.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>

              {expandedRows.has(invoice.id) && invoice.success && invoice.data && (
                <TableRow>
                  <TableCell colSpan={8} className="bg-muted/50 p-4">
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Líneas de detalle:</p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="text-right">Cantidad</TableHead>
                            <TableHead className="text-right">Precio Unit.</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoice.data.items.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{item.description}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.unitPrice, invoice.data!.currency)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.total, invoice.data!.currency)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex justify-end gap-8 text-sm pt-2 border-t">
                        <div>
                          <span className="text-muted-foreground">Subtotal: </span>
                          <span className="font-medium">
                            {formatCurrency(invoice.data.subtotal, invoice.data.currency)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            IVA {invoice.data.taxRate ? `(${invoice.data.taxRate}%)` : ""}:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(invoice.data.tax, invoice.data.currency)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total: </span>
                          <span className="font-bold">
                            {formatCurrency(invoice.data.total, invoice.data.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
