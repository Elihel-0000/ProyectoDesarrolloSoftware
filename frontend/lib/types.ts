export type EstadoDenuncia = "pendiente" | "en-revision" | "resuelta"

export type CategoriaDenuncia = "bache" | "basura" | "alumbrado" | "semaforo" | "alcantarilla" | "grafiti" | "otro"

export interface Ubicacion {
  lat: number
  lng: number
  direccion: string
}

export interface Denuncia {
  id: string
  titulo: string
  descripcion: string
  categoria: CategoriaDenuncia
  estado: EstadoDenuncia
  fecha: string
  estadoActualizadoEn?: string
  ubicacion: Ubicacion
  imagen: string
  ciudadanoId: string
  ciudadanoNombre: string
  comentarios?: Comentario[]
  votos?: number
  hasVoted?: boolean
}

export interface Comentario {
  id: string
  contenido: string
  creadoEn: string
  usuario: {
    id: string
    nombre: string
    avatar?: string
    rol: string
  }
}

export interface Usuario {
  id: string
  nombre: string
  correo: string
  rol: "ciudadano" | "autoridad" | "admin"
  avatar?: string
  _count?: {
    denuncias: number
    comentarios: number
    votos: number
  }
}

export interface Estadisticas {
  total: number
  pendientes: number
  enRevision: number
  resueltas: number
  porCategoria: Record<CategoriaDenuncia, number>
}
