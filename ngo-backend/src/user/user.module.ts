import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repo/user.repository';
import { Fundraiser } from '../fundraiser/entities/fundraiser.entity';
import { FundRaiserRepository } from '../fundraiser/repo/fundraiser.repository';
import { DonationModule } from 'src/donation/donation.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]),forwardRef(() =>DonationModule)],
  controllers: [UserController],
  providers: [UserService,UserRepository],
  exports:[UserService,UserRepository],
})
export class UserModule {}
