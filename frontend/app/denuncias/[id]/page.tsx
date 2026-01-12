import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { categoriasConfig, estadosConfig } from "@/data/mock-data";
import { getDenunciaPorId, API_URL } from "@/lib/api";
import type { Denuncia } from "@/lib/types";
import { DenunciaControls } from "@/components/denuncia-controls";
import { Comentarios } from "@/components/comentarios";
import { VotosButton } from "@/components/votos-button";

import { MapPin, Calendar, User, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DenunciaMapWrapper from "@/components/DenunciaMapWrapper";

interface DenunciaDetallePageProps {
  params: { id: string };
}


export default async function DenunciaDetallePage({
  params,
}: DenunciaDetallePageProps) {
  const { id } = await params;
  let denuncia: Denuncia | null = null;
  try {
    denuncia = await getDenunciaPorId(id);
  } catch {
    notFound();
  }
  if (!denuncia) {
    notFound();
  }

  // Next.js 15: params puede ser una promesa
  const categoriaInfo = categoriasConfig[denuncia.categoria] || {
    label: denuncia.categoria,
    color: "bg-gray-400",
    icon: "❓",
  };
  const estadoInfo = estadosConfig[denuncia.estado] || {
    label: denuncia.estado,
    color: "bg-gray-200 text-gray-800 border-gray-300",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild>
          <Link href="/denuncias">
            <span className="inline-flex items-center">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver a denuncias
            </span>
          </Link>
        </Button>
        <DenunciaControls denunciaId={denuncia.id} currentStatus={denuncia.estado} />
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-[400px] w-full rounded-lg overflow-hidden bg-muted">
            <Image
              src={
                denuncia.imagen
                  ? denuncia.imagen.startsWith("http")
                    ? denuncia.imagen
                    : `${API_URL}${denuncia.imagen.startsWith("/") ? "" : "/"
                    }${denuncia.imagen}`
                  : "/placeholder.svg"
              }
              alt={denuncia.titulo}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={`${categoriaInfo.color} text-white border-0`}
              >
                {categoriaInfo.label}
              </Badge>
              <Badge className={estadoInfo.color}>{estadoInfo.label}</Badge>
              <VotosButton denunciaId={denuncia.id} />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-balance">
              {denuncia.titulo}
            </h1>
          </div>

          <Separator />

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Descripción</h2>
            <p className="text-muted-foreground leading-relaxed">
              {denuncia.descripcion}
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Historial</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div className="w-px h-full bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium">Denuncia creada</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(denuncia.fecha).toLocaleString("sv-SE", {
                      timeZone: "UTC",
                    })}
                  </p>
                </div>
              </div>

              {denuncia.estado === "en-revision" && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <div className="w-px h-full bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="font-medium">En revisión</p>
                    <p className="text-sm text-muted-foreground">
                      Las autoridades están evaluando el caso
                    </p>
                    {denuncia.estadoActualizadoEn && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(denuncia.estadoActualizadoEn), "PPP p", { locale: es })}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {denuncia.estado === "resuelta" && (
                <>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <div className="w-px h-full bg-border" />
                    </div>
                    <div className="pb-4">
                      <p className="font-medium">En revisión</p>
                      <p className="text-sm text-muted-foreground">
                        Caso evaluado por las autoridades
                      </p>
                      {denuncia.estadoActualizadoEn && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(denuncia.estadoActualizadoEn), "PPP p", { locale: es })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Resuelta</p>
                      <p className="text-sm text-muted-foreground">
                        El problema ha sido solucionado
                      </p>
                      {denuncia.estadoActualizadoEn && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(denuncia.estadoActualizadoEn), "PPP p", { locale: es })}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Información</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">Ubicación</p>
                      <p className="text-muted-foreground">
                        {denuncia.ubicacion.direccion}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">Fecha de reporte</p>
                      <p className="text-muted-foreground">
                        {new Date(denuncia.fecha).toLocaleDateString("sv-SE", {
                          timeZone: "UTC",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">Reportado por</p>
                      <p className="text-muted-foreground">
                        {denuncia.ciudadanoNombre}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Coordenadas</h3>
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">
                    Lat:{" "}
                    {typeof denuncia.ubicacion.lat === "number" &&
                      !isNaN(denuncia.ubicacion.lat)
                      ? denuncia.ubicacion.lat.toFixed(6)
                      : "N/A"}
                  </p>
                  <p className="text-muted-foreground">
                    Lng:{" "}
                    {typeof denuncia.ubicacion.lng === "number" &&
                      !isNaN(denuncia.ubicacion.lng)
                      ? denuncia.ubicacion.lng.toFixed(6)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="h-[300px] w-full rounded-md overflow-hidden">
            {denuncia.ubicacion &&
              typeof denuncia.ubicacion.lat === 'number' &&
              typeof denuncia.ubicacion.lng === 'number' ? (
              <DenunciaMapWrapper
                lat={denuncia.ubicacion.lat}
                lng={denuncia.ubicacion.lng}
                readonly={true}
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Sin ubicación registrada</p>
              </div>
            )}
          </div>

          {/* Sección de Comentarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comentarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Comentarios denunciaId={denuncia.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  );
}
