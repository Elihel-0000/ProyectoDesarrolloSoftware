import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string) {
    const user: any = await this.usersService.findOne(email);
    const hash = user?.contrasena ?? user?.password;
    if (user && (await bcrypt.compare(pass, hash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { contrasena, password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    const payload = {
      correo: (user as any).correo ?? (user as any).email,
      sub: user.id,
      rol: (user as any).rol ?? (user as any).role,
      nombre: (user as any).nombre ?? (user as any).name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: any) {
    // Check if user exists
    const existingUser = await this.usersService.findOne(data.correo ?? data.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const user = await this.usersService.create(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena, password, ...result } = user as any;
    return result;
  }
}
