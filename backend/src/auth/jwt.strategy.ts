import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey',
    });
  }

  validate(payload: any) {
    return {
      usuarioId: payload.sub,
      userId: payload.sub,
      id: payload.sub,
      correo: payload.correo ?? payload.email,
      email: payload.correo ?? payload.email,
      rol: payload.rol ?? payload.role,
      role: payload.rol ?? payload.role,
      nombre: payload.nombre ?? payload.name,
      name: payload.nombre ?? payload.name,
    };
  }
}
