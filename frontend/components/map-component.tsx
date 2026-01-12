"use client";

import { useEffect, useRef } from "react";
import type { Ubicacion } from "@/lib/types";
import { MapPin } from "lucide-react";

interface MapComponentProps {
  ubicacion: Ubicacion;
  className?: string;
}

export function MapComponent({ ubicacion, className = "" }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // En un entorno de producción, aquí se inicializaría Leaflet o Google Maps
    // Por ahora, mostramos un mapa estático con enlace a Google Maps
    console.log("[v0] Mapa inicializado para la ubicación:", ubicacion);
  }, [ubicacion]);

  return (
    <div
      className={`relative bg-muted rounded-lg overflow-hidden ${className}`}
      ref={mapRef}
    >
      {/* Mapa estático simulado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-3 p-6">
          <MapPin className="h-12 w-12 mx-auto text-primary" />
          <div className="space-y-1">
            <p className="font-medium">{ubicacion.direccion}</p>
            <p className="text-sm text-muted-foreground">
              {typeof ubicacion.lat === "number" && !isNaN(ubicacion.lat)
                ? ubicacion.lat.toFixed(6)
                : "N/A"}
              ,{" "}
              {typeof ubicacion.lng === "number" && !isNaN(ubicacion.lng)
                ? ubicacion.lng.toFixed(6)
                : "N/A"}
            </p>
          </div>
          <a
            href={`https://www.google.com/maps?q=${ubicacion.lat},${ubicacion.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Ver en Google Maps
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Patrón de fondo para simular mapa */}
      <svg
        className="w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
