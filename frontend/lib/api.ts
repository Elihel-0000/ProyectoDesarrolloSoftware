export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Obtener una denuncia por su ID
export async function getDenunciaPorId(id: string | number) {
  const res = await fetch(`${API_URL}/denuncias/${id}`);
  if (!res.ok) throw new Error("Error al obtener la denuncia");

  const d = await res.json();

  return {
    id: String(d.id),
    titulo: d.titulo ?? d.title ?? "",
    descripcion: d.descripcion ?? d.description ?? "",
    categoria: (d.categoria ?? d.category ?? "").toLowerCase(),
    estado: (d.estado ?? d.status ?? "")
      .toLowerCase()
      .replace("pending", "pendiente")
      .replace("resolved", "resuelta")
      .replace("in_progress", "en-revision")
      .replace("in progress", "en-revision"),
    fecha: d.creadoEn ?? d.createdAt ?? null,
    estadoActualizadoEn: d.estadoActualizadoEn ?? d.updatedAt ?? null,
    ubicacion: {
      lat: d.latitud ?? d.lat ?? null,
      lng: d.longitud ?? d.lng ?? null,
      direccion: d.direccion ?? d.address ?? "",
    },
    imagen: d.urlImagen ?? d.imageUrl ?? null,
    ciudadanoId: String(d.usuarioId ?? d.userId ?? ""),
    ciudadanoNombre: d.usuario?.nombre ?? d.user?.name ?? "Anónimo",
    comentarios: d.comentarios ?? [],
    votos: d._count?.votos ?? 0,
  };
}

// Obtener denuncias de un usuario específico
export async function getDenunciasPorUsuario(userId: string | number) {
  const res = await fetch(`${API_URL}/denuncias/usuario/${userId}`);
  if (!res.ok) throw new Error("Error al obtener denuncias del usuario");

  const data = await res.json();

  return data.map((d: any) => ({
    id: String(d.id),
    titulo: d.titulo ?? d.title ?? "",
    descripcion: d.descripcion ?? d.description ?? "",
    categoria: (d.categoria ?? d.category ?? "").toLowerCase(),
    estado: (d.estado ?? d.status ?? "")
      .toLowerCase()
      .replace("pending", "pendiente")
      .replace("resolved", "resuelta")
      .replace("in_progress", "en-revision")
      .replace("in progress", "en-revision"),
    fecha: d.creadoEn ?? d.createdAt ?? null,
    estadoActualizadoEn: d.estadoActualizadoEn ?? d.updatedAt ?? null,
    ubicacion: {
      lat: d.latitud ?? d.lat ?? null,
      lng: d.longitud ?? d.lng ?? null,
      direccion: d.direccion ?? d.address ?? "",
    },
    imagen: d.urlImagen ?? d.imageUrl ?? null,
    ciudadanoId: String(d.usuarioId ?? d.userId ?? ""),
    ciudadanoNombre: d.usuario?.nombre ?? d.user?.name ?? "Anónimo",
    votos: d._count?.votos ?? 0,
  }));
}

// Obtener denuncias con filtros
export async function getDenuncias(filters?: { estado?: string; categoria?: string }) {
  const params = new URLSearchParams();

  if (filters?.estado) {
    const statusMap: Record<string, string> = {
      pendiente: "pending",
      "en-revision": "in_progress",
      resuelta: "resolved",
    };
    if (statusMap[filters.estado]) {
      params.append("estado", statusMap[filters.estado]);
    }
  }

  if (filters?.categoria) {
    params.append("categoria", filters.categoria);
  }

  const res = await fetch(`${API_URL}/denuncias?${params.toString()}`);
  if (!res.ok) throw new Error("Error al obtener denuncias");

  const data = await res.json();

  return data.map((d: any) => ({
    id: String(d.id),
    titulo: d.titulo ?? d.title ?? "",
    descripcion: d.descripcion ?? d.description ?? "",
    categoria: (d.categoria ?? d.category ?? "").toLowerCase(),
    estado: (d.estado ?? d.status ?? "")
      .toLowerCase()
      .replace("pending", "pendiente")
      .replace("resolved", "resuelta")
      .replace("in_progress", "en-revision")
      .replace("in progress", "en-revision"),
    fecha: d.creadoEn ?? d.createdAt ?? null,
    estadoActualizadoEn: d.estadoActualizadoEn ?? d.updatedAt ?? null,
    ubicacion: {
      lat: d.latitud ?? d.lat ?? null,
      lng: d.longitud ?? d.lng ?? null,
      direccion: d.direccion ?? d.address ?? "",
    },
    imagen: d.urlImagen ?? d.imageUrl ?? null,
    ciudadanoId: String(d.usuarioId ?? d.userId ?? ""),
    ciudadanoNombre: d.usuario?.nombre ?? d.user?.name ?? "Anónimo",
    votos: d._count?.votos ?? 0,
  }));
}

// Auth
export async function register({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: name, correo: email, contrasena: password }),
  });
  if (!res.ok) throw new Error("Error en el registro");
  return res.json();
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: email, contrasena: password }),
  });
  if (!res.ok) throw new Error("Credenciales incorrectas");
  return res.json();
}

export async function getMe(token: string) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No autenticado");

  const data = await res.json();

  // Mapear rol: mantener autoridad y admin, resto → ciudadano
  let rolMapeado = "ciudadano";
  if (data.rol === "authority" || data.role === "authority" || data.rol === "autoridad") {
    rolMapeado = "autoridad";
  } else if (data.rol === "admin" || data.role === "admin") {
    rolMapeado = "admin";
  } else if (data.rol === "autoridad") {
    rolMapeado = "autoridad";
  }

  return {
    ...data,
    rol: rolMapeado,
  };
}

// Dashboard
export async function getDashboardStats() {
  const res = await fetch(`${API_URL}/denuncias/stats/dashboard`);
  if (!res.ok) throw new Error("Error al obtener estadísticas");

  const d = await res.json();

  return {
    total: d.total ?? 0,
    pendientes: d.byStatus?.pending ?? 0,
    enRevision: d.byStatus?.in_progress ?? 0,
    resueltas: d.byStatus?.resolved ?? 0,
    porCategoria: {
      bache: d.byCategory?.bache ?? 0,
      basura: d.byCategory?.basura ?? 0,
      alumbrado: d.byCategory?.alumbrado ?? 0,
      semaforo: d.byCategory?.semaforo ?? 0,
      alcantarilla: d.byCategory?.alcantarilla ?? 0,
      grafiti: d.byCategory?.grafiti ?? 0,
      otro: d.byCategory?.otro ?? 0,
    },
  };
}
