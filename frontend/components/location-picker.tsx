"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"
import type { Ubicacion } from "@/lib/types"

interface LocationPickerProps {
  onLocationSelect: (ubicacion: Ubicacion) => void
  initialLocation?: Ubicacion
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) 
{
  const [direccion, setDireccion] = useState(initialLocation?.direccion || "")
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const handleGetCurrentLocation = () => 
  {
    setIsGettingLocation(true)

    if ("geolocation" in navigator) 
      {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const ubicacion: Ubicacion = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            direccion: direccion || "Ubicación actual",
          }
          onLocationSelect(ubicacion)
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("[v0] Error al obtener la ubicación:", error)
          // Usar ubicación por defecto si falla
          const ubicacion: Ubicacion = {
            lat: 19.4326,
            lng: -99.1332,
            direccion: direccion || "Ciudad de México",
          }
          onLocationSelect(ubicacion)
          setIsGettingLocation(false)
        },
      )
    }
    

  else 
    {
      // Geolocalización no disponible, usar ubicación por defecto
      const ubicacion: Ubicacion = {
        lat: 19.4326,
        lng: -99.1332,
        direccion: direccion || "Ciudad de México",
      }
      onLocationSelect(ubicacion)
      setIsGettingLocation(false)
    }
   
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            placeholder="Ej: Calle Principal #123, Col. Centro"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
        >
          <Navigation className="h-4 w-4 mr-2" />
          {isGettingLocation ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
        </Button>

        <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Vista previa del mapa</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
