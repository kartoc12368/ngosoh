import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { FundraiserModule } from './fundraiser/fundraiser.module';
import { DonationModule } from './donation/donation.module';
import { ProjectModule } from './project/project.module';
import { AdminModule } from './admin/admin.module';
import { FundraiserPageModule } from './fundraiser-page/fundraiser-page.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: '.local.env',}),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      type:'postgres',
      host: configService.get('DATABASE_HOST'),
      port: configService.get<number>('DATABASE_PORT'),
      username: configService.get('DATABASE_USERNAME'),
      password: configService.get('DATABASE_PASSWORD'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: configService.get<boolean>("DATABASE_SYNC"),
      logging: configService.get<boolean>("DATABASE_LOGGING"),
      database: configService.get("DATABASE_NAME"), 

    }),
    inject: [ConfigService],
  }),
  UserModule,
  AuthModule,
  MailerModule,
  FundraiserModule,
  ProjectModule,
  DonationModule,
  AdminModule,
  FundraiserPageModule,
  ScheduleModule.forRoot()
  ],
    
  controllers: [],
  providers: [],
})
export class AppModule {}
