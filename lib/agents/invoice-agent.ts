import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { InvoiceData, InvoiceDataSchema } from "@/lib/types";
import { INVOICE_EXTRACTION_PROMPT } from "@/lib/prompts/extraction-prompt";

export class InvoiceExtractionAgent {
  private model: ChatGoogleGenerativeAI;

  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set");
    }

    this.model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GOOGLE_API_KEY,
      maxOutputTokens: 8192,
      temperature: 0.1,
    });
  }

  async extractFromImage(
    imageBase64: string,
    mimeType: string,
  ): Promise<InvoiceData> {
    const message = new HumanMessage({
      content: [
        {
          type: "text",
          text: INVOICE_EXTRACTION_PROMPT,
        },
        {
          type: "image_url",
          image_url: {
            url: imageBase64.startsWith("data:")
              ? imageBase64
              : `data:${mimeType};base64,${imageBase64}`,
          },
        },
      ],
    });

    const response = await this.model.invoke([message]);

    const content =
      typeof response.content === "string"
        ? response.content
        : response.content.map((c) => ("text" in c ? c.text : "")).join("");

    console.log("Gemini response:", content);

    // Intentar extraer JSON de diferentes formatos
    // 1. JSON en bloque de código markdown
    let jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    let jsonStr = jsonMatch ? jsonMatch[1].trim() : null;

    // 2. JSON directo (objeto)
    if (!jsonStr) {
      jsonMatch = content.match(/(\{[\s\S]*\})/);
      jsonStr = jsonMatch ? jsonMatch[1] : null;
    }

    if (!jsonStr) {
      throw new Error(`No se pudo extraer JSON de la respuesta: ${content.substring(0, 200)}`);
    }

    const parsed = JSON.parse(jsonStr);
    const validated = InvoiceDataSchema.parse(parsed);

    return validated;
  }
}

let agentInstance: InvoiceExtractionAgent | null = null;

export function getInvoiceAgent(): InvoiceExtractionAgent {
  if (!agentInstance) {
    agentInstance = new InvoiceExtractionAgent();
  }
  return agentInstance;
}
