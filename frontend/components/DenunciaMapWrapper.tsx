"use client";

import dynamic from "next/dynamic";
import React from "react";

// Carga dinámica del mapa en el cliente (evita render en servidor)
const LocationMap = dynamic(() => import("@/components/LocationMap"), {
    ssr: false,
    loading: () => (
        <div className="h-[300px] w-full bg-muted animate-pulse rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Cargando mapa...</p>
        </div>
    ),
});

interface DenunciaMapWrapperProps {
    lat: number;
    lng: number;
    readonly?: boolean;
}

export default function DenunciaMapWrapper({
    lat,
    lng,
    readonly = false,
}: DenunciaMapWrapperProps) {
    return <LocationMap lat={lat} lng={lng} readonly={readonly} onLocationSelect={() => { }} />;
}
