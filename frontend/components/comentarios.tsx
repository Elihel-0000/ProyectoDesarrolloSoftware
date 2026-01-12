"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { createComentario, getComentarios } from "@/lib/comentarios-api";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Comentario } from "@/lib/types";

interface ComentariosProps {
  denunciaId: string | number;
}

export function Comentarios({ denunciaId }: ComentariosProps) {
  const { usuario, isAuthenticated } = useAuth();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingComentarios, setLoadingComentarios] = useState(true);

  useEffect(() => {
    loadComentarios();
  }, [denunciaId]);

  const loadComentarios = async () => {
    try {
      setLoadingComentarios(true);
      const data = await getComentarios(denunciaId);
      setComentarios(data);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    } finally {
      setLoadingComentarios(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nuevoComentario.trim()) {
      toast.error("Escribe un comentario");
      return;
    }

    try {
      setLoading(true);
      await createComentario(denunciaId, nuevoComentario);
      setNuevoComentario("");
      toast.success("Comentario agregado");
      await loadComentarios();
    } catch (error) {
      toast.error("Error al agregar comentario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          Comentarios ({comentarios.length})
        </h3>
      </div>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            placeholder="Escribe un comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            rows={3}
            disabled={loading}
          />
          <Button type="submit" disabled={loading} size="sm">
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Enviando..." : "Comentar"}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {loadingComentarios ? (
          <p className="text-muted-foreground text-sm">Cargando comentarios...</p>
        ) : comentarios.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </p>
        ) : (
          comentarios.map((comentario) => (
            <Card key={comentario.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comentario.usuario.avatar} />
                    <AvatarFallback>
                      {comentario.usuario.nombre.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comentario.usuario.nombre}
                      </span>
                      {(comentario.usuario.rol === "admin" || 
                        comentario.usuario.rol === "authority" ||
                        comentario.usuario.rol === "autoridad") && (
                        <Badge variant="secondary" className="text-xs">
                          {comentario.usuario.rol === "admin" ? "Admin" : "Autoridad"}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comentario.creadoEn), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {comentario.contenido}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
