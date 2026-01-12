import { mockDenuncias } from "@/data/mock-data"
import type { Estadisticas, CategoriaDenuncia, EstadoDenuncia } from "./types"

export function calcularEstadisticas(): Estadisticas {
  const total = mockDenuncias.length
  const pendientes = mockDenuncias.filter((d) => d.estado === "pendiente").length
  const enRevision = mockDenuncias.filter((d) => d.estado === "en-revision").length
  const resueltas = mockDenuncias.filter((d) => d.estado === "resuelta").length


  const porCategoria: Record<CategoriaDenuncia, number> = {
    bache: mockDenuncias.filter((d) => d.categoria === "bache").length,
    basura: mockDenuncias.filter((d) => d.categoria === "basura").length,
    alumbrado: mockDenuncias.filter((d) => d.categoria === "alumbrado").length,
    semaforo: mockDenuncias.filter((d) => d.categoria === "semaforo").length,
    alcantarilla: mockDenuncias.filter((d) => d.categoria === "alcantarilla").length,
    grafiti: mockDenuncias.filter((d) => d.categoria === "grafiti").length,
    otro: mockDenuncias.filter((d) => d.categoria === "otro").length,
  }

  return {
    total,
    pendientes,
    enRevision,
    resueltas,

    porCategoria,
  }
}

export function obtenerDenunciasPorEstado(estado: EstadoDenuncia) {
  return mockDenuncias.filter((d) => d.estado === estado)
}

export function obtenerDenunciasPorCategoria(categoria: CategoriaDenuncia) {
  return mockDenuncias.filter((d) => d.categoria === categoria)
}
