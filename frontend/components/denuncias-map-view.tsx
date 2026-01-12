"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Denuncia } from "@/lib/types"
import { categoriasConfig, estadosConfig } from "@/data/mock-data"
import { MapPin, ExternalLink } from "lucide-react"
import Link from "next/link"

interface DenunciasMapViewProps {
  denuncias: Denuncia[]
}

export function DenunciasMapView({ denuncias }: DenunciasMapViewProps) {
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null)

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Área del mapa */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Mapa de Denuncias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
              {/* Mapa simulado con marcadores */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-3 p-6">
                  <MapPin className="h-12 w-12 mx-auto text-primary" />
                  <div className="space-y-1">
                    <p className="font-medium">{denuncias.length} denuncias en el mapa</p>
                    <p className="text-sm text-muted-foreground">
                      Haz clic en una denuncia de la lista para ver su ubicación
                    </p>
                  </div>
                </div>
              </div>

              {/* Fondo con patrón de cuadrícula */}
              <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#map-grid)" />
              </svg>

              {/* Marcadores simulados */}
              <div className="absolute inset-0 pointer-events-none">
                {denuncias.slice(0, 8).map((denuncia, index) => {
                  const categoriaInfo = categoriasConfig[denuncia.categoria]
                  const left = 20 + (index % 4) * 20
                  const top = 20 + Math.floor(index / 4) * 40

                  return (
                    <div
                      key={denuncia.id}
                      className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                      style={{ left: `${left}%`, top: `${top}%` }}
                      onClick={() => setSelectedDenuncia(denuncia)}
                    >
                      <div
                        className={`h-8 w-8 rounded-full ${categoriaInfo.color} flex items-center justify-center shadow-lg border-2 border-white`}
                      >
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {selectedDenuncia && (
              <div className="mt-4 p-4 border rounded-lg bg-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${categoriasConfig[selectedDenuncia.categoria].color} text-white border-0`}
                      >
                        {categoriasConfig[selectedDenuncia.categoria].label}
                      </Badge>
                      <Badge className={estadosConfig[selectedDenuncia.estado].color}>
                        {estadosConfig[selectedDenuncia.estado].label}
                      </Badge>
                    </div>
                    <h4 className="font-semibold">{selectedDenuncia.titulo}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{selectedDenuncia.descripcion}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{selectedDenuncia.ubicacion.direccion}</span>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/denuncias/${selectedDenuncia.id}`}>
                      Ver Detalle
                      <ExternalLink className="h-3.5 w-3.5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Área de lista */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Denuncias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {denuncias.slice(0, 10).map((denuncia) => {
                const categoriaInfo = categoriasConfig[denuncia.categoria]
                const isSelected = selectedDenuncia?.id === denuncia.id

                return (
                  <button
                    key={denuncia.id}
                    onClick={() => setSelectedDenuncia(denuncia)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${categoriaInfo.color}`} />
                        <span className="text-sm font-medium line-clamp-1">{denuncia.titulo}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{denuncia.ubicacion.direccion}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
