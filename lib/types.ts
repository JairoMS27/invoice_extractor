import { z } from "zod";

// Schema de validación con Zod
export const VendorSchema = z.object({
  name: z.string(),
  nif: z.string().nullable(),
  address: z.string().nullable(),
});

export const InvoiceItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  total: z.number(),
});

export const InvoiceDataSchema = z.object({
  // Datos generales
  invoiceNumber: z.string().nullable(),
  date: z.string(),
  vendor: VendorSchema,

  // Líneas de detalle
  items: z.array(InvoiceItemSchema),

  // Totales
  subtotal: z.number(),
  tax: z.number(),
  taxRate: z.number().nullable(),
  total: z.number(),

  // Metadata
  currency: z.string().default("EUR"),
  confidence: z.number().min(0).max(100),
});

// Tipos inferidos
export type Vendor = z.infer<typeof VendorSchema>;
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type InvoiceData = z.infer<typeof InvoiceDataSchema>;

// Tipo para la respuesta de extracción
export interface ExtractionResult {
  success: boolean;
  data?: InvoiceData;
  error?: string;
  fileName: string;
  id: string;
}

// Tipo para las facturas procesadas en el frontend
export interface ProcessedInvoice extends ExtractionResult {
  imagePreview?: string;
  processingTime?: number;
}

// Tipos de exportación
export type ExportFormat = "xlsx" | "csv" | "json" | "pdf";

export interface ExportRequest {
  invoices: InvoiceData[];
  format: ExportFormat;
  fileName?: string;
}
