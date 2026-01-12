"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, FileText, MessageCircle, ThumbsUp, Lock } from "lucide-react";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/lib/comentarios-api";

export default function PerfilPage() {
  const { usuario: authUsuario, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [nombre, setNombre] = useState("");
  const [avatar, setAvatar] = useState("");
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [contrasenaConfirmar, setContrasenaConfirmar] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadProfile();
  }, [isAuthenticated, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      setNombre(data.nombre || "");
      setAvatar(data.avatar || "");
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      toast.error("Error al cargar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validaciones
      if (!nombre.trim()) {
        toast.error("El nombre no puede estar vacío");
        setSaving(false);
        return;
      }

      if (contrasenaNueva && contrasenaNueva !== contrasenaConfirmar) {
        toast.error("Las contraseñas no coinciden");
        setSaving(false);
        return;
      }

      if (contrasenaNueva && !contrasenaActual) {
        toast.error("Ingresa tu contraseña actual para cambiarla");
        setSaving(false);
        return;
      }

      // Preparar datos para actualizar
      const updateData: any = {};

      if (nombre !== profile.nombre) {
        updateData.nombre = nombre;
      }

      if (avatar !== (profile.avatar || "")) {
        updateData.avatar = avatar;
      }

      if (contrasenaNueva) {
        updateData.contrasena = contrasenaNueva;
        updateData.contrasenaActual = contrasenaActual;
      }

      // Verificar si hay cambios
      if (Object.keys(updateData).length === 0) {
        toast.info("No hay cambios para guardar");
        setEditing(false);
        setSaving(false);
        return;
      }

      // Actualizar perfil
      await updateProfile(updateData);
      
      toast.success("Perfil actualizado correctamente");
      
      // Limpiar campos de contraseña
      setContrasenaActual("");
      setContrasenaNueva("");
      setContrasenaConfirmar("");
      
      // Recargar perfil
      await loadProfile();
      
      setEditing(false);
    } catch (error: any) {
      console.error('Error al actualizar:', error);
      toast.error(error.message || "Error al actualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setNombre(profile?.nombre || "");
    setAvatar(profile?.avatar || "");
    setContrasenaActual("");
    setContrasenaNueva("");
    setContrasenaConfirmar("");
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Error al cargar perfil</p>
      </div>
    );
  }

  const rolLabel = profile.rol === "admin" ? "Administrador" : 
                   profile.rol === "authority" || profile.rol === "autoridad" ? "Autoridad" : 
                   "Ciudadano";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Columna Izquierda - Info del Usuario */}
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-2xl">
                  {profile.nombre?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-xl font-bold">{profile.nombre}</h2>
                <p className="text-sm text-muted-foreground">{profile.correo}</p>
              </div>

              <Badge variant={profile.rol === "admin" || profile.rol === "authority" || profile.rol === "autoridad" ? "default" : "secondary"}>
                {rolLabel}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Nombre:</span>
                <span className="break-all">{profile.nombre}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span className="break-all">{profile.correo}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Rol:</span>
                <span>{rolLabel}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Estadísticas</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Denuncias</span>
                  </div>
                  <span className="font-semibold">{profile._count?.denuncias || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span>Comentarios</span>
                  </div>
                  <span className="font-semibold">{profile._count?.comentarios || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    <span>Apoyos dados</span>
                  </div>
                  <span className="font-semibold">{profile._count?.votos || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Columna Derecha - Edición */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
            <CardDescription>
              Actualiza tu información personal y contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo *</Label>
                <Input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">URL del Avatar (opcional)</Label>
                <Input
                  id="avatar"
                  type="text"
                  placeholder="https://ejemplo.com/avatar.jpg"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <h3 className="font-semibold">Cambiar Contraseña (opcional)</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contrasenaActual">Contraseña actual</Label>
                  <Input
                    id="contrasenaActual"
                    type="password"
                    value={contrasenaActual}
                    onChange={(e) => setContrasenaActual(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contrasenaNueva">Nueva contraseña</Label>
                  <Input
                    id="contrasenaNueva"
                    type="password"
                    value={contrasenaNueva}
                    onChange={(e) => setContrasenaNueva(e.target.value)}
                    autoComplete="new-password"
                  />
                  {contrasenaNueva && contrasenaNueva.length < 6 && (
                    <p className="text-xs text-red-500">Mínimo 6 caracteres</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contrasenaConfirmar">Confirmar nueva contraseña</Label>
                  <Input
                    id="contrasenaConfirmar"
                    type="password"
                    value={contrasenaConfirmar}
                    onChange={(e) => setContrasenaConfirmar(e.target.value)}
                    autoComplete="new-password"
                  />
                  {contrasenaConfirmar && contrasenaNueva !== contrasenaConfirmar && (
                    <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Actualizar Perfil"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Restablecer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
