/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UnauthorizedException,
  Delete,
  ForbiddenException,
} from '@nestjs/common';

import { DenunciasService } from './denuncias.service';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('denuncias')
export class DenunciasController {
  constructor(private readonly denunciasService: DenunciasService) { }

  @Get()
  findAll(
    @Query('estado') estado: string,
    @Query('categoria') categoria: string,
  ) {
    return this.denunciasService.findAll({ estado, categoria });
  }

  @Get('usuario/:usuarioId')
  findByUser(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.denunciasService.findByUser(usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() crearDenunciaDto: CreateDenunciaDto,
    @Request() solicitud,
    @UploadedFile() archivo: Express.Multer.File,
  ) {
    const urlImagen = archivo ? `/uploads/${archivo.filename}` : undefined;
    return this.denunciasService.create(
      crearDenunciaDto,
      solicitud.user.usuarioId ?? solicitud.user.userId,
      urlImagen,
    );
  }

  @Get('stats/dashboard')
  getStats() {
    return this.denunciasService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.denunciasService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarEstadoDto: UpdateStatusDto,
    @Request() solicitud,
  ) {
    const userRole = solicitud.user.rol ?? solicitud.user.role;
    if (userRole !== 'authority' && userRole !== 'admin') {
      throw new UnauthorizedException('Only authority or admin can update status');
    }
    const estado = (actualizarEstadoDto as any).estado ?? (actualizarEstadoDto as any).status;
    return this.denunciasService.updateStatus(id, estado);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() solicitud) {
    const denuncia = await this.denunciasService.findOne(id);
    if (!denuncia) {
      throw new ForbiddenException('Complaint not found');
    }

    // Verificar si el usuario es propietario o una autoridad (opcional, buena práctica)
    const usuarioId = solicitud.user.usuarioId ?? solicitud.user.userId;
    const rolUsuario = solicitud.user.rol ?? solicitud.user.role;
    if (denuncia.usuarioId !== usuarioId && rolUsuario !== 'authority') {
      throw new ForbiddenException('You can only delete your own complaints');
    }

    return this.denunciasService.remove(id);
  }

  // Comentarios
  @UseGuards(JwtAuthGuard)
  @Post(':id/comentarios')
  async createComentario(
    @Param('id', ParseIntPipe) id: number,
    @Body() createComentarioDto: CreateComentarioDto,
    @Request() solicitud,
  ) {
    const usuarioId = solicitud.user.usuarioId ?? solicitud.user.userId;
    return this.denunciasService.createComentario(
      id,
      usuarioId,
      createComentarioDto.contenido
    );
  }

  @Get(':id/comentarios')
  getComentarios(@Param('id', ParseIntPipe) id: number) {
    return this.denunciasService.getComentarios(id);
  }

  // Votos
  @UseGuards(JwtAuthGuard)
  @Post(':id/votos')
  async toggleVoto(
    @Param('id', ParseIntPipe) id: number,
    @Request() solicitud,
  ) {
    const usuarioId = solicitud.user.usuarioId ?? solicitud.user.userId;
    return this.denunciasService.toggleVoto(id, usuarioId);
  }

  @Get(':id/votos/count')
  getVotosCount(@Param('id', ParseIntPipe) id: number) {
    return this.denunciasService.getVotosCount(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/votos/me')
  async hasUserVoted(
    @Param('id', ParseIntPipe) id: number,
    @Request() solicitud,
  ) {
    const usuarioId = solicitud.user.usuarioId ?? solicitud.user.userId;
    const hasVoted = await this.denunciasService.hasUserVoted(id, usuarioId);
    return { hasVoted };
  }
}
