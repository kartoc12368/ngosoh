import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { FundraiserModule } from 'src/fundraiser/fundraiser.module';
import { UserModule } from 'src/user/user.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { ProjectModule } from 'src/project/project.module';
import { DonationModule } from 'src/donation/donation.module';
import { FundraiserPageModule } from 'src/fundraiser-page/fundraiser-page.module';

@Module({
  imports: [FundraiserModule,UserModule,MailerModule,ProjectModule,DonationModule,FundraiserPageModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports:[AdminService]
})
export class AdminModule {}
