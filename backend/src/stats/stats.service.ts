
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // 1. Total de denuncias
    const totaldenuncias = await this.prisma.denuncia.count();

    // 2. Denuncias por estado
    const statusGroups = await this.prisma.denuncia.groupBy({
      by: ['estado'],
      _count: { estado: true },
    });
    
    // Normalizar para asegurar que todos los estados estén presentes
    const statusMap = {
      pending: 0,
      in_progress: 0,
      resolved: 0,
    };
    statusGroups.forEach((g) => {
      if (g.estado in statusMap) {
        statusMap[g.estado] = g._count.estado;
      }
    });

    // 3. Denuncias por categoría
    const categoryGroups = await this.prisma.denuncia.groupBy({
      by: ['categoria'],
      _count: { categoria: true },
    });

    const categoryStats = categoryGroups.map((g) => ({
      category: g.categoria,
      count: g._count.categoria,
    }));

    // 4. Denuncias por fecha (procesamiento JS para datos de gráficas)
    const denuncias = await this.prisma.denuncia.findMany({
      select: { creadoEn: true },
      orderBy: { creadoEn: 'asc' },
    });

    const dateStats = this.processDateStats(denuncias);

    // 5. Usuarios registrados
    const totalUsers = await this.prisma.usuario.count();
    const activeUsers = await this.prisma.usuario.count({
      where: { estado: 'active' },
    });
    const blockedUsers = await this.prisma.usuario.count({
      where: { estado: 'blocked' },
    });

    return {
      denuncias: {
        total: totaldenuncias,
        byStatus: statusMap,
        byCategory: categoryStats,
        byDate: dateStats,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        blocked: blockedUsers,
      },
    };
  }

  private processDateStats(denuncias: { creadoEn: Date }[]) {
    // Funciones auxiliares
    const getWeekNumber = (d: Date) => {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return `${d.getUTCFullYear()}-W${weekNo}`;
    };

    const byDay: Record<string, number> = {};
    const byWeek: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    denuncias.forEach((c) => {
      const date = new Date(c.creadoEn);
      const dayKey = date.toISOString().split('T')[0];
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      const weekKey = getWeekNumber(date);

      byDay[dayKey] = (byDay[dayKey] || 0) + 1;
      byWeek[weekKey] = (byWeek[weekKey] || 0) + 1;
      byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
    });

    // Transformar a formatos de arrays para gráficas si es necesario, o mantener objetos
    // Devolver arreglos ordenados por clave
    const toArray = (obj: Record<string, number>) => 
      Object.entries(obj)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => ({ date: key, count: value }));

    return {
      daily: toArray(byDay),
      weekly: toArray(byWeek),
      monthly: toArray(byMonth),
    };
  }
}
