import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { TempCode } from './entities/temp-code.entity';
import { TrustedDevice } from './entities/trusted-device.entity';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TempCode, TrustedDevice]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'cleyverse-super-secret-jwt-key-2025',
      signOptions: { expiresIn: '7d' }, // Default to 7 days
    }),
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
