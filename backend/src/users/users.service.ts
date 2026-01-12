import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<any | null> {
    const client: any = (this.prisma as any);
    const model = client.usuario ?? client.user;
    return model.findUnique({ where: { correo: email } });
  }

  async findById(id: number): Promise<any | null> {
    const client: any = (this.prisma as any);
    const model = client.usuario ?? client.user;
    return model.findUnique({ where: { id } });
  }

  async create(data: any): Promise<any> {
    const salt = await bcrypt.genSalt();
    const contrasena = data?.contrasena ?? data?.password;
    const hashedPassword = await bcrypt.hash(contrasena, salt);
    const payload: any = { ...data, contrasena: hashedPassword };
    // remove legacy password if present
    delete payload.password;
    const client: any = (this.prisma as any);
    const model = client.usuario ?? client.user;
    return model.create({ data: payload });
  }

  async updateProfile(userId: number, updateData: UpdateProfileDto): Promise<any> {
    const updatePayload: any = {};
    
    if (updateData.nombre) {
      updatePayload.nombre = updateData.nombre;
    }
    
    if (updateData.avatar) {
      updatePayload.avatar = updateData.avatar;
    }
    
    if (updateData.contrasena && updateData.contrasenaActual) {
      const user = await this.findById(userId);
      const isPasswordValid = await bcrypt.compare(
        updateData.contrasenaActual,
        user.contrasena
      );
      
      if (!isPasswordValid) {
        throw new Error('Contraseña actual incorrecta');
      }
      
      const salt = await bcrypt.genSalt();
      updatePayload.contrasena = await bcrypt.hash(updateData.contrasena, salt);
    }
    
    return this.prisma.usuario.update({
      where: { id: userId },
      data: updatePayload,
      select: {
        id: true,
        correo: true,
        nombre: true,
        rol: true,
        avatar: true,
        estado: true,
      }
    });
  }

  async getProfile(userId: number): Promise<any> {
    return this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        correo: true,
        nombre: true,
        rol: true,
        avatar: true,
        estado: true,
        _count: {
          select: {
            denuncias: true,
            comentarios: true,
            votos: true,
          }
        }
      }
    });
  }
}
