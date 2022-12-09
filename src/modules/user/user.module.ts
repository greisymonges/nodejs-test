import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { JwtStrategy, LocalStrategy } from 'src/common/auth';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Token } from './entities';
import { MailerModule } from '@nestjs-modules/mailer/dist';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [TypeOrmModule.forFeature([User, Token]), PassportModule, 
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
          },
        }),
      }), EmailModule],
    controllers: [UserController],
    providers: [UserService, LocalStrategy, JwtStrategy],
})
export class UserModule {}
