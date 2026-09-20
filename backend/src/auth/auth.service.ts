import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './auth.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Akun pengguna dinonaktifkan');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      roleId: user.roleId,
      roleName: user.role.name 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name
      }
    };
  }
}
