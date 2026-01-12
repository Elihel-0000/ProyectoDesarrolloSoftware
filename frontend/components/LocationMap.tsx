"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corrección para el icono predeterminado de marcador en Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

interface LocationMapProps {
  lat: number;
  lng: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  readonly?: boolean;
}

function DraggableMarker({
  position,
  setPosition,
  readonly = false,
}: {
  position: { lat: number; lng: number };
  setPosition: (pos: { lat: number; lng: number }) => void;
  readonly?: boolean;
}) {
  const [draggable, setDraggable] = useState(false);
  const map = useMapEvents({
    click(e) {
      if (!readonly) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        setPosition(marker.getLatLng());
      }
    },
  };
  const markerRef = useState<any>(null)[0];

  return (
    <Marker
      draggable={!readonly}
      eventHandlers={!readonly ? eventHandlers : {}}
      position={position}
      ref={markerRef}
      icon={defaultIcon}
    />
  );
}

// Componente para actualizar el centro del mapa cuando cambian las props
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function LocationMap({
  lat,
  lng,
  onLocationSelect,
  readonly = false,
}: LocationMapProps) {
  const [position, setPosition] = useState({ lat, lng });

  useEffect(() => {
    setPosition({ lat, lng });
  }, [lat, lng]);

  const handleSetPosition = (pos: { lat: number; lng: number }) => {
    setPosition(pos);
    if (onLocationSelect) {
      onLocationSelect(pos.lat, pos.lng);
    }
  };

  return (
    <div className="h-[300px] w-full rounded-md overflow-hidden z-0">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={!readonly}
        style={{ height: "100%", width: "100%" }}
        dragging={!readonly}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker position={position} setPosition={handleSetPosition} readonly={readonly} />
        <MapUpdater center={[lat, lng]} />
      </MapContainer>
    </div>
  );
}
