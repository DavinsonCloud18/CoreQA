import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { JwtStrategy } from './jwt.strategy.js';

export const jwtSecret = 'coreqa-super-secret-key-2026';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

@Global()
@Module({
  imports: [
    PrismaModule,
    passportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, JwtModule, passportModule],
})
export class AuthModule { }
