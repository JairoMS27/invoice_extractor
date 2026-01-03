"use client";

import { FileText, Loader2 } from "lucide-react";

interface UploadingStateProps {
  fileName: string;
}

export function UploadingState({ fileName }: UploadingStateProps) {
  return (
    <div className="bg-card border rounded-xl p-8">
      <div className="flex flex-col items-center text-center">
        {/* Icon with ping animation */}
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-ping" />
          <div className="relative w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
            <FileText className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">Subiendo archivo...</h3>
        <p className="text-muted-foreground mb-6">{fileName}</p>

        {/* Progress bar */}
        <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden mb-4">
          <div className="h-full w-3/4 bg-primary rounded-full animate-pulse" />
        </div>

        {/* Loading indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Procesando subida...</span>
        </div>
      </div>
    </div>
  );
}
