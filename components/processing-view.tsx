"use client";

import { Eye, FileSearch, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingViewProps {
  currentStep: number;
}

const steps = [
  { icon: Eye, title: "Detectando texto", subtitle: "OCR en progreso..." },
  { icon: FileSearch, title: "Extrayendo datos", subtitle: "Identificando campos..." },
  { icon: ShieldCheck, title: "Validando", subtitle: "Verificando información..." },
];

export function ProcessingView({ currentStep }: ProcessingViewProps) {
  return (
    <div className="space-y-8">
      {/* Animated document preview */}
      <div className="relative mx-auto w-64 aspect-[3/4] bg-card rounded-xl border shadow-lg overflow-hidden animate-pulse-glow">
        {/* Document content placeholder */}
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted/60 rounded" />

          {/* Lines */}
          <div className="mt-6 space-y-2">
            <div className="h-2 w-full bg-muted/40 rounded" />
            <div className="h-2 w-4/5 bg-muted/40 rounded" />
            <div className="h-2 w-full bg-muted/40 rounded" />
          </div>

          {/* Table */}
          <div className="mt-6 space-y-1.5">
            <div className="h-3 w-full bg-muted/50 rounded" />
            <div className="h-2 w-full bg-muted/30 rounded" />
            <div className="h-2 w-full bg-muted/30 rounded" />
            <div className="h-2 w-full bg-muted/30 rounded" />
          </div>

          {/* Total */}
          <div className="mt-6 flex justify-end">
            <div className="h-4 w-20 bg-primary/30 rounded" />
          </div>
        </div>

        {/* Scan line */}
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan shadow-[0_0_15px_rgba(var(--primary),0.5)]" />

        {/* Corner indicators */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary" />
      </div>

      {/* Processing steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              className={cn(
                "p-4 rounded-xl border transition-all duration-300",
                isActive
                  ? "bg-primary/5 border-primary"
                  : isCompleted
                  ? "bg-accent/5 border-accent/30"
                  : "opacity-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
