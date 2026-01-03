"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatedHeader } from "@/components/animated-header";
import { DropZone } from "@/components/drop-zone";
import { UploadingState } from "@/components/uploading-state";
import { ProcessingView } from "@/components/processing-view";
import { ResultsPanel } from "@/components/results-panel";
import { ExportModal } from "@/components/export-modal";
import { Footer } from "@/components/footer";
import { InvoiceData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2 } from "lucide-react";

type AppState = "idle" | "uploading" | "uploaded" | "processing" | "completed";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setState("uploading");

    // Simulate upload delay
    setTimeout(() => {
      setState("uploaded");
    }, 1500);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!selectedFile) return;

    setState("processing");
    setProcessingStep(0);

    // Animate through steps
    const stepInterval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev >= 2) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      clearInterval(stepInterval);

      if (result.success && result.data) {
        setInvoiceData(result.data);
        setState("completed");
      } else {
        console.error("Extraction failed:", result.error);
        alert(`Error: ${result.error}`);
        setState("uploaded");
      }
    } catch (error) {
      clearInterval(stepInterval);
      console.error("Error:", error);
      alert("Error al procesar el documento");
      setState("uploaded");
    }
  }, [selectedFile]);

  const handleReset = useCallback(() => {
    setState("idle");
    setSelectedFile(null);
    setInvoiceData(null);
    setProcessingStep(0);
  }, []);

  // Auto-process when uploaded
  useEffect(() => {
    if (state === "uploaded" && selectedFile) {
      // Small delay to show the uploaded state
      const timer = setTimeout(() => {
        handleProcess();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state, selectedFile, handleProcess]);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <AnimatedHeader />

        {/* Main content */}
        <div className="pb-8">
          {state === "idle" && (
            <DropZone onFileSelect={handleFileSelect} />
          )}

          {state === "uploading" && selectedFile && (
            <UploadingState fileName={selectedFile.name} />
          )}

          {state === "uploaded" && selectedFile && (
            <div className="bg-card border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <Button
                onClick={handleProcess}
                className="w-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Procesar Documento
              </Button>
            </div>
          )}

          {state === "processing" && (
            <ProcessingView currentStep={processingStep} />
          )}

          {state === "completed" && invoiceData && (
            <ResultsPanel
              data={invoiceData}
              onReset={handleReset}
              onExport={() => setIsExportModalOpen(true)}
            />
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Export Modal */}
      {invoiceData && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          data={invoiceData}
        />
      )}
    </main>
  );
}
