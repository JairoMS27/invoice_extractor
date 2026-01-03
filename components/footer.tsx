"use client";

import { Shield, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 pb-8">
      {/* Privacy notice */}
      <div className="bg-accent/5 border border-accent/10 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-accent mt-0.5" />
          <div>
            <p className="font-medium text-sm">100% Privado</p>
            <p className="text-sm text-muted-foreground">
              Tus documentos se procesan de forma segura y no almacenamos ningún dato.
              Tu información está protegida en todo momento.
            </p>
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          Hecho con <span className="text-red-500 animate-heartbeat">❤️</span> por
          <a
            href="https://x.com/ej3mplo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            @ej3mplo
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </a>
        </p>

        {/* Additional indicators */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Sin cookies</span>
          <span className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
          <span>Sin tracking</span>
          <span className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
          <span>Sin almacenamiento</span>
        </div>
      </div>
    </footer>
  );
}
