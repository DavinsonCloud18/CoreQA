import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtSecret } from './auth.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    if (payload.type !== 'access') throw new UnauthorizedException();
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
    if (!payload.sid || !(await this.authSessionIsValid(payload.sid, payload.sub))) throw new UnauthorizedException('Sesi berakhir, silakan login kembali');
    return { id: payload.sub, userId: payload.sub, sessionId: payload.sid, email: payload.email, roleId: payload.roleId, roleName: payload.roleName };
  }

  private async authSessionIsValid(sessionId: string, userId: string) {
    // Resolve through the auth service to enforce expiry, revocation and idle timeout.
    return this.authService.validateSession(sessionId, userId);
  }
}
