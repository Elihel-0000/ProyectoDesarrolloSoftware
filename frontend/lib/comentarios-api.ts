import { API_URL } from "./api";

// Comentarios
export async function createComentario(denunciaId: string | number, contenido: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  const res = await fetch(`${API_URL}/denuncias/${denunciaId}/comentarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ contenido }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear comentario");
  }

  return res.json();
}

export async function getComentarios(denunciaId: string | number) {
  const res = await fetch(`${API_URL}/denuncias/${denunciaId}/comentarios`);
  
  if (!res.ok) throw new Error("Error al obtener comentarios");

  const data = await res.json();
  
  return data.map((c: any) => ({
    id: String(c.id),
    contenido: c.contenido,
    creadoEn: c.creadoEn,
    usuario: {
      id: String(c.usuario.id),
      nombre: c.usuario.nombre,
      avatar: c.usuario.avatar,
      rol: c.usuario.rol,
    }
  }));
}

// Votos
export async function toggleVoto(denunciaId: string | number) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  const res = await fetch(`${API_URL}/denuncias/${denunciaId}/votos`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al votar");
  }

  return res.json();
}

export async function getVotosCount(denunciaId: string | number) {
  const res = await fetch(`${API_URL}/denuncias/${denunciaId}/votos/count`);
  
  if (!res.ok) throw new Error("Error al obtener votos");

  return res.json();
}

export async function hasUserVoted(denunciaId: string | number) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  if (!token) return { hasVoted: false };
  
  const res = await fetch(`${API_URL}/denuncias/${denunciaId}/votos/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return { hasVoted: false };

  return res.json();
}

// Perfil de Usuario
export async function getProfile() {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  if (!token) throw new Error("No autenticado");
  
  const res = await fetch(`${API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener perfil");

  return res.json();
}

export async function updateProfile(data: {
  nombre?: string;
  avatar?: string;
  contrasena?: string;
  contrasenaActual?: string;
}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  if (!token) throw new Error("No autenticado");
  
  const res = await fetch(`${API_URL}/users/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar perfil");
  }

  return res.json();
}
