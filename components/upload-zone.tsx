"use client";

import { useCallback, useState } from "react";
import { Upload, FileImage, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
  processingCount: number;
}

export function UploadZone({ onFilesSelected, isProcessing, processingCount }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") || file.type === "application/pdf"
    );

    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
    e.target.value = "";
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleProcess = useCallback(() => {
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles);
      setSelectedFiles([]);
    }
  }, [selectedFiles, onFilesSelected]);

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          isProcessing && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center justify-center text-center">
          {isProcessing ? (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-lg font-medium">
                Procesando {processingCount} {processingCount === 1 ? "archivo" : "archivos"}...
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Extrayendo datos con IA
              </p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">
                Arrastra tus facturas aquí
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                o haz clic para seleccionar archivos
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Soporta imágenes (JPG, PNG, WEBP) y PDF
              </p>
            </>
          )}
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {selectedFiles.length} {selectedFiles.length === 1 ? "archivo seleccionado" : "archivos seleccionados"}
            </p>
            <Button
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Procesar facturas"
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative group bg-muted rounded-lg p-3 flex items-center gap-2"
              >
                <FileImage className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate flex-1">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
