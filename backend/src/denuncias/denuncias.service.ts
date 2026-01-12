import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';

@Injectable()
export class DenunciasService {
  constructor(private prisma: PrismaService) { }

  create(
    createDenunciaDto: CreateDenunciaDto,
    usuarioId: number,
    urlImagen?: string,
  ) {
    // Mapear campos del DTO a los campos de Prisma (DTO ya valida/transforma lat/long)
    const data: any = {
      titulo: (createDenunciaDto as any).titulo ?? (createDenunciaDto as any).title,
      descripcion: (createDenunciaDto as any).descripcion ?? (createDenunciaDto as any).description,
      categoria: (createDenunciaDto as any).categoria ?? (createDenunciaDto as any).category,
      latitud: (createDenunciaDto as any).latitud ?? (createDenunciaDto as any).lat,
      longitud: (createDenunciaDto as any).longitud ?? (createDenunciaDto as any).lng,
      direccion: (createDenunciaDto as any).direccion ?? (createDenunciaDto as any).address,
      urlImagen,
      usuarioId,
    };
    return this.prisma.denuncia.create({ data });
  }
  async findByUser(userId: number): Promise<any[]> {
    return this.prisma.denuncia.findMany({ where: { usuarioId: userId } });
  }

  findAll(filters?: { estado?: string; categoria?: string }) {
    const where: any = {};
    if (filters?.estado) where.estado = filters.estado;
    if (filters?.categoria) where.categoria = filters.categoria;

    return this.prisma.denuncia.findMany({
      where,
      orderBy: { creadoEn: 'desc' },
      include: { 
        usuario: { select: { nombre: true, correo: true } },
        _count: {
          select: { votos: true, comentarios: true }
        }
      },
    });
  }

  async findOne(id: number) {
    try {
      return await this.prisma.denuncia.findUnique({
        where: { id },
        include: { 
          usuario: { select: { nombre: true, correo: true, avatar: true } },
          comentarios: {
            include: {
              usuario: { select: { id: true, nombre: true, avatar: true, rol: true } }
            },
            orderBy: { creadoEn: 'desc' }
          },
          votos: {
            include: {
              usuario: { select: { id: true, nombre: true } }
            }
          },
          _count: {
            select: { votos: true, comentarios: true }
          }
        },
      });
    } catch (error) {
      // Fallback si las tablas aún no existen
      return await this.prisma.denuncia.findUnique({
        where: { id },
        include: { 
          usuario: { select: { nombre: true, correo: true, avatar: true } }
        },
      });
    }
  }

  updateStatus(id: number, estado: string) {
    return this.prisma.denuncia.update({ where: { id }, data: { estado } });
  }

  remove(id: number) {
    return this.prisma.denuncia.delete({
      where: { id },
    });
  }

  async getStats() {
    const total = await this.prisma.denuncia.count();
    const byStatus = await this.prisma.denuncia.groupBy({
      by: ['estado'],
      _count: { estado: true },
    });
    const byCategory = await this.prisma.denuncia.groupBy({
      by: ['categoria'],
      _count: { categoria: true },
    });

    return {
      total,
      byStatus: byStatus.reduce(
        (acc, curr) => ({ ...acc, [curr.estado]: curr._count.estado }),
        {},
      ),
      byCategory: byCategory.reduce(
        (acc, curr) => ({ ...acc, [curr.categoria]: curr._count.categoria }),
        {},
      ),
    };
  }

  // Comentarios
  async createComentario(denunciaId: number, usuarioId: number, contenido: string) {
    return this.prisma.comentario.create({
      data: {
        contenido,
        denunciaId,
        usuarioId,
      },
      include: {
        usuario: { select: { id: true, nombre: true, avatar: true, rol: true } }
      }
    });
  }

  async getComentarios(denunciaId: number) {
    return this.prisma.comentario.findMany({
      where: { denunciaId },
      include: {
        usuario: { select: { id: true, nombre: true, avatar: true, rol: true } }
      },
      orderBy: { creadoEn: 'desc' }
    });
  }

  // Votos
  async toggleVoto(denunciaId: number, usuarioId: number) {
    const existingVote = await this.prisma.voto.findUnique({
      where: {
        denunciaId_usuarioId: { denunciaId, usuarioId }
      }
    });

    if (existingVote) {
      await this.prisma.voto.delete({
        where: { id: existingVote.id }
      });
      return { voted: false };
    } else {
      await this.prisma.voto.create({
        data: { denunciaId, usuarioId }
      });
      return { voted: true };
    }
  }

  async getVotosCount(denunciaId: number) {
    return this.prisma.voto.count({
      where: { denunciaId }
    });
  }

  async hasUserVoted(denunciaId: number, usuarioId: number) {
    const vote = await this.prisma.voto.findUnique({
      where: {
        denunciaId_usuarioId: { denunciaId, usuarioId }
      }
    });
    return !!vote;
  }

  async actualizarEstado(
    id: number,
    nuevoEstado: 'pending' | 'in_progress' | 'resolved'
  ) {
    return this.prisma.denuncia.update({
      where: { id },
      data: {
        estado: nuevoEstado,
      },
    });
  }

}
