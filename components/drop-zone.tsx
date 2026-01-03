"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragActive(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      onFileSelect(file);
    }
  }, [disabled, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    e.target.value = "";
  }, [onFileSelect]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer",
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-muted-foreground/25 hover:border-primary/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={disabled}
      />

      <div className="flex flex-col items-center justify-center text-center">
        <div
          className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300",
            isDragActive
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-primary/10 text-primary"
          )}
        >
          {disabled ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : (
            <Upload className="w-10 h-10" />
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2">
          {isDragActive ? "¡Suelta tu archivo aquí!" : "Arrastra tu factura aquí"}
        </h3>

        {!isDragActive && (
          <>
            <p className="text-muted-foreground mb-6">
              o haz clic para seleccionar un archivo
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-600 rounded-lg">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">PDF</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-lg">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">PNG</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-lg">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">JPG</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
