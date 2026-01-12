"use client";

import { useState, useEffect } from "react";
import { DenunciaCard } from "@/components/denuncia-card";
import { DenunciasMapView } from "@/components/denuncias-map-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoriasConfig, estadosConfig } from "@/data/mock-data";
import { getDenuncias } from "@/lib/api";
import { Search, Filter, Grid3x3, Map } from "lucide-react";

export default function DenunciasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("todas");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [denuncias, setDenuncias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getDenuncias()
      .then((data) => {
        setDenuncias(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar las denuncias");
        setLoading(false);
      });
  }, []);

  const filteredDenuncias = denuncias.filter((denuncia) => {
    const titulo = denuncia?.titulo ?? "";
    const descripcion = denuncia?.descripcion ?? "";
    const direccion = denuncia?.ubicacion?.direccion ?? "";

    const matchesSearch =
      titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      direccion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategoria =
      categoriaFilter === "todas" || denuncia.categoria === categoriaFilter;
    const matchesEstado =
      estadoFilter === "todos" || denuncia.estado === estadoFilter;

    return matchesSearch && matchesCategoria && matchesEstado;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Cargando denuncias...
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        {error}
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Denuncias Urbanas
          </h1>
          <p className="text-muted-foreground text-lg">
            Explora los reportes de problemas urbanos en tu comunidad
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, descripción o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 !bg-white !border-white shadow-md focus:!bg-white focus:!border-primary transition-all"
            />
          </div>

          <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
            <SelectTrigger className="w-full md:w-[200px] !bg-white !border-white shadow-md focus:!bg-white focus:!border-primary transition-all">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las categorías</SelectItem>
              {Object.entries(categoriasConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={estadoFilter} onValueChange={setEstadoFilter}>
            <SelectTrigger className="w-full md:w-[200px] !bg-white !border-white shadow-md focus:!bg-white focus:!border-primary transition-all">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              {Object.entries(estadosConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle and Results */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredDenuncias.length} de {denuncias.length} denuncias
          </p>
          <div className="flex items-center gap-2">
            {(searchTerm ||
              categoriaFilter !== "todas" ||
              estadoFilter !== "todos") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoriaFilter("todas");
                    setEstadoFilter("todos");
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="rounded-l-none"
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "map" ? (
        <DenunciasMapView denuncias={filteredDenuncias} />
      ) : filteredDenuncias.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDenuncias.map((denuncia) => (
            <DenunciaCard key={denuncia.id} denuncia={denuncia} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No se encontraron denuncias con los filtros aplicados
          </p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => {
              setSearchTerm("");
              setCategoriaFilter("todas");
              setEstadoFilter("todos");
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
