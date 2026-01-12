import { API_URL } from "./api";

export async function crearDenuncia({
  title,
  description,
  category,
  image,
  lat,
  lng,
  address,
}: {
  title: string;
  description: string;
  category: string;
  image: File;
  lat?: number;
  lng?: number;
  address?: string;
}) {
  const formData = new FormData();
  formData.append("titulo", title);
  formData.append("descripcion", description);
  formData.append("categoria", category);
  formData.append("image", image);
  if (lat) formData.append("latitud", lat.toString());
  if (lng) formData.append("longitud", lng.toString());
  if (address) formData.append("direccion", address);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${API_URL}/denuncias`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al crear denuncia");
  }
  return res.json();
}

export async function eliminarDenuncia(id: string | number) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(`${API_URL}/denuncias/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    throw new Error("Error al eliminar la denuncia");
  }
  return res.json();
}

export async function actualizarEstadoDenuncia(id: string | number, estado: string) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // Mapear estado del frontend al estado del backend
  const statusMap: Record<string, string> = {
    "pendiente": "pending",
    "en-revision": "in_progress",
    "resuelta": "resolved",
  };

  const backendStatus = statusMap[estado];
  if (!backendStatus) throw new Error("Estado no válido");

  const res = await fetch(`${API_URL}/denuncias/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ estado: backendStatus }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar estado");
  }
  return res.json();
}
