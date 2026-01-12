"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { toggleVoto, getVotosCount, hasUserVoted } from "@/lib/comentarios-api";

interface VotosButtonProps {
  denunciaId: string | number;
}

export function VotosButton({ denunciaId }: VotosButtonProps) {
  const { isAuthenticated } = useAuth();
  const [votosCount, setVotosCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVotos();
  }, [denunciaId]);

  const loadVotos = async () => {
    try {
      const count = await getVotosCount(denunciaId);
      setVotosCount(count);

      if (isAuthenticated) {
        const voted = await hasUserVoted(denunciaId);
        setHasVoted(voted.hasVoted);
      }
    } catch (error) {
      console.error("Error al cargar votos:", error);
    }
  };

  const handleVote = async () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para votar");
      return;
    }

    try {
      setLoading(true);
      const result = await toggleVoto(denunciaId);
      setHasVoted(result.voted);
      setVotosCount((prev) => (result.voted ? prev + 1 : prev - 1));
      toast.success(result.voted ? "Voto agregado" : "Voto eliminado");
    } catch (error) {
      toast.error("Error al votar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={hasVoted ? "default" : "outline"}
      size="sm"
      onClick={handleVote}
      disabled={loading}
      className="gap-2"
    >
      <ThumbsUp className={`h-4 w-4 ${hasVoted ? "fill-current" : ""}`} />
      <span>{votosCount}</span>
      <span className="hidden sm:inline">
        {votosCount === 1 ? "Apoyo" : "Apoyos"}
      </span>
    </Button>
  );
}
