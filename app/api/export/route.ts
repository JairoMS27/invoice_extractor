import { NextRequest, NextResponse } from "next/server";
import { InvoiceDataSchema, ExportFormat } from "@/lib/types";
import { exportToExcel } from "@/lib/exporters/excel-exporter";
import { exportToCSV } from "@/lib/exporters/csv-exporter";
import { exportToJSON } from "@/lib/exporters/json-exporter";
import { exportToPDF } from "@/lib/exporters/pdf-exporter";
import { z } from "zod";

const ExportRequestSchema = z.object({
  invoices: z.array(InvoiceDataSchema),
  format: z.enum(["xlsx", "csv", "json", "pdf"]),
  fileName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoices, format, fileName } = ExportRequestSchema.parse(body);

    if (invoices.length === 0) {
      return NextResponse.json(
        { error: "No hay facturas para exportar" },
        { status: 400 }
      );
    }

    const baseFileName = fileName || `facturas_${new Date().toISOString().split("T")[0]}`;
    let data: Uint8Array | string;
    let contentType: string;
    let extension: string;

    switch (format as ExportFormat) {
      case "xlsx": {
        const buffer = exportToExcel(invoices, baseFileName);
        data = new Uint8Array(buffer);
        contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        extension = "xlsx";
        break;
      }

      case "csv":
        data = exportToCSV(invoices, baseFileName);
        contentType = "text/csv; charset=utf-8";
        extension = "csv";
        break;

      case "json":
        data = exportToJSON(invoices);
        contentType = "application/json";
        extension = "json";
        break;

      case "pdf": {
        const buffer = exportToPDF(invoices, baseFileName);
        data = new Uint8Array(buffer);
        contentType = "application/pdf";
        extension = "pdf";
        break;
      }

      default:
        return NextResponse.json(
          { error: "Formato no soportado" },
          { status: 400 }
        );
    }

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set(
      "Content-Disposition",
      `attachment; filename="${baseFileName}.${extension}"`
    );

    return new Response(data as BodyInit, { headers });
  } catch (error) {
    console.error("Error exporting:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al exportar" },
      { status: 500 }
    );
  }
}
