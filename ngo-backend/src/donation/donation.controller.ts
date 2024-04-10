import { Body, Controller, Param, ParseIntPipe, Post, Req, ValidationPipe } from '@nestjs/common';
import { DonationService } from './donation.service';
import { User } from 'src/user/entities/user.entity';
import { Fundraiser } from 'src/fundraiser/entities/fundraiser.entity';
import { Donation } from './entities/donation.entity';
import { FundraiserService } from 'src/fundraiser/fundraiser.service';
import { Public } from 'src/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { DonateDto } from './dto/donate.dto';

@ApiTags("Donation")
@Controller()
export class DonationController {
  constructor(private readonly donationService: DonationService
    ) {}

    @Post("/donate")
    @Public()
    async donate(@Req()req,@Body(ValidationPipe)body:DonateDto){
      await this.donationService.donate(req,body);
    }
  

  @Post("/fundraiser-page/:id/donate")
  @Public()
  async donateToFundRaiser(@Req()req,@Body(ValidationPipe)body:DonateDto,@Param("id",ParseIntPipe) id:number){
    await this.donationService.donate(req,body,id);
  }


}
