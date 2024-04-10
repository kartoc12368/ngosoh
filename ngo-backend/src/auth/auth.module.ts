import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MailerService } from 'src/mailer/mailer.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { AdminModule } from 'src/admin/admin.module';
import { FundraiserModule } from 'src/fundraiser/fundraiser.module';
import { AuthService } from './auth.service';
import { ForgottenPasswordRepository } from './repo/forgot-password.repo';

@Module({
  imports:[FundraiserModule,AdminModule,MailerModule,PassportModule,UserModule,JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE') + "s"},  
    }),
    inject: [ConfigService],
  })],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, AuthService,ForgottenPasswordRepository],
})
export class AuthModule {}
