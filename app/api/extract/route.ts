import { NextRequest, NextResponse } from "next/server";
import { getInvoiceAgent } from "@/lib/agents/invoice-agent";
import { generateId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Tipo de archivo no soportado" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const agent = getInvoiceAgent();
    const startTime = Date.now();
    const data = await agent.extractFromImage(dataUrl, file.type);
    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data,
      fileName: file.name,
      id: generateId(),
      processingTime,
    });
  } catch (error) {
    console.error("Error extracting invoice:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        fileName: "unknown",
        id: generateId(),
      },
      { status: 500 }
    );
  }
}
