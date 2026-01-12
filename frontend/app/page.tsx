"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  FileText,
  BarChart3,
  Shield,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDenuncias } from "@/lib/api";
import { DenunciaCard } from "@/components/denuncia-card";

export default function HomePage() {
  const [denuncias, setDenuncias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

  const stats = {
    total: denuncias.length,
    resueltas: denuncias.filter((d) => d.estado === "resuelta").length,
    tasaResolucion:
      denuncias.length > 0
        ? Math.round(
          (denuncias.filter((d) => d.estado === "resuelta").length /
            denuncias.length) *
          100
        )
        : 0,
  };

  const recentDenuncias = denuncias;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Tu voz para una ciudad mejor
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
              Reporta problemas urbanos, da seguimiento a tus denuncias y
              contribuye a construir una ciudad más sostenible y eficiente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/nueva-denuncia">
                  Reportar Problema
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/denuncias">Ver Denuncias</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cómo funciona
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Un proceso simple y transparente para mejorar tu comunidad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-white/40 bg-white/60 backdrop-blur-md shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">1. Reporta</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Identifica un problema urbano, toma una foto y comparte la
                  ubicación. Es rápido y sencillo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/40 bg-white/60 backdrop-blur-md shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">2. Seguimiento</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Las autoridades revisan tu reporte y actualizan el estado.
                  Recibe notificaciones del progreso.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/40 bg-white/60 backdrop-blur-md shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">3. Resolución</h3>
                <p className="text-muted-foreground leading-relaxed">
                  El problema se resuelve y puedes ver el impacto de tu
                  participación ciudadana.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">
                {stats.total}
              </div>
              <div className="text-sm text-muted-foreground">
                Denuncias Totales
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-green-600">
                {stats.resueltas}
              </div>
              <div className="text-sm text-muted-foreground">Resueltas</div>
            </div>
            <div className="text-center space-y-2 col-span-2 md:col-span-1">
              <div className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
                {stats.tasaResolucion}%
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-sm text-muted-foreground">
                Tasa de Resolución
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Denuncias Recientes
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conoce los últimos reportes de la comunidad
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">Cargando denuncias...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
              {recentDenuncias.map((denuncia) => (
                <DenunciaCard key={denuncia.id} denuncia={denuncia} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/denuncias">
                Ver Todas las Denuncias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ODS Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-white/40 bg-white/60 backdrop-blur-md shadow-sm">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      Alineados con los Objetivos de Desarrollo Sostenible
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Esta plataforma contribuye directamente al{" "}
                      <span className="font-semibold text-foreground">
                        ODS 11: Ciudades y Comunidades Sostenibles
                      </span>{" "}
                      y al{" "}
                      <span className="font-semibold text-foreground">
                        ODS 16: Paz, Justicia e Instituciones Sólidas
                      </span>
                      , promoviendo la participación ciudadana y la
                      transparencia gubernamental.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Comienza a hacer la diferencia hoy
            </h2>
            <p className="text-xl text-muted-foreground">
              Únete a miles de ciudadanos comprometidos con mejorar su comunidad
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/registro">
                  Crear Cuenta Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
