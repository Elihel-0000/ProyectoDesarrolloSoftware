"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { categoriasConfig } from "@/data/mock-data";
import { crearDenuncia } from "@/lib/denuncias-api";
import type { CategoriaDenuncia, Ubicacion } from "@/lib/types";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Navigation,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("@/components/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-muted animate-pulse rounded-md flex items-center justify-center">
      <p className="text-muted-foreground">Cargando mapa...</p>
    </div>
  ),
});

export default function NuevaDenunciaPage() {
  const { isAuthenticated, usuario } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "" as CategoriaDenuncia | "",
    direccion: "",
    ubicacion: null as Ubicacion | null,
    imagen: null as File | null,
  });

  const handleChange = (
    field: string,
    value: string | File | null | Ubicacion
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange("imagen", file);
    }
  };

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const ubicacion: Ubicacion = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            direccion: formData.direccion || "Ubicación actual",
          };
          handleChange("ubicacion", ubicacion);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("[v0] Error getting location:", error);
          const ubicacion: Ubicacion = {
            lat: 19.4326,
            lng: -99.1332,
            direccion: formData.direccion || "Ciudad de México",
          };
          handleChange("ubicacion", ubicacion);
          setIsGettingLocation(false);
        }
      );
    } else {
      const ubicacion: Ubicacion = {
        lat: 19.4326,
        lng: -99.1332,
        direccion: formData.direccion || "Ciudad de México",
      };
      handleChange("ubicacion", ubicacion);
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      setError("Debes iniciar sesión para crear una denuncia");
      return;
    }

    if (!formData.categoria) {
      setError("Por favor selecciona una categoría");
      return;
    }

    if (!formData.imagen) {
      setError("Por favor sube una imagen del problema");
      return;
    }

    setIsLoading(true);
    try {
      await crearDenuncia({
        title: formData.titulo,
        description: formData.descripcion,
        category: formData.categoria,
        image: formData.imagen!,
        lat: formData.ubicacion?.lat,
        lng: formData.ubicacion?.lng,
        address: formData.ubicacion?.direccion ?? formData.direccion,
      });
      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/mis-denuncias");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al enviar la denuncia");
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold">
                Inicia sesión para continuar
              </h2>
              <p className="text-muted-foreground">
                Necesitas una cuenta para crear denuncias
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <a href="/login">Iniciar Sesión</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/registro">Registrarse</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Denuncia Enviada</h2>
              <p className="text-muted-foreground">
                Tu reporte ha sido registrado exitosamente.
              </p>
              <p className="text-sm text-muted-foreground">
                Las autoridades lo revisarán pronto.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Nueva Denuncia
          </h1>
          <p className="text-muted-foreground text-lg">
            Reporta un problema urbano en tu comunidad
          </p>
        </div>

        <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-slate-300">Información del Problema</CardTitle>
            <CardDescription className="text-gray-600 dark:text-slate-400">
              Completa todos los campos para ayudarnos a resolver el problema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="titulo" className="dark:text-slate-300">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Ej: Bache profundo en Av. Principal"
                  value={formData.titulo}
                  onChange={(e) => handleChange("titulo", e.target.value)}
                  required
                  disabled={isLoading}
                  className="!bg-gray-50 dark:!bg-slate-800 !border-gray-200 dark:!border-slate-600 focus:!border-primary transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria" className="dark:text-slate-300">Categoría</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => handleChange("categoria", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="categoria" className="!bg-gray-50 dark:!bg-slate-800 !border-gray-200 dark:!border-slate-600 focus:!border-primary transition-all shadow-sm">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoriasConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.icon} {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="dark:text-slate-300">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe el problema con el mayor detalle posible..."
                  value={formData.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  required
                  disabled={isLoading}
                  rows={5}
                  className="resize-none !bg-gray-50 dark:!bg-slate-800 !border-gray-200 dark:!border-slate-600 focus:!border-primary transition-all shadow-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Incluye detalles como tamaño, tiempo que lleva el problema,
                  etc.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion" className="dark:text-slate-300">Ubicación</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="direccion"
                    placeholder="Ej: Calle Principal #123, Col. Centro"
                    value={formData.direccion}
                    onChange={(e) => handleChange("direccion", e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 !bg-gray-50 dark:!bg-slate-800 !border-gray-200 dark:!border-slate-600 focus:!border-primary transition-all shadow-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetCurrentLocation}
                  disabled={isGettingLocation || isLoading}
                  className="w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {isGettingLocation
                    ? "Obteniendo ubicación..."
                    : "Usar mi ubicación actual"}
                </Button>

                <div className="mt-4">
                  <LocationMap
                    lat={formData.ubicacion?.lat || 19.4326}
                    lng={formData.ubicacion?.lng || -99.1332}
                    onLocationSelect={(lat, lng) => {
                      handleChange("ubicacion", {
                        ...formData.ubicacion,
                        lat,
                        lng,
                        direccion: formData.direccion // Keep existing address or fetch newer one if we had reverse geocoding
                      } as Ubicacion);
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Arrastra el marcador para precisar la ubicación.
                    Coordenadas: {formData.ubicacion?.lat.toFixed(6) || "19.432600"}, {formData.ubicacion?.lng.toFixed(6) || "-99.133200"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagen" className="dark:text-slate-300">Fotografía</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-primary hover:bg-gray-50 dark:hover:bg-slate-800 bg-gray-50/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all shadow-sm">
                  <input
                    id="imagen"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                  <label htmlFor="imagen" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {formData.imagen
                        ? formData.imagen.name
                        : "Haz clic para subir una imagen"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG hasta 10MB
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar Denuncia"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
