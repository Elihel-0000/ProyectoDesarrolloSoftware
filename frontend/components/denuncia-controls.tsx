"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Clock, AlertCircle, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { actualizarEstadoDenuncia, eliminarDenuncia } from "@/lib/denuncias-api";
import { estadosConfig } from "@/data/mock-data";

interface DenunciaControlsProps {
    denunciaId: string | number;
    currentStatus: string;
}

export function DenunciaControls({ denunciaId, currentStatus }: DenunciaControlsProps) {
    const { usuario } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [status, setStatus] = useState(currentStatus);

    // Determina si el usuario es una autoridad o admin para mostrar controles administrativos
    const isAuthority = usuario && (
        usuario.rol === "autoridad" || 
        usuario.rol === "authority" || 
        usuario.rol === "admin"
    );

    if (!isAuthority) return null;

    const handleStatusChange = async (newStatus: string) => {
        try {
            toast.loading("Actualizando estado...");
            await actualizarEstadoDenuncia(denunciaId, newStatus);
            setStatus(newStatus);
            toast.dismiss();
            toast.success(`Estado actualizado.`);
            router.refresh();
        } catch (error) {
            toast.dismiss();
            toast.error("Error al actualizar el estado");
        }
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await eliminarDenuncia(denunciaId);
            toast.success("Denuncia eliminada permanentemente");
            router.push("/admin");
            router.refresh();
        } catch (error) {
            toast.error("Error al eliminar la denuncia");
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex gap-2 flex-wrap">
            {/* Botones visibles para cambiar estado */}
            <Button 
                variant={status === "pendiente" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange("pendiente")}
                className="flex items-center gap-2"
            >
                <Clock className="h-4 w-4 text-yellow-600" />
                Pendiente
            </Button>
            
            <Button 
                variant={status === "en-revision" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange("en-revision")}
                className="flex items-center gap-2"
            >
                <AlertCircle className="h-4 w-4 text-blue-600" />
                En Revisión
            </Button>
            
            <Button 
                variant={status === "resuelta" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange("resuelta")}
                className="flex items-center gap-2"
            >
                <CheckCircle className="h-4 w-4 text-green-600" />
                Resuelta
            </Button>

            <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar definitivamente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción borrará la denuncia de la base de datos y no se podrá recuperar.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? "Eliminando..." : "Sí, Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
