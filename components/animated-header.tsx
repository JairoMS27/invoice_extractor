"use client";

import { Scan, FileText, Zap, Brain } from "lucide-react";

export function AnimatedHeader() {
  return (
    <div className="relative overflow-hidden py-16 md:py-24">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Floating orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 blur-3xl animate-morph" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 blur-3xl animate-morph" style={{ animationDelay: "4s" }} />

      {/* Decorative particles - desktop only */}
      <div className="hidden md:block absolute top-20 left-20 w-3 h-3 bg-primary/40 rounded-full animate-float" />
      <div className="hidden md:block absolute top-40 right-32 w-2 h-2 bg-accent/40 rounded-sm animate-float-delayed" />
      <div className="hidden md:block absolute bottom-32 left-40 w-4 h-4 bg-primary/30 rounded-full animate-float" style={{ animationDelay: "1s" }} />
      <div className="hidden md:block absolute bottom-20 right-20 w-3 h-3 bg-accent/30 rounded-sm animate-float-delayed" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Icon with orbiting elements */}
        <div className="relative w-32 h-32 mb-8">
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring-delayed" />
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring-delayed-2" />

          {/* Central icon */}
          <div className="absolute inset-0 flex items-center justify-center animate-float">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Scan className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Orbiting elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-orbit">
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-accent" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-orbit-reverse">
              <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="animate-shimmer">Invoice</span>
          </h1>
        </div>
        <div className="animate-fade-in-up-delayed">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="animate-shimmer" style={{ animationDelay: "0.5s" }}>Extractor</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="mt-6 text-lg text-muted-foreground max-w-md animate-fade-in-up-delayed-2">
          Extrae datos de tus facturas automáticamente con inteligencia artificial
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up-delayed-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20 hover:border-primary/40 transition-colors">
            <Brain className="w-4 h-4 text-primary transition-transform hover:scale-110" />
            <span className="text-sm font-medium">IA Avanzada</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 rounded-full border border-accent/20 hover:border-accent/40 transition-colors">
            <Zap className="w-4 h-4 text-accent transition-transform hover:scale-110" />
            <span className="text-sm font-medium">Ultra Rápido</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20 hover:border-primary/40 transition-colors">
            <FileText className="w-4 h-4 text-primary transition-transform hover:scale-110" />
            <span className="text-sm font-medium">Multi-formato</span>
          </div>
        </div>
      </div>
    </div>
  );
}
