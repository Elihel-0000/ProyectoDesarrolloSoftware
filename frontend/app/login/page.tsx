"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";
import { MapPin, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        if (user.rol === "autoridad" || user.rol === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } else {
        setError("Credenciales incorrectas o no válidas.");
      }
    } catch (err) {
      setError("Error de red o del servidor.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
          <p className="text-muted-foreground">
            Accede a tu cuenta de Denuncias Urbanas
          </p>
        </div>

        <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
          <CardHeader>
            <CardTitle>Bienvenido de nuevo</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="!bg-white !border-white shadow-md focus:!bg-white focus:!border-primary transition-all aria-invalid:!border-white aria-invalid:!ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="!bg-white !border-white shadow-md focus:!bg-white focus:!border-primary transition-all aria-invalid:!border-white aria-invalid:!ring-0"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Cuentas de prueba
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="font-medium">Ciudadano:</p>
                  <p className="text-muted-foreground">juan@email.com</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="font-medium">Autoridad:</p>
                  <p className="text-muted-foreground">carlos@gobierno.gob</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">¿No tienes una cuenta? </span>
          <Link
            href="/registro"
            className="text-primary hover:underline font-medium"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
